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
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: var(--hdr);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 8px 16px calc(8px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -2px 16px rgba(0,0,0,.22);
  }

  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .kcal-item { flex: 1.3; }

  .sep {
    width: 1px;
    height: 32px;
    background: rgba(255,255,255,.18);
    margin: 0 4px;
    flex-shrink: 0;
  }

  .bar-val {
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
  }

  .bar-lbl {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: rgba(255,255,255,.55);
    margin-top: 1px;
  }

  .mc { color: var(--mc); }
  .mp { color: var(--mp); }
  .mf { color: var(--mf); }
</style>
