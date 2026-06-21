<script lang="ts">
  import GroupCard from './GroupCard.svelte';
  import type { MealSection, FoodGroup } from '../types';

  export let section: MealSection;
  export let groups: FoodGroup[];

  let expanded = false;
</script>

<div class="section-card">
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="section-header" on:click={() => expanded = !expanded}>
    <div class="header-left">
      <span class="section-title">{section.label}</span>
      {#if !expanded}
        <span class="section-count">{groups.length} {groups.length === 1 ? 'categoria' : 'categorie'}</span>
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
  }

  .header-left {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }

  .section-title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #fff;
    white-space: nowrap;
  }

  .section-count {
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, .6);
    white-space: nowrap;
  }

  .chevron {
    font-size: 16px;
    color: rgba(255, 255, 255, .85);
    transition: transform .2s;
    line-height: 1;
    flex-shrink: 0;
  }
  .chevron.open { transform: rotate(180deg); }

  .section-body {
    background: var(--bg);
    padding: 8px;
  }

  /* rimuove margine inferiore sull'ultima GroupCard */
  .section-body :global(.group-card:last-child) {
    margin-bottom: 0;
  }
</style>
