<script lang="ts">
  import ItemRow from './ItemRow.svelte';
  import { mainItems, resetGroup, getMainIdx } from '../stores/state';
  import type { FoodGroup } from '../types';

  export let group: FoodGroup;

  $: mainIdx = getMainIdx(group, $mainItems);

  function showSep(idx: number): boolean {
    if (group.items.length <= 1) return false;
    return idx === mainIdx + 1;
  }
</script>

<div class="group-card">
  <div class="group-header">
    <div class="header-left">
      <span class="group-title">{group.label}</span>
      {#if group.items.length > 1}
        <span class="scale-hint">↕ scala proporzionalmente</span>
      {/if}
    </div>
    <button class="btn-reset" on:click={() => resetGroup(group.id)}>↺ Reset</button>
  </div>

  {#each group.items as item, idx}
    {#if showSep(idx)}
      <div class="item-sep"></div>
    {/if}
    <ItemRow {group} {item} {idx} isMain={idx === mainIdx} />
  {/each}
</div>

<style>
  .group-card {
    background: var(--card);
    border-radius: var(--r);
    box-shadow: var(--sh);
    margin-bottom: 12px;
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
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .group-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .7px;
    opacity: .88;
  }

  .scale-hint {
    font-size: 9px;
    font-weight: 500;
    opacity: .55;
    letter-spacing: .2px;
  }

  .btn-reset {
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.22);
    color: rgba(255,255,255,.85);
    padding: 3px 11px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
  }
  .btn-reset:active { background: rgba(255,255,255,.22); }

  .item-sep {
    height: 0;
    border-bottom: 1.5px dashed var(--border);
    margin: 0 14px;
  }
</style>
