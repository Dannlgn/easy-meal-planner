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
    foods: Array<{ name: string; qty: number; kcal: number | null; unitSize?: number; unitLabel?: string }>;
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

  // Ring chart
  const CIRCUM = 2 * Math.PI * 52; // ≈ 326.7
  const GAP = 4;
  $: totalKcal  = dailyToday.kcal || 1;
  $: carbKcal   = dailyToday.c * 4;
  $: protKcal   = dailyToday.p * 4;
  $: fatKcal    = dailyToday.f * 9;
  $: arcTotal   = CIRCUM - GAP * 3;
  $: carbLen    = (carbKcal / totalKcal) * arcTotal;
  $: protLen    = (protKcal / totalKcal) * arcTotal;
  $: fatLen     = (fatKcal  / totalKcal) * arcTotal;
  $: carbOff    = 0;
  $: protOff    = -(carbLen + GAP);
  $: fatOff     = -(carbLen + GAP + protLen + GAP);

  let expandedMeals = new Set<string>();
  function toggleMeal(label: string) {
    expandedMeals = expandedMeals.has(label)
      ? (expandedMeals.delete(label), new Set(expandedMeals))
      : new Set([...expandedMeals, label]);
  }

  function sign(v: number) { return v > 0 ? '+' : ''; }
  function deltaClass(v: number) { return v > 1 ? 'pos' : v < -1 ? 'neg' : 'zero'; }
</script>

<div class="today-wrap">
  {#if !base}
    <div class="no-base-banner">
      Nessun piano base salvato — vai alla tab <strong>Base</strong> per configurarlo.
    </div>
  {:else}
    <button class="btn-reset-today" on:click={resetTodayToBase}>↺ Ripristina piano base</button>
  {/if}

  <!-- Ring chart -->
  <div class="ring-section">
    <svg class="ring-svg" viewBox="0 0 120 120" width="120" height="120">
      <!-- track -->
      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="10"/>
      <!-- carb arc -->
      <circle cx="60" cy="60" r="52" fill="none"
        stroke="#F97316" stroke-width="10"
        stroke-dasharray="{carbLen} {CIRCUM - carbLen}"
        stroke-dashoffset="{carbOff}"
        stroke-linecap="round"
        transform="rotate(-90 60 60)"
      />
      <!-- prot arc -->
      <circle cx="60" cy="60" r="52" fill="none"
        stroke="#A78BFA" stroke-width="10"
        stroke-dasharray="{protLen} {CIRCUM - protLen}"
        stroke-dashoffset="{protOff}"
        stroke-linecap="round"
        transform="rotate(-90 60 60)"
      />
      <!-- fat arc -->
      <circle cx="60" cy="60" r="52" fill="none"
        stroke="#FBBF24" stroke-width="10"
        stroke-dasharray="{fatLen} {CIRCUM - fatLen}"
        stroke-dashoffset="{fatOff}"
        stroke-linecap="round"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="56" text-anchor="middle" fill="#F5F5F7" font-size="18" font-weight="800" font-family="Outfit, sans-serif">{Math.round(dailyToday.kcal)}</text>
      <text x="60" y="70" text-anchor="middle" fill="#AEAEB2" font-size="10" font-family="Outfit, sans-serif">kcal</text>
    </svg>

    <div class="macro-pills">
      <div class="macro-pill mc">
        <span class="pill-dot" style="background:#F97316"></span>
        <span class="pill-label">Carb</span>
        <span class="pill-val">{dailyToday.c.toFixed(0)}g</span>
        {#if dailyDelta}<span class="pill-delta {deltaClass(dailyDelta.c)}">{sign(dailyDelta.c)}{dailyDelta.c.toFixed(0)}</span>{/if}
      </div>
      <div class="macro-pill mp">
        <span class="pill-dot" style="background:#A78BFA"></span>
        <span class="pill-label">Prot</span>
        <span class="pill-val">{dailyToday.p.toFixed(0)}g</span>
        {#if dailyDelta}<span class="pill-delta {deltaClass(dailyDelta.p)}">{sign(dailyDelta.p)}{dailyDelta.p.toFixed(0)}</span>{/if}
      </div>
      <div class="macro-pill mf">
        <span class="pill-dot" style="background:#FBBF24"></span>
        <span class="pill-label">Grassi</span>
        <span class="pill-val">{dailyToday.f.toFixed(0)}g</span>
        {#if dailyDelta}<span class="pill-delta {deltaClass(dailyDelta.f)}">{sign(dailyDelta.f)}{dailyDelta.f.toFixed(0)}</span>{/if}
      </div>
    </div>
  </div>

  <!-- Meal cards -->
  {#each mealRows as row}
    {#if row.foods.length > 0}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="meal-card" on:click={() => toggleMeal(row.label)}>
      <div class="meal-card-header">
        <div class="meal-card-left">
          <span class="meal-card-label">{row.label}</span>
          <span class="meal-card-kcal">{Math.round(row.today.kcal)} kcal</span>
        </div>
        <div class="meal-card-right">
          {#if row.delta}
            {@const dc = deltaClass(row.delta.kcal)}
            <span class="delta-badge" class:pos={dc==='pos'} class:neg={dc==='neg'} class:zero={dc==='zero'}>
              {sign(row.delta.kcal)}{Math.round(row.delta.kcal)}
            </span>
          {/if}
          <span class="chevron" class:open={expandedMeals.has(row.label)}>▾</span>
        </div>
      </div>

      {#if expandedMeals.has(row.label)}
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
        <div class="meal-card-body" on:click|stopPropagation>
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
            <span class="mc">C <b>{row.today.c.toFixed(1)}g</b></span>
            <span class="mp">P <b>{row.today.p.toFixed(1)}g</b></span>
            <span class="mf">G <b>{row.today.f.toFixed(1)}g</b></span>
            {#if row.delta}
              <span class="delta-macros">
                <span class="{deltaClass(row.delta.c)}">{sign(row.delta.c)}{row.delta.c.toFixed(0)}C</span>
                <span class="{deltaClass(row.delta.p)}">{sign(row.delta.p)}{row.delta.p.toFixed(0)}P</span>
                <span class="{deltaClass(row.delta.f)}">{sign(row.delta.f)}{row.delta.f.toFixed(0)}G</span>
              </span>
            {/if}
          </div>
        </div>
      {/if}
    </div>
    {/if}
  {/each}
</div>

<style>
  .today-wrap { padding: 0 0 20px; }

  .btn-reset-today {
    width: 100%;
    padding: 11px;
    border-radius: var(--r);
    border: 1px solid var(--border);
    background: var(--card);
    color: rgba(255,255,255,.35);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 16px;
    min-height: 40px;
    font-family: inherit;
    transition: background .15s;
  }
  .btn-reset-today:active { background: var(--bg3); }

  .no-base-banner {
    background: var(--warn-bg);
    border-left: 3px solid var(--warn-brd);
    border-radius: var(--r-sm);
    padding: 10px 14px;
    font-size: 12px;
    color: var(--warn-txt);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  /* ── Ring ── */
  .ring-section {
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--card);
    border-radius: var(--r-lg);
    padding: 16px 18px;
    margin-bottom: 14px;
  }

  .ring-svg { flex-shrink: 0; }

  .macro-pills {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }

  .macro-pill {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .pill-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pill-label {
    font-size: 11px;
    color: var(--muted);
    font-weight: 500;
    min-width: 32px;
  }

  .pill-val {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    flex: 1;
  }

  .pill-delta {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 8px;
    background: rgba(255,255,255,.07);
  }
  .pill-delta.pos  { color: var(--pos); }
  .pill-delta.neg  { color: var(--neg); }
  .pill-delta.zero { color: var(--muted); }

  /* ── Meal cards ── */
  .meal-card {
    background: var(--card);
    border-radius: var(--r);
    margin-bottom: 8px;
    overflow: hidden;
    cursor: pointer;
  }

  .meal-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    gap: 8px;
  }

  .meal-card-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .meal-card-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255,255,255,.28);
  }

  .meal-card-kcal {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
  }

  .meal-card-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .delta-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 10px;
    background: rgba(255,255,255,.08);
    color: var(--muted);
  }
  .delta-badge.pos  { background: rgba(248,113,113,.15); color: var(--pos); }
  .delta-badge.neg  { background: rgba(52,211,153,.15);  color: var(--neg); }
  .delta-badge.zero { opacity: .5; }

  .chevron {
    font-size: 16px;
    color: rgba(255,255,255,.25);
    transition: transform .2s ease-out;
    line-height: 1;
  }
  .chevron.open { transform: rotate(180deg); color: rgba(255,255,255,.5); }

  .meal-card-body {
    border-top: 1px solid var(--border);
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
  .food-name { font-size: 13px; color: var(--text); flex: 1; min-width: 0; }
  .food-meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .food-qty  { font-size: 13px; font-weight: 700; color: var(--text); min-width: 36px; text-align: right; }
  .food-kcal { font-size: 11px; color: var(--muted); min-width: 50px; text-align: right; }

  .meal-macros-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 14px;
    background: rgba(59,130,246,.07);
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .meal-macros-row span { font-size: 11px; font-weight: 500; }
  .meal-macros-row b   { font-weight: 700; }

  .delta-macros {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }
  .delta-macros span { font-size: 10px; font-weight: 600; }

  .mc { color: var(--mc); }
  .mp { color: var(--mp); }
  .mf { color: var(--mf); }
  .pos  { color: var(--pos) !important; }
  .neg  { color: var(--neg) !important; }
  .zero { color: var(--muted) !important; }
</style>
