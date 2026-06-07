<script lang="ts">
  import { activeMeal, resetMeal, quantities, mainItems } from '../stores/state';
  import { MEALS } from '../data/meals';

  function isMealModified(mealIdx: number, qtys: Record<string, number[]>, mains: Record<string, number>): boolean {
    const meal = MEALS[mealIdx];
    for (const g of meal.groups) {
      const origMain = g.items.findIndex(it => it.main);
      const defaultMain = origMain >= 0 ? origMain : 0;
      if ((mains[g.id] ?? defaultMain) !== defaultMain) return true;
      const current = qtys[g.id];
      if (!current) continue;
      for (let i = 0; i < g.items.length; i++) {
        if (current[i] !== undefined && current[i] !== g.items[i].qty) return true;
      }
    }
    return false;
  }

  function resetAll() {
    MEALS.forEach((_, i) => resetMeal(i));
  }
</script>

<header>
  <div class="header-top">
    <span class="app-title">
      Piano Alimentare
      <span>scaling proporzionale</span>
    </span>
    <div class="header-actions">
      <button class="btn-reset-meal" on:click={() => resetMeal($activeMeal)}>↺ Pasto</button>
      <button class="btn-reset-all" on:click={resetAll}>↺ Tutto</button>
    </div>
  </div>

  <div class="tabs" role="tablist" aria-label="Pasti">
    {#each MEALS as meal, i}
      <button
        class="tab"
        class:active={$activeMeal === i}
        role="tab"
        aria-selected={$activeMeal === i}
        aria-controls="meal-panel-{i}"
        on:click={() => activeMeal.set(i)}
      >
        {meal.label}
        {#if isMealModified(i, $quantities, $mainItems)}
          <span class="mod-dot" aria-label="modificato"></span>
        {/if}
      </button>
    {/each}
  </div>
</header>

<style>
  header {
    background: var(--hdr);
    color: #fff;
    padding: 14px 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 16px rgba(0,0,0,.20);
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    gap: 8px;
  }

  .app-title {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -.2px;
    flex: 1;
    min-width: 0;
  }
  .app-title span {
    opacity: .7;
    font-weight: 400;
    font-size: 13px;
    margin-left: 4px;
  }

  .header-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .btn-reset-meal,
  .btn-reset-all {
    background: rgba(255,255,255,.12);
    border: 1.5px solid rgba(255,255,255,.25);
    color: rgba(255,255,255,.9);
    padding: 5px 11px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s;
    white-space: nowrap;
  }
  .btn-reset-meal:active,
  .btn-reset-all:active { background: rgba(255,255,255,.22); }

  .tabs {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .tabs::-webkit-scrollbar { display: none; }

  .tab {
    flex: 1;
    min-width: 72px;
    padding: 10px 6px 12px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,.5);
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    transition: color .15s, border-color .15s;
    position: relative;
  }
  .tab.active {
    color: #fff;
    border-bottom-color: #64B5F6;
    font-weight: 700;
  }

  .mod-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--mc);
    display: block;
  }
</style>
