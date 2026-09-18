<script lang="ts">
  import { quantities, mainItems, calcMealTotals } from '../stores/state';
  import { MEALS } from '../data/meals';

  $: daily = (() => {
    let c = 0, p = 0, f = 0, kcal = 0;
    for (const meal of MEALS) {
      const t = calcMealTotals(meal, $quantities, $mainItems);
      c += t.c; p += t.p; f += t.f; kcal += t.kcal;
    }
    return { c: c.toFixed(1), p: p.toFixed(1), f: f.toFixed(1), kcal: Math.round(kcal) };
  })();
</script>

<div class="sticky-bar">
  <div class="bar-item kcal-item">
    <span class="bar-val">{daily.kcal}</span>
    <span class="bar-lbl">kcal</span>
  </div>
  <div class="sep"></div>
  <div class="bar-item">
    <span class="bar-val mc">{daily.c}g</span>
    <span class="bar-lbl">Carb</span>
  </div>
  <div class="bar-item">
    <span class="bar-val mp">{daily.p}g</span>
    <span class="bar-lbl">Prot</span>
  </div>
  <div class="bar-item">
    <span class="bar-val mf">{daily.f}g</span>
    <span class="bar-lbl">Grassi</span>
  </div>
</div>

<style>
  .sticky-bar {
    position: fixed;
    bottom: var(--botnav-h);
    left: 0;
    right: 0;
    z-index: 200;
    height: var(--totals-h);
    background: rgba(15,23,42,.96);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    box-shadow: 0 -1px 0 rgba(255,255,255,.06);
    border-top: 1px solid rgba(255,255,255,.06);
  }

  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 2px;
  }

  .kcal-item { flex: 1.4; }

  .sep {
    width: 1px;
    height: 28px;
    background: rgba(255,255,255,.1);
    margin: 0 6px;
    flex-shrink: 0;
  }

  .bar-val {
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -.5px;
  }

  .bar-lbl {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .7px;
    color: rgba(255,255,255,.4);
  }

  .mc { color: var(--mc); }
  .mp { color: var(--mp); }
  .mf { color: var(--mf); }
</style>
