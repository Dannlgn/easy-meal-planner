<script lang="ts">
  import { activeMeal, resetMeal } from '../stores/state';
  import { MEALS } from '../data/meals';
</script>

<header>
  <div class="header-top">
    <span class="app-title">
      Piano Alimentare
      <span>scaling proporzionale</span>
    </span>
    <button class="btn-reset-all" on:click={() => resetMeal($activeMeal)}>
      ↺ Reset pasto
    </button>
  </div>

  <nav class="tabs">
    {#each MEALS as meal, i}
      <button
        class="tab"
        class:active={$activeMeal === i}
        on:click={() => activeMeal.set(i)}
      >
        {meal.label}
      </button>
    {/each}
  </nav>
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
  }

  .app-title {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -.2px;
  }
  .app-title span {
    opacity: .7;
    font-weight: 400;
    font-size: 13px;
    margin-left: 4px;
  }

  .btn-reset-all {
    background: rgba(255,255,255,.12);
    border: 1.5px solid rgba(255,255,255,.25);
    color: rgba(255,255,255,.9);
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s;
  }
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
  }
  .tab.active {
    color: #fff;
    border-bottom-color: #64B5F6;
    font-weight: 700;
  }
</style>
