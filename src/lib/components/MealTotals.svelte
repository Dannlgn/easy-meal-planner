<script lang="ts">
  import { quantities, activePills, getMainIdx } from '../stores/state';
  import { MACRO_DB } from '../data/macros';
  import type { Meal } from '../types';

  export let meal: Meal;

  $: totals = calcTotals($quantities, $activePills);

  function calcTotals(qtys: Record<string, number[]>, pills: Record<string, number>) {
    let c = 0, p = 0, f = 0;
    for (const group of meal.groups) {
      const mIdx  = getMainIdx(group, pills);
      const item  = group.items[mIdx];
      const qty   = qtys[group.id]?.[mIdx] ?? item.qty;
      const macro = MACRO_DB[item.name];
      if (macro) {
        c += (macro.c * qty) / 100;
        p += (macro.p * qty) / 100;
        f += (macro.f * qty) / 100;
      }
    }
    const kcal = c * 4 + p * 4 + f * 9;
    return {
      c: c.toFixed(1),
      p: p.toFixed(1),
      f: f.toFixed(1),
      kcal: Math.round(kcal),
    };
  }
</script>

<div class="meal-totals">
  <div class="totals-label">Totale<br>pasto</div>
  <div class="totals-grid">
    <div class="tot-item">
      <div class="tot-val kcal-color">{totals.kcal}</div>
      <div class="tot-lbl">kcal</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mc-color">{totals.c}g</div>
      <div class="tot-lbl">Carb</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mp-color">{totals.p}g</div>
      <div class="tot-lbl">Prot</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mf-color">{totals.f}g</div>
      <div class="tot-lbl">Grassi</div>
    </div>
  </div>
</div>

<style>
  .meal-totals {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    padding: 12px 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .totals-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .6px;
    color: var(--muted);
    white-space: nowrap;
    line-height: 1.4;
  }

  .totals-grid {
    display: flex;
    flex: 1;
    justify-content: space-around;
  }

  .tot-item { text-align: center; }

  .tot-val {
    font-size: 20px;
    font-weight: 800;
    line-height: 1.1;
  }

  .tot-lbl {
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .3px;
    margin-top: 2px;
  }

  .kcal-color { color: var(--text); }
  .mc-color { color: var(--mc); }
  .mp-color { color: var(--mp); }
  .mf-color { color: var(--mf); }
</style>
