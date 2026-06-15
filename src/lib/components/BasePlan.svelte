<script lang="ts">
  import { savedBase, quantities, mainItems, saveAsBase, calcMealTotals, getMainIdx } from '../stores/state';
  import { MEALS } from '../data/meals';
  import { MACRO_DB } from '../data/macros';

  $: base = $savedBase;

  $: dailyBase = base ? (() => {
    let c = 0, p = 0, f = 0, kcal = 0;
    for (const meal of MEALS) {
      const t = calcMealTotals(meal, base.quantities, base.mains);
      c += t.c; p += t.p; f += t.f; kcal += t.kcal;
    }
    return { c, p, f, kcal };
  })() : null;

  function mealTotals(meal: typeof MEALS[0]) {
    return base ? calcMealTotals(meal, base.quantities, base.mains) : null;
  }

  function mainItemInfo(meal: typeof MEALS[0], groupId: string) {
    if (!base) return null;
    const group = meal.groups.find(g => g.id === groupId)!;
    const idx   = base.mains[groupId] ?? group.items.findIndex(it => it.main) ?? 0;
    const item  = group.items[idx];
    const qty   = base.quantities[groupId]?.[idx] ?? item.qty;
    const macro = MACRO_DB[item.name];
    const kcal  = macro ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) / 100 * qty) : null;
    return { name: item.name, qty, kcal };
  }
</script>

<div class="base-wrap">
  {#if !base}
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <h2>Nessun piano base salvato</h2>
      <p>Configura i pasti nelle tab <strong>Colazione, Spuntino, Pranzo e Cena</strong>, scegli gli alimenti e le grammature che segui normalmente, poi torna qui e salva il tuo piano di riferimento.</p>
      <button class="btn-save primary" on:click={saveAsBase}>Salva come Piano Base</button>
    </div>
  {:else}
    <div class="base-content">
      {#each MEALS as meal}
        {@const mt = mealTotals(meal)}
        <section class="meal-section">
          <div class="meal-header">
            <span class="meal-label">{meal.label}</span>
            {#if mt}
              <span class="meal-kcal">{Math.round(mt.kcal)} kcal</span>
            {/if}
          </div>

          {#each meal.groups as group}
            {@const info = mainItemInfo(meal, group.id)}
            {#if info}
              <div class="food-row">
                <span class="food-name">{info.name}</span>
                <span class="food-meta">
                  <span class="food-qty">{info.qty}g</span>
                  {#if info.kcal !== null}
                    <span class="food-kcal">{info.kcal} kcal</span>
                  {/if}
                </span>
              </div>
            {/if}
          {/each}

          {#if mt}
            <div class="meal-macros">
              <span class="mc">C <b>{mt.c.toFixed(1)}g</b></span>
              <span class="mp">P <b>{mt.p.toFixed(1)}g</b></span>
              <span class="mf">G <b>{mt.f.toFixed(1)}g</b></span>
            </div>
          {/if}
        </section>
      {/each}

      {#if dailyBase}
        <div class="daily-card">
          <div class="daily-label">Totale giornaliero (base)</div>
          <div class="daily-grid">
            <div class="d-item"><div class="d-val">{Math.round(dailyBase.kcal)}</div><div class="d-lbl">kcal</div></div>
            <div class="d-item"><div class="d-val mc">{dailyBase.c.toFixed(1)}g</div><div class="d-lbl">Carb</div></div>
            <div class="d-item"><div class="d-val mp">{dailyBase.p.toFixed(1)}g</div><div class="d-lbl">Prot</div></div>
            <div class="d-item"><div class="d-val mf">{dailyBase.f.toFixed(1)}g</div><div class="d-lbl">Grassi</div></div>
          </div>
        </div>
      {/if}

      <button class="btn-save" on:click={saveAsBase}>Aggiorna Piano Base con selezioni attuali</button>
    </div>
  {/if}
</div>

<style>
  .base-wrap {
    padding: 16px 14px 120px;
    max-width: 540px;
    margin: 0 auto;
  }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 48px 24px;
  }
  .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state h2 { font-size: 18px; font-weight: 700; color: var(--text); margin: 0 0 12px; }
  .empty-state p { font-size: 14px; color: var(--muted); line-height: 1.6; margin: 0 0 28px; }

  /* ── Meal sections ── */
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

  /* ── Daily card ── */
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

  /* ── Buttons ── */
  .btn-save {
    width: 100%;
    padding: 14px;
    border-radius: var(--r);
    border: 2px solid var(--accent);
    background: transparent;
    color: var(--accent);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s, color .15s;
    margin-bottom: 8px;
  }
  .btn-save.primary {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
  .btn-save:active { opacity: .8; }
</style>
