<script lang="ts">
  import { quantities, activePills, calcMealTotals } from '../stores/state';
  import { MEALS } from '../data/meals';

  $: totals = (() => {
    let c = 0, p = 0, f = 0, kcal = 0;
    for (const meal of MEALS) {
      const t = calcMealTotals(meal, $quantities, $activePills);
      c    += t.c;
      p    += t.p;
      f    += t.f;
      kcal += t.kcal;
    }
    return { c: c.toFixed(1), p: p.toFixed(1), f: f.toFixed(1), kcal: Math.round(kcal) };
  })();
</script>

<section class="daily-totals">
  <h2 class="section-title">Totale giornaliero</h2>
  <div class="totals-card">
    <div class="tot-item kcal-col">
      <div class="tot-val">{totals.kcal}</div>
      <div class="tot-lbl">kcal</div>
    </div>
    <div class="divider"></div>
    <div class="tot-item">
      <div class="tot-val mc-color">{totals.c}g</div>
      <div class="tot-lbl">Carboidrati</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mp-color">{totals.p}g</div>
      <div class="tot-lbl">Proteine</div>
    </div>
    <div class="tot-item">
      <div class="tot-val mf-color">{totals.f}g</div>
      <div class="tot-lbl">Grassi</div>
    </div>
  </div>
  <p class="note">Calcolato sugli alimenti principali selezionati per ogni gruppo</p>
</section>

<style>
  .daily-totals {
    padding: 0 12px 24px;
    max-width: 540px;
    margin: 0 auto;
  }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .8px;
    color: var(--muted);
    margin: 0 0 8px 2px;
  }

  .totals-card {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    display: flex;
    align-items: center;
    padding: 16px 12px;
    gap: 4px;
  }

  .tot-item {
    flex: 1;
    text-align: center;
  }

  .kcal-col { flex: 1.2; }

  .tot-val {
    font-size: 22px;
    font-weight: 800;
    line-height: 1.1;
    color: var(--text);
  }

  .tot-lbl {
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .3px;
    margin-top: 3px;
  }

  .divider {
    width: 1px;
    height: 40px;
    background: var(--border);
    flex-shrink: 0;
    margin: 0 4px;
  }

  .mc-color { color: var(--mc); }
  .mp-color { color: var(--mp); }
  .mf-color { color: var(--mf); }

  .note {
    font-size: 10px;
    color: var(--muted);
    text-align: center;
    margin: 8px 0 0;
  }
</style>
