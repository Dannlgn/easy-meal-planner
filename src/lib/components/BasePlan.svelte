<script lang="ts">
  import { quantities, mainItems, savedBase, saveAsBase, calcMealTotals, getMainIdx } from '../stores/state';
  import { MEALS } from '../data/meals';
  import { MACRO_DB } from '../data/macros';

  // Base tab always shows CURRENT quantities/mains (live state)
  $: qtys  = $quantities;
  $: mains = $mainItems;

  $: dailyTotal = (() => {
    let c = 0, p = 0, f = 0, kcal = 0;
    for (const meal of MEALS) {
      const t = calcMealTotals(meal, qtys, mains);
      c += t.c; p += t.p; f += t.f; kcal += t.kcal;
    }
    return { c, p, f, kcal };
  })();

  function mainItemInfo(meal: typeof MEALS[0], groupId: string) {
    const group = meal.groups.find(g => g.id === groupId)!;
    const idx   = getMainIdx(group, mains);
    const item  = group.items[idx];
    const qty   = qtys[group.id]?.[idx] ?? item.qty;
    const macro = MACRO_DB[item.name];
    const kcal  = macro && qty > 0 ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) / 100 * qty) : null;
    return { name: item.name, qty, kcal };
  }

  $: hasSavedBase = !!$savedBase;
</script>

<div class="base-wrap">
  {#if hasSavedBase}
    <div class="saved-banner">Piano base salvato — modifica i pasti e aggiorna per cambiarlo.</div>
  {:else}
    <div class="info-banner">Configura i pasti e salva questo piano come riferimento. Lo userai per confrontarlo con le variazioni giornaliere nella tab <strong>Oggi</strong>.</div>
  {/if}

  {#each MEALS as meal}
    {@const mt = calcMealTotals(meal, qtys, mains)}
    <section class="meal-section">
      <div class="meal-header">
        <span class="meal-label">{meal.label}</span>
        <span class="meal-kcal">{Math.round(mt.kcal)} kcal</span>
      </div>

      {#each meal.groups as group}
        {@const info = mainItemInfo(meal, group.id)}
        <div class="food-row" class:zero={info.qty === 0}>
          <span class="food-name">{info.name}</span>
          <span class="food-meta">
            <span class="food-qty">{info.qty}g</span>
            {#if info.kcal !== null}
              <span class="food-kcal">{info.kcal} kcal</span>
            {:else}
              <span class="food-kcal zero-label">non mangiato</span>
            {/if}
          </span>
        </div>
      {/each}

      <div class="meal-macros">
        <span class="mc">C <b>{mt.c.toFixed(1)}g</b></span>
        <span class="mp">P <b>{mt.p.toFixed(1)}g</b></span>
        <span class="mf">G <b>{mt.f.toFixed(1)}g</b></span>
      </div>
    </section>
  {/each}

  <div class="daily-card">
    <div class="daily-label">Totale giornaliero</div>
    <div class="daily-grid">
      <div class="d-item"><div class="d-val">{Math.round(dailyTotal.kcal)}</div><div class="d-lbl">kcal</div></div>
      <div class="d-item"><div class="d-val mc">{dailyTotal.c.toFixed(1)}g</div><div class="d-lbl">Carb</div></div>
      <div class="d-item"><div class="d-val mp">{dailyTotal.p.toFixed(1)}g</div><div class="d-lbl">Prot</div></div>
      <div class="d-item"><div class="d-val mf">{dailyTotal.f.toFixed(1)}g</div><div class="d-lbl">Grassi</div></div>
    </div>
  </div>

  <button class="btn-save" on:click={saveAsBase}>
    {hasSavedBase ? 'Aggiorna Piano Base' : 'Salva come Piano Base'}
  </button>
</div>

<style>
  .base-wrap {
    padding: 16px 14px 120px;
    max-width: 540px;
    margin: 0 auto;
  }

  .saved-banner {
    background: #e8f5e9;
    border-left: 3px solid #43a047;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 12px;
    color: #2e7d32;
    margin-bottom: 14px;
    line-height: 1.5;
  }

  .info-banner {
    background: #e3f2fd;
    border-left: 3px solid var(--accent);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 12px;
    color: #1565c0;
    margin-bottom: 14px;
    line-height: 1.5;
  }

  .meal-section {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    margin-bottom: 12px;
    overflow: hidden;
  }

  .meal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--hdr2);
    color: #fff;
  }

  .meal-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .7px;
    opacity: .88;
  }

  .meal-kcal {
    font-size: 12px;
    font-weight: 600;
    opacity: .85;
  }

  .food-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 14px;
    border-bottom: 1px solid var(--border);
    gap: 8px;
  }
  .food-row:last-of-type { border-bottom: none; }
  .food-row.zero { opacity: .45; }

  .food-name {
    font-size: 13px;
    color: var(--text);
    flex: 1;
    min-width: 0;
  }

  .food-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .food-qty {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    min-width: 36px;
    text-align: right;
  }

  .food-kcal {
    font-size: 11px;
    color: var(--muted);
    min-width: 50px;
    text-align: right;
  }

  .zero-label {
    font-style: italic;
    color: var(--muted);
  }

  .meal-macros {
    display: flex;
    gap: 14px;
    padding: 8px 14px;
    background: #f8faff;
    border-top: 1px solid var(--border);
  }
  .meal-macros span { font-size: 11px; font-weight: 500; }
  .meal-macros b { font-weight: 700; }
  .mc { color: var(--mc); }
  .mp { color: var(--mp); }
  .mf { color: var(--mf); }

  .daily-card {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    padding: 16px;
    margin-bottom: 16px;
    border-top: 3px solid var(--accent);
  }

  .daily-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .7px;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .daily-grid {
    display: flex;
    justify-content: space-around;
  }

  .d-item { text-align: center; }
  .d-val { font-size: 22px; font-weight: 800; color: var(--text); }
  .d-val.mc { color: var(--mc); }
  .d-val.mp { color: var(--mp); }
  .d-val.mf { color: var(--mf); }
  .d-lbl { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .3px; margin-top: 2px; }

  .btn-save {
    width: 100%;
    padding: 14px;
    border-radius: var(--r);
    border: none;
    background: var(--accent);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity .15s;
    margin-bottom: 8px;
  }
  .btn-save:active { opacity: .8; }
</style>
