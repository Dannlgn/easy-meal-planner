<script lang="ts">
  import ItemRow from './ItemRow.svelte';
  import { mainItems, quantities, resetGroup, getMainIdx } from '../stores/state';
  import { MACRO_DB } from '../data/macros';
  import type { FoodGroup } from '../types';

  export let group: FoodGroup;

  let expanded = false;

  $: mainIdx  = getMainIdx(group, $mainItems);
  $: mainItem = group.items[mainIdx];
  $: mainQty  = $quantities[group.id]?.[mainIdx] ?? mainItem.qty;
  $: macro    = MACRO_DB[mainItem.name];
  $: mainKcal = macro && mainQty > 0
    ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) / 100 * mainQty)
    : null;

  function showSep(idx: number): boolean {
    if (group.items.length <= 1) return false;
    return idx === mainIdx + 1;
  }

  function handleReset(e: MouseEvent) {
    e.stopPropagation();
    resetGroup(group.id);
  }
</script>

<div class="group-card">
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="group-header" on:click={() => expanded = !expanded}>
    <div class="header-left">
      <span class="group-title">{group.label}</span>
      {#if !expanded}
        <span class="main-preview">
          {mainItem.name}
          {#if mainQty > 0}<span class="preview-qty">{mainQty}g</span>{/if}
          {#if mainKcal !== null}<span class="preview-kcal">{mainKcal} kcal</span>{/if}
        </span>
      {/if}
    </div>
    <div class="header-right">
      <span class="chevron" class:open={expanded}>▾</span>
    </div>
  </div>

  {#if expanded}
    {#each group.items as item, idx}
      {#if showSep(idx)}
        <div class="item-sep"></div>
      {/if}
      <ItemRow {group} {item} {idx} isMain={idx === mainIdx} />
    {/each}
    <div class="card-footer">
      <button class="btn-reset" on:click={handleReset}>↺ Ripristina valori</button>
    </div>
  {/if}
</div>

<style>
  .group-card {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    margin-bottom: 8px;
    overflow: hidden;
  }

  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--hdr2);
    color: #fff;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;
  }

  .group-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .7px;
    opacity: .75;
  }

  .main-preview {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    min-width: 0;
  }

  .preview-qty {
    font-size: 12px;
    font-weight: 700;
    opacity: .9;
  }

  .preview-kcal {
    font-size: 11px;
    font-weight: 500;
    opacity: .6;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .card-footer {
    border-top: 1px solid var(--border);
    padding: 8px 14px;
    display: flex;
    justify-content: flex-end;
  }

  .btn-reset {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 0;
    opacity: .7;
  }
  .btn-reset:active { opacity: 1; }

  .chevron {
    font-size: 16px;
    opacity: .7;
    transition: transform .2s;
    display: block;
    line-height: 1;
  }
  .chevron.open { transform: rotate(180deg); }

  .item-sep {
    height: 0;
    border-bottom: 1.5px dashed var(--border);
    margin: 0 14px;
  }
</style>
