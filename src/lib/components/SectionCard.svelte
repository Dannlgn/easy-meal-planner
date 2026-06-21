<script lang="ts">
  import GroupCard from './GroupCard.svelte';
  import { quantities } from '../stores/state';
  import type { MealSection, FoodGroup } from '../types';

  export let section: MealSection;
  export let groups: FoodGroup[];

  let expanded = false;

  // Quante sottocategorie hanno almeno un alimento > 0g
  $: activeCount    = groups.filter(g =>
    g.items.some((item, i) => ($quantities[g.id]?.[i] ?? item.qty) > 0)
  ).length;
  $: sectionAllZero = activeCount === 0;
</script>

<div class="section-card">
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="section-header" class:all-zero={sectionAllZero} on:click={() => expanded = !expanded}>
    <div class="header-left">
      <span class="section-title">{section.label}</span>
      {#if !expanded}
        {#if sectionAllZero}
          <span class="section-count zero">— non incluso</span>
        {:else if activeCount < groups.length}
          <span class="section-count">{activeCount} {activeCount === 1 ? 'attiva' : 'attive'} su {groups.length}</span>
        {:else}
          <span class="section-count">{groups.length} {groups.length === 1 ? 'categoria' : 'categorie'}</span>
        {/if}
      {/if}
    </div>
    <span class="chevron" class:open={expanded}>▾</span>
  </div>

  {#if expanded}
    <div class="section-body">
      {#each groups as group}
        <GroupCard {group} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .section-card {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    margin-bottom: 10px;
    overflow: hidden;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 14px;
    background: var(--accent);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    gap: 8px;
    min-height: 52px;
    transition: background .15s;
  }
  .section-header:active { background: var(--accent-dk); }
  .section-header.all-zero { opacity: .50; }

  .section-count.zero {
    color: rgba(255,255,255,.40);
    font-style: italic;
  }

  .header-left {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }

  .section-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .8px;
    color: #fff;
    white-space: nowrap;
  }

  .section-count {
    font-size: 11px;
    font-weight: 400;
    color: rgba(255,255,255,.58);
    white-space: nowrap;
  }

  .chevron {
    font-size: 18px;
    color: rgba(255,255,255,.80);
    transition: transform .2s ease-out;
    line-height: 1;
    flex-shrink: 0;
  }
  .chevron.open { transform: rotate(180deg); color: #fff; }

  .section-body {
    background: var(--bg);
    padding: 8px;
  }

  .section-body :global(.group-card:last-child) {
    margin-bottom: 0;
  }
</style>
