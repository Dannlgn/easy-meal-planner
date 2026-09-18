<script lang="ts">
  import GroupCard from './GroupCard.svelte';
  import { quantities } from '../stores/state';
  import type { MealSection, FoodGroup } from '../types';

  export let section: MealSection;
  export let groups: FoodGroup[];

  let expanded = false;

  const SECTION_COLORS: Record<string, string> = {
    'Carboidrati': '#3B82F6',
    'Proteico':    '#A78BFA',
    'Verdura':     '#34D399',
    'Grassi':      '#FBBF24',
    'Fuori Casa':  '#F97316',
  };

  $: dotColor = SECTION_COLORS[section.label] ?? '#AEAEB2';

  $: activeCount    = groups.filter(g =>
    g.items.some((item, i) => ($quantities[g.id]?.[i] ?? item.qty) > 0)
  ).length;
  $: sectionAllZero = activeCount === 0;
</script>

<div class="section-card">
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="section-header" class:all-zero={sectionAllZero} on:click={() => expanded = !expanded}>
    <div class="header-left">
      <span class="dot" style="background: {dotColor}"></span>
      <span class="section-title">{section.label}</span>
      {#if !expanded}
        {#if sectionAllZero}
          <span class="section-count zero">— non incluso</span>
        {:else if activeCount < groups.length}
          <span class="section-count">{activeCount}/{groups.length}</span>
        {:else}
          <span class="section-count">{groups.length}</span>
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
    margin-bottom: 8px;
    overflow: hidden;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 14px;
    background: transparent;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    gap: 8px;
    min-height: 50px;
    transition: background .15s;
  }
  .section-header:active { background: var(--bg3); }
  .section-header.all-zero { opacity: .42; }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .section-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
  }

  .section-count {
    font-size: 11px;
    font-weight: 400;
    color: var(--muted);
    white-space: nowrap;
  }
  .section-count.zero {
    color: rgba(255,255,255,.30);
    font-style: italic;
  }

  .chevron {
    font-size: 16px;
    color: rgba(255,255,255,.30);
    transition: transform .2s ease-out;
    line-height: 1;
    flex-shrink: 0;
  }
  .chevron.open { transform: rotate(180deg); color: rgba(255,255,255,.55); }

  .section-body {
    background: var(--bg);
    padding: 6px;
  }

  .section-body :global(.group-card:last-child) {
    margin-bottom: 0;
  }
</style>
