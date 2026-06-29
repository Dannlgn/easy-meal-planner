<script lang="ts">
  import { quantities, mainItems, savedBase, calcMealTotals, getMainIdx, resetTodayToBase } from '../stores/state';
  import { MEALS } from '../data/meals';
  import { MACRO_DB } from '../data/macros';

  $: qtys  = $quantities;
  $: mains = $mainItems;
  $: base  = $savedBase;

  type MealRow = {
    label: string;
    today: { kcal: number; c: number; p: number; f: number };
    base:  { kcal: number; c: number; p: number; f: number } | null;
    delta: { kcal: number; c: number; p: number; f: number } | null;
    foods: Array<{ name: string; qty: number; kcal: number | null }>;
  };

  $: mealRows = MEALS.map(meal => {
    const todayTot = calcMealTotals(meal, qtys, mains);
    const baseTot  = base ? calcMealTotals(meal, base.quantities, base.mains) : null;
    const delta    = baseTot ? {
      kcal: todayTot.kcal - baseTot.kcal,
      c:    todayTot.c - baseTot.c,
      p:    todayTot.p - baseTot.p,
      f:    todayTot.f - baseTot.f,
    } : null;

    const foods = meal.groups
      .flatMap(group => {
        if (group.portions) {
          return group.items.map((item, i) => {
            const qty   = qtys[group.id]?.[i] ?? 0;
            const macro = MACRO_DB[item.name];
            const kcal  = macro ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) / 100 * qty) : null;
            return { name: item.name, qty, kcal, unitSize: item.unitSize, unitLabel: item.unitLabel };
          });
        }
        const idx       = getMainIdx(group, mains);
        const item      = group.items[idx];
        const qty       = qtys[group.id]?.[idx] ?? item.qty;
        const macro     = MACRO_DB[item.name];
        const kcal      = macro ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) / 100 * qty) : null;
        return [{ name: item.name, qty, kcal, unitSize: item.unitSize, unitLabel: item.unitLabel }];
      })
      .filter(f => f.qty > 0);

    return { label: meal.label, today: todayTot, base: baseTot, delta, foods } satisfies MealRow;
  });

  $: dailyToday = mealRows.reduce((a, r) => ({
    kcal: a.kcal + r.today.kcal,
    c: a.c + r.today.c,
    p: a.p + r.today.p,
    f: a.f + r.today.f,
  }), { kcal: 0, c: 0, p: 0, f: 0 });

  $: dailyBase = base ? MEALS.reduce((a, meal) => {
    const t = calcMealTotals(meal, base.quantities, base.mains);
    return { kcal: a.kcal + t.kcal, c: a.c + t.c, p: a.p + t.p, f: a.f + t.f };
  }, { kcal: 0, c: 0, p: 0, f: 0 }) : null;

  $: dailyDelta = dailyBase ? {
    kcal: dailyToday.kcal - dailyBase.kcal,
    c:    dailyToday.c - dailyBase.c,
    p:    dailyToday.p - dailyBase.p,
    f:    dailyToday.f - dailyBase.f,
  } : null;

  function sign(v: number) { return v > 0 ? '+' : ''; }
  function deltaClass(v: number) { return v > 1 ? 'pos' : v < -1 ? 'neg' : 'zero'; }
</script>

<div class="today-wrap">
  {#if !base}
    <div class="no-base-banner">
      <span>Nessun piano base salvato — vai alla tab <strong>Base</strong> per configurarlo. Poi usa questa tab ogni giorno.</span>
    </div>
  {:else}
    <button class="btn-reset-today" on:click={resetTodayToBase}>
      ↺ Ripristina piano base
    </button>
  {/if}

  {#each mealRows as row}
    {#if row.foods.length === 0}{:else}
    <section class="meal-section">
      <div class="meal-header">
        <span class="meal-label">{row.label}</span>
        <div class="meal-header-right">
          <span class="meal-kcal">{Math.round(row.today.kcal)} kcal</span>
          {#if row.delta}
            {@const dc = deltaClass(row.delta.kcal)}
            <span class="delta-badge" class:pos={dc==='pos'} class:neg={dc==='neg'} class:zero={dc==='zero'}>
              {sign(row.delta.kcal)}{Math.round(row.delta.kcal)}
            </span>
          {/if}
        </div>
      </div>

      {#each row.foods as food}
        <div class="food-row">
          <span class="food-name">{food.name}</span>
          <span class="food-meta">
            <span class="food-qty">
              {food.unitSize ? Math.round(food.qty / food.unitSize) : food.qty}{food.unitSize ? '' : 'g'}
              {#if food.unitLabel}&nbsp;{food.unitLabel}{/if}
            </span>
            {#if food.kcal !== null}
              <span class="food-kcal">{food.kcal} kcal</span>
            {/if}
          </span>
        </div>
      {/each}

      <div class="meal-macros-row">
        <div class="macro-today">
          <span class="mc">C <b>{row.today.c.toFixed(1)}g</b></span>
          <span class="mp">P <b>{row.today.p.toFixed(1)}g</b></span>
          <span class="mf">G <b>{row.today.f.toFixed(1)}g</b></span>
        </div>
        {#if row.delta}
          <div class="macro-delta">
            <span class="mc {deltaClass(row.delta.c)}">{sign(row.delta.c)}{row.delta.c.toFixed(1)}g</span>
            <span class="mp {deltaClass(row.delta.p)}">{sign(row.delta.p)}{row.delta.p.toFixed(1)}g</span>
            <span class="mf {deltaClass(row.delta.f)}">{sign(row.delta.f)}{row.delta.f.toFixed(1)}g</span>
          </div>
        {/if}
      </div>
    </section>
    {/if}
  {/each}

  <div class="daily-card">
    <div class="daily-label">Totale giornaliero (oggi)</div>
    <div class="daily-grid">
      <div class="d-item">
        <div class="d-val">{Math.round(dailyToday.kcal)}</div>
        <div class="d-lbl">kcal</div>
        {#if dailyDelta}
          <div class="d-delta {deltaClass(dailyDelta.kcal)}">{sign(dailyDelta.kcal)}{Math.round(dailyDelta.kcal)}</div>
        {/if}
      </div>
      <div class="d-item">
        <div class="d-val mc">{dailyToday.c.toFixed(1)}g</div>
        <div class="d-lbl">Carb</div>
        {#if dailyDelta}
          <div class="d-delta mc {deltaClass(dailyDelta.c)}">{sign(dailyDelta.c)}{dailyDelta.c.toFixed(1)}</div>
        {/if}
      </div>
      <div class="d-item">
        <div class="d-val mp">{dailyToday.p.toFixed(1)}g</div>
        <div class="d-lbl">Prot</div>
        {#if dailyDelta}
          <div class="d-delta mp {deltaClass(dailyDelta.p)}">{sign(dailyDelta.p)}{dailyDelta.p.toFixed(1)}</div>
        {/if}
      </div>
      <div class="d-item">
        <div class="d-val mf">{dailyToday.f.toFixed(1)}g</div>
        <div class="d-lbl">Grassi</div>
        {#if dailyDelta}
          <div class="d-delta mf {deltaClass(dailyDelta.f)}">{sign(dailyDelta.f)}{dailyDelta.f.toFixed(1)}</div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .today-wrap {
    padding: 0 0 20px;
  }

  .btn-reset-today {
    width: 100%;
    padding: 12px;
    border-radius: var(--r);
    border: 1.5px solid var(--border);
    background: var(--card);
    color: var(--muted);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 14px;
    min-height: 44px;
    transition: background .15s;
  }
  .btn-reset-today:active { background: var(--bg); }

  .no-base-banner {
    background: var(--warn-bg);
    border-left: 3px solid var(--warn-brd);
    border-radius: var(--r-sm);
    padding: 10px 14px;
    font-size: 12px;
    color: var(--warn-txt);
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
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .8px;
    opacity: .75;
  }

  .meal-header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .meal-kcal {
    font-size: 12px;
    font-weight: 600;
    opacity: .85;
  }

  .delta-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
    background: rgba(255,255,255,.15);
  }
  /* rgba hardcoded: CSS vars non sono usabili dentro rgba() */
  .delta-badge.pos  { background: rgba(239,68,68,.22); }
  .delta-badge.neg  { background: rgba(34,197,94,.22); }
  .delta-badge.zero { opacity: .45; }

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
  .food-qty  { font-size: 13px; font-weight: 700; color: var(--text); min-width: 36px; text-align: right; }
  .food-kcal { font-size: 11px; color: var(--muted); min-width: 50px; text-align: right; }

  .meal-macros-row {
    border-top: 1px solid var(--border);
    background: var(--acl);
    padding: 7px 14px;
  }

  .macro-today { display: flex; gap: 14px; }
  .macro-today span { font-size: 11px; font-weight: 500; }
  .macro-today b { font-weight: 700; }

  .macro-delta { display: flex; gap: 14px; margin-top: 3px; }
  .macro-delta span { font-size: 10px; font-weight: 600; }

  .mc { color: var(--mc); }
  .mp { color: var(--mp); }
  .mf { color: var(--mf); }

  .pos  { color: var(--pos) !important; }
  .neg  { color: var(--neg) !important; }
  .zero { color: var(--muted) !important; }

  .daily-card {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    padding: 16px;
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

  .daily-grid { display: flex; justify-content: space-around; }

  .d-item { text-align: center; }
  .d-val  { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -.4px; }
  .d-val.mc { color: var(--mc); }
  .d-val.mp { color: var(--mp); }
  .d-val.mf { color: var(--mf); }
  .d-lbl  { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .3px; margin-top: 2px; }
  .d-delta { font-size: 11px; font-weight: 700; margin-top: 2px; }
  .d-delta.pos  { color: var(--pos); }
  .d-delta.neg  { color: var(--neg); }
  .d-delta.zero { color: var(--muted); }
</style>
