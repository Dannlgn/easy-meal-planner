<script lang="ts">
  import { activePage, resetMeal, quantities, mainItems, savedBase, calcMealTotals } from '../stores/state';
  import { MEALS } from '../data/meals';
  import HowTo from './HowTo.svelte';

  let howToOpen = false;

  const TABS = [
    { label: 'Oggi',      page: 5 },
    { label: 'Colazione', page: 1 },
    { label: 'Spuntino',  page: 2 },
    { label: 'Pranzo',    page: 3 },
    { label: 'Cena',      page: 4 },
    { label: 'Base',      page: 0 },
  ];

  $: isMealTab = $activePage >= 1 && $activePage <= 4;
  $: mealIdx   = $activePage - 1; // 0-3 when on a meal tab

  function isMealModified(mealIdx: number): boolean {
    const meal = MEALS[mealIdx];
    const base = $savedBase;
    const qtys  = $quantities;
    const mains = $mainItems;
    if (!base) {
      // compare vs data defaults
      for (const g of meal.groups) {
        const dm = Math.max(0, g.items.findIndex(it => it.main));
        if ((mains[g.id] ?? dm) !== dm) return true;
        const cur = qtys[g.id];
        if (cur && cur.some((v, i) => v !== g.items[i].qty)) return true;
      }
      return false;
    }
    // compare vs saved base via kcal delta
    const todayTot = calcMealTotals(meal, qtys, mains);
    const baseTot  = calcMealTotals(meal, base.quantities, base.mains);
    return Math.abs(todayTot.kcal - baseTot.kcal) > 1;
  }

  function resetAll() { MEALS.forEach((_, i) => resetMeal(i)); }
</script>

<header>
  <div class="header-top">
    <div class="title-row">
      <span class="app-title">Piano Alimentare</span>
      <button class="btn-howto" on:click={() => howToOpen = true}>Come funziona</button>
    </div>
    <div class="header-actions"></div>
  </div>

  <div class="tabs" role="tablist" aria-label="Navigazione">
    {#each TABS as tab}
      <button
        class="tab"
        class:active={$activePage === tab.page}
        class:special={tab.page === 0 || tab.page === 5}
        role="tab"
        aria-selected={$activePage === tab.page}
        on:click={() => activePage.set(tab.page)}
      >
        {tab.label}
        {#if tab.page >= 1 && tab.page <= 4 && isMealModified(tab.page - 1)}
          <span class="mod-dot" aria-label="modificato"></span>
        {/if}
      </button>
    {/each}
  </div>
</header>

<HowTo bind:open={howToOpen} />

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
    min-height: 32px;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .app-title {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -.2px;
  }

  .btn-howto {
    background: rgba(255,255,255,.15);
    border: 1px solid rgba(255,255,255,.3);
    color: rgba(255,255,255,.85);
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background .15s;
  }
  .btn-howto:active { background: rgba(255,255,255,.25); }

  .header-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .tabs {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .tabs::-webkit-scrollbar { display: none; }

  .tab {
    flex-shrink: 0;
    padding: 10px 12px 12px;
    text-align: center;
    font-size: 12px;
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
  .tab.special {
    color: rgba(255,255,255,.65);
    font-style: italic;
  }
  .tab.special.active {
    color: #fff;
    font-style: normal;
  }

  .mod-dot {
    position: absolute;
    top: 6px;
    right: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--mc);
    display: block;
  }
</style>
