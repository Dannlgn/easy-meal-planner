<script lang="ts">
  import { savedBase, saveAsBase, calcMealTotals, getMainIdx, activePage } from '../stores/state';
  import { MEALS } from '../data/meals';
  import { MACRO_DB } from '../data/macros';

  $: base = $savedBase;

  type FoodInfo = { name: string; qty: number; kcal: number | null };

  function groupFood(groupId: string, items: typeof MEALS[0]['groups'][0]['items']): FoodInfo | null {
    if (!base) return null;
    const idx  = base.mains[groupId] ?? Math.max(0, items.findIndex(it => it.main));
    const item = items[idx];
    const qty  = base.quantities[groupId]?.[idx] ?? item.qty;
    if (qty <= 0) return null;
    const macro = MACRO_DB[item.name];
    const kcal  = macro ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) / 100 * qty) : null;
    return { name: item.name, qty, kcal };
  }

  // Single reactive computation — Svelte tracks `base` correctly
  $: mealRows = base ? MEALS.map(meal => ({
    label: meal.label,
    mt:    calcMealTotals(meal, base.quantities, base.mains),
    foods: meal.groups.map(g => groupFood(g.id, g.items)).filter((x): x is FoodInfo => x !== null),
  })) : null;

  $: dailyBase = base ? (() => {
    let c = 0, p = 0, f = 0, kcal = 0;
    for (const meal of MEALS) {
      const t = calcMealTotals(meal, base.quantities, base.mains);
      c += t.c; p += t.p; f += t.f; kcal += t.kcal;
    }
    return { c, p, f, kcal };
  })() : null;

  let confirmUpdate = false;

  function handleUpdate() {
    if (!confirmUpdate) { confirmUpdate = true; return; }
    saveAsBase();
    confirmUpdate = false;
  }

  function cancelUpdate() { confirmUpdate = false; }
</script>

<div class="base-wrap">
  {#if !base}
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <h2>Nessun piano base salvato</h2>
      <p>Configura i pasti nelle tab <strong>Colazione, Spuntino, Pranzo e Cena</strong>, poi torna qui e salva il tuo piano di riferimento.</p>
      <p class="hint">Il piano base è fisso — le modifiche giornaliere non lo toccano mai.</p>
      <div class="empty-actions">
        <button class="btn-meal" on:click={() => activePage.set(1)}>Vai a Colazione →</button>
        <button class="btn-save primary" on:click={saveAsBase}>Salva piano attuale come Base</button>
      </div>
    </div>
  {:else}
    <div class="base-label-row">
      <span class="base-label">Piano di riferimento</span>
      <span class="base-hint">fisso — non cambia con le sostituzioni</span>
    </div>

    {#each mealRows ?? [] as row}
      <section class="meal-section">
        <div class="meal-header">
          <span class="meal-label">{row.label}</span>
          <span class="meal-kcal">{Math.round(row.mt.kcal)} kcal</span>
        </div>

        {#each row.foods as food}
          <div class="food-row">
            <span class="food-name">{food.name}</span>
            <span class="food-meta">
              <span class="food-qty">{food.qty}g</span>
              {#if food.kcal !== null}
                <span class="food-kcal">{food.kcal} kcal</span>
              {/if}
            </span>
          </div>
        {/each}

        <div class="meal-macros">
          <span class="mc">C <b>{row.mt.c.toFixed(1)}g</b></span>
          <span class="mp">P <b>{row.mt.p.toFixed(1)}g</b></span>
          <span class="mf">G <b>{row.mt.f.toFixed(1)}g</b></span>
        </div>
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

    {#if confirmUpdate}
      <div class="confirm-box">
        <p>Vuoi sovrascrivere il piano base con le selezioni attuali?</p>
        <div class="confirm-actions">
          <button class="btn-cancel" on:click={cancelUpdate}>Annulla</button>
          <button class="btn-confirm-ok" on:click={handleUpdate}>Sì, aggiorna</button>
        </div>
      </div>
    {:else}
      <button class="btn-save" on:click={handleUpdate}>Aggiorna piano base</button>
    {/if}
  {/if}
</div>

<style>
  .base-wrap {
    padding: 16px 14px 120px;
    max-width: 540px;
    margin: 0 auto;
  }

  .base-label-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 14px;
  }
  .base-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .base-hint { font-size: 11px; color: var(--muted); }

  .empty-state { text-align: center; padding: 32px 16px; }
  .empty-icon { font-size: 44px; margin-bottom: 14px; }
  .empty-state h2 { font-size: 17px; font-weight: 700; color: var(--text); margin: 0 0 10px; }
  .empty-state p { font-size: 13px; color: var(--muted); line-height: 1.6; margin: 0 0 8px; }
  .empty-state .hint { font-size: 12px; color: var(--accent); font-style: italic; margin-bottom: 24px; }
  .empty-actions { display: flex; flex-direction: column; gap: 10px; }
  .btn-meal {
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--accent);
    padding: 11px;
    border-radius: var(--r);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
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
  .meal-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; opacity: .88; }
  .meal-kcal { font-size: 12px; font-weight: 600; opacity: .85; }

  .food-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 14px;
    border-bottom: 1px solid var(--border);
    gap: 8px;
  }
  .food-row:last-of-type { border-bottom: none; }
  .food-name { font-size: 13px; color: var(--text); flex: 1; min-width: 0; }
  .food-meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .food-qty { font-size: 13px; font-weight: 700; color: var(--text); min-width: 36px; text-align: right; }
  .food-kcal { font-size: 11px; color: var(--muted); min-width: 50px; text-align: right; }

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
  .daily-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; color: var(--accent); margin-bottom: 12px; }
  .daily-grid { display: flex; justify-content: space-around; }
  .d-item { text-align: center; }
  .d-val { font-size: 22px; font-weight: 800; color: var(--text); }
  .d-val.mc { color: var(--mc); }
  .d-val.mp { color: var(--mp); }
  .d-val.mf { color: var(--mf); }
  .d-lbl { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .3px; margin-top: 2px; }

  .btn-save {
    width: 100%;
    padding: 13px;
    border-radius: var(--r);
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 8px;
  }
  .btn-save:active { opacity: .7; }
  .btn-save.primary { background: var(--accent); color: #fff; border-color: var(--accent); }

  .confirm-box {
    background: #fff8e1;
    border: 1.5px solid #ffc107;
    border-radius: var(--r);
    padding: 14px;
    margin-bottom: 8px;
  }
  .confirm-box p { font-size: 13px; color: #5d4037; margin-bottom: 12px; line-height: 1.5; }
  .confirm-actions { display: flex; gap: 10px; }
  .btn-cancel {
    flex: 1; padding: 10px; border-radius: var(--r);
    border: 1.5px solid var(--border); background: #fff; color: var(--muted);
    font-size: 13px; font-weight: 600; cursor: pointer;
  }
  .btn-confirm-ok {
    flex: 1; padding: 10px; border-radius: var(--r);
    border: none; background: #f44336; color: #fff;
    font-size: 13px; font-weight: 700; cursor: pointer;
  }
</style>
