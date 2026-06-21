<script lang="ts">
  import GroupCard from './GroupCard.svelte';
  import type { MealSection, FoodGroup } from '../types';

  export let section: MealSection;
  export let groups: FoodGroup[];

  let expanded = false;
</script>

<div class="section-wrap">
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="section-header" on:click={() => expanded = !expanded}>
    <span class="section-title">{section.label}</span>
    <div class="section-line"></div>
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
  .section-wrap {
    margin-bottom: 4px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 4px 6px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .section-title {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .section-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .chevron {
    font-size: 15px;
    color: var(--accent);
    opacity: .7;
    transition: transform .2s;
    flex-shrink: 0;
    line-height: 1;
  }
  .chevron.open { transform: rotate(180deg); }

  .section-body {
    padding-left: 8px;
  }
</style>
