<script lang="ts">
  import { quantities, mainItems, calcMealTotals } from '../stores/state';
  import type { Meal } from '../types';

  export let meal: Meal;

  $: raw    = calcMealTotals(meal, $quantities, $mainItems);
  $: totals = { c: raw.c.toFixed(1), p: raw.p.toFixed(1), f: raw.f.toFixed(1), kcal: Math.round(raw.kcal) };
</script>

<div class="meal-totals">
  <div class="totals-label">Totale<br>pasto</div>
  <div class="totals-grid">
    <div class="tot-item">
      <div class="tot-val kcal-val">{totals.kcal}</div>
      <div class="tot-lbl">kcal</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mc-val">{totals.c}g</div>
      <div class="tot-lbl">Carb</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mp-val">{totals.p}g</div>
      <div class="tot-lbl">Prot</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mf-val">{totals.f}g</div>
      <div class="tot-lbl">Grassi</div>
    </div>
  </div>
</div>

<style>
  .meal-totals {
    background: var(--acl);
    border-radius: var(--r);
    box-shadow: var(--sh);
    padding: 12px 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-top: 3px solid var(--accent);
  }

  .totals-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .6px;
    color: var(--accent);
    white-space: nowrap;
    line-height: 1.5;
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
    letter-spacing: -.3px;
  }

  .tot-lbl {
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .4px;
    margin-top: 2px;
  }

  .kcal-val { color: var(--text); }
  .mc-val   { color: var(--mc); }
  .mp-val   { color: var(--mp); }
  .mf-val   { color: var(--mf); }
</style>
