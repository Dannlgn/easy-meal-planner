<script lang="ts">
  import { quantities } from '../stores/state';
  import { MACRO_DB } from '../data/macros';
  import type { FoodGroup } from '../types';

  export let group: FoodGroup;

  const ML_ITEMS = new Set(['Cappuccino', 'Succo di frutta brick', 'Frappuccino caffè freddo']);

  const PLURALI: Record<string, string> = {
    'pizza':      'pizze',
    'fetta':      'fette',
    'panino':     'panini',
    'piadina':    'piadine',
    'porzione':   'porzioni',
    'granita':    'granite',
    'bistecca':   'bistecche',
    'piatto':     'piatti',
    'cono':       'coni',
    'ghiacciolo': 'ghiaccioli',
    'bombolone':  'bomboloni',
    'cappuccino': 'cappuccini',
    'cornetto':   'cornetti',
    'bicchiere':  'bicchieri',
    'tramezzino': 'tramezzini',
    'vassoio':    'vassoi',
    // invariabili: croissant, Magnum, muffin, brioche, brick, yogurt, kebab, wrap, burger
  };

  function plural(unit: string | undefined, n: number): string {
    if (!unit) return '';
    return n === 1 ? unit : (PLURALI[unit] ?? unit);
  }

  let infoDismissed = localStorage.getItem('mp_fc_info_dismissed') === '1';

  function dismissInfo() {
    infoDismissed = true;
    localStorage.setItem('mp_fc_info_dismissed', '1');
  }

  function add(idx: number) {
    quantities.update(q => {
      const arr = [...(q[group.id] ?? group.items.map(() => 0))];
      arr[idx] = (arr[idx] ?? 0) + 1;
      return { ...q, [group.id]: arr };
    });
  }

  function sub(idx: number) {
    quantities.update(q => {
      const arr = [...(q[group.id] ?? group.items.map(() => 0))];
      if ((arr[idx] ?? 0) <= 0) return q;
      arr[idx] = (arr[idx] as number) - 1;
      return { ...q, [group.id]: arr };
    });
  }

  $: qtys = $quantities[group.id] ?? group.items.map(() => 0);

  $: rows = group.items.map((item, i) => {
    const portions = qtys[i] ?? 0;
    const macro    = MACRO_DB[item.name];
    const isMl     = ML_ITEMS.has(item.name);
    const sizeStr  = `${item.qty}${isMl ? 'ml' : 'g'}`;
    const unit     = item.portionUnit ?? 'porzione';
    const kcalPer  = macro
      ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) * item.qty / 100)
      : null;
    const grams    = portions * item.qty;
    const kcalTot  = macro && portions > 0
      ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) * grams / 100)
      : 0;
    const cTot     = macro ? Math.round(macro.c * grams / 100) : 0;
    const pTot     = macro ? Math.round(macro.p * grams / 100) : 0;
    const fTot     = macro ? Math.round(macro.f * grams / 100) : 0;
    return { item, i, portions, unit, sizeStr, kcalPer, kcalTot, cTot, pTot, fTot };
  });

  $: activeRows = rows.filter(r => r.portions > 0);

  $: total = activeRows.reduce(
    (a, r) => ({ kcal: a.kcal + r.kcalTot, c: a.c + r.cTot, p: a.p + r.pTot, f: a.f + r.fTot }),
    { kcal: 0, c: 0, p: 0, f: 0 },
  );

  $: summaryText = activeRows.length === 0
    ? 'Nessun alimento selezionato'
    : activeRows.map(r => `${r.portions} ${plural(r.unit, r.portions)}`).join(' + ');
</script>

<div class="fc-card">
  <!-- Header -->
  <div class="fc-header">
    <span class="fc-title">{group.label}</span>
    {#if activeRows.length > 0}
      <span class="fc-badge">{activeRows.length} selezionat{activeRows.length === 1 ? 'o' : 'i'}</span>
    {/if}
  </div>

  <!-- Banner informativo (si chiude per sempre al tap ✕) -->
  {#if !infoDismissed}
    <div class="fc-banner">
      <span class="fc-banner-text">
        Seleziona più alimenti contemporaneamente. Usa + e − per le porzioni. Valori approssimativi.
      </span>
      <button class="fc-banner-close" on:click={dismissInfo} aria-label="Chiudi">✕</button>
    </div>
  {/if}

  <!-- Lista alimenti -->
  <div class="fc-list">
    {#each rows as row}
      <div class="fc-item" class:active={row.portions > 0}>
        <div class="fc-item-top">
          <div class="fc-item-info">
            <span class="fc-item-name">{row.item.name}</span>
            <span class="fc-item-sub">
              {row.sizeStr}{row.kcalPer !== null ? ` · ${row.kcalPer} kcal per ${row.unit}` : ''}
            </span>
          </div>
          <div class="fc-stepper">
            <button
              class="fc-btn"
              disabled={row.portions === 0}
              on:click={() => sub(row.i)}
              aria-label="Riduci {row.item.name}"
            >−</button>
            <span class="fc-qty">{row.portions} {plural(row.unit, row.portions)}</span>
            <button
              class="fc-btn"
              on:click={() => add(row.i)}
              aria-label="Aggiungi {row.item.name}"
            >+</button>
          </div>
        </div>

        {#if row.portions > 0}
          <div class="fc-item-macros">
            <span class="mc">C: {row.cTot}g</span>
            <span class="mp">P: {row.pTot}g</span>
            <span class="mf">G: {row.fTot}g</span>
            <span class="fc-kcal">· {row.kcalTot} kcal</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Totale sezione -->
  <div class="fc-total" class:empty={activeRows.length === 0}>
    <span class="fc-total-label">Totale {group.label}</span>
    <span class="fc-total-summary">{summaryText}</span>
    {#if activeRows.length > 0}
      <div class="fc-total-macros">
        <span class="fc-total-kcal">{total.kcal} kcal</span>
        <span class="mc">C: {total.c}g</span>
        <span class="mp">P: {total.p}g</span>
        <span class="mf">G: {total.f}g</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .fc-card {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    margin-bottom: 8px;
    overflow: hidden;
  }

  /* Header */
  .fc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    background: var(--hdr2);
    color: #fff;
    min-height: 44px;
  }
  .fc-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .8px;
    opacity: .65;
  }
  .fc-badge {
    font-size: 10px;
    font-weight: 700;
    background: var(--accent);
    color: #fff;
    border-radius: 10px;
    padding: 2px 9px;
    opacity: 1;
  }

  /* Banner */
  .fc-banner {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 9px 14px;
    background: var(--acl);
    border-bottom: 1px solid var(--border);
  }
  .fc-banner-text {
    flex: 1;
    font-size: 11px;
    color: var(--text);
    line-height: 1.5;
    opacity: .75;
  }
  .fc-banner-close {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 14px;
    cursor: pointer;
    padding: 0 4px;
    flex-shrink: 0;
    min-height: 28px;
    min-width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Lista */
  .fc-list { /* no extra padding */ }

  .fc-item {
    padding: 11px 14px;
    border-bottom: 1px solid var(--border);
    border-left: 3px solid transparent;
    transition: background .15s, border-color .15s;
  }
  .fc-item:last-child { border-bottom: none; }
  .fc-item.active {
    background: var(--acl);
    border-left-color: var(--accent);
    padding-left: 11px;
  }

  .fc-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .fc-item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .fc-item-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
  }
  .fc-item-sub {
    font-size: 11px;
    color: var(--muted);
  }

  /* Stepper */
  .fc-stepper {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .fc-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: var(--card);
    color: var(--text);
    font-size: 20px;
    font-weight: 300;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .12s, border-color .12s;
    flex-shrink: 0;
    padding: 0;
    /* area tocco estesa senza ingrandire visualmente il bottone */
    position: relative;
  }
  .fc-btn::after {
    content: '';
    position: absolute;
    inset: -8px;
  }
  .fc-btn:active:not(:disabled) {
    background: var(--acl);
    border-color: var(--accent);
  }
  .fc-btn:disabled {
    opacity: .35;
    cursor: default;
  }
  .fc-qty {
    font-size: 12px;
    font-weight: 700;
    color: var(--text);
    min-width: 64px;
    text-align: center;
  }

  /* Macro per item */
  .fc-item-macros {
    display: flex;
    gap: 10px;
    margin-top: 7px;
    font-size: 11px;
    font-weight: 600;
    flex-wrap: wrap;
  }
  .mc  { color: var(--mc); }
  .mp  { color: var(--mp); }
  .mf  { color: var(--mf); }
  .fc-kcal { color: var(--muted); font-weight: 400; }

  /* Totale sezione */
  .fc-total {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 11px 14px;
    background: var(--bg);
    border-top: 1.5px solid var(--border);
  }
  .fc-total-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: var(--accent);
  }
  .fc-total-summary {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.4;
  }
  .fc-total.empty .fc-total-summary {
    font-style: italic;
    opacity: .6;
  }
  .fc-total-macros {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 2px;
  }
  .fc-total-kcal {
    font-size: 15px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -.3px;
  }
  .fc-total-macros .mc,
  .fc-total-macros .mp,
  .fc-total-macros .mf {
    font-size: 12px;
    font-weight: 600;
  }
</style>
