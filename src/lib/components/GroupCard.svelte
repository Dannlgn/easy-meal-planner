<script lang="ts">
  import ItemRow from './ItemRow.svelte';
  import { mainItems, resetGroup, getMainIdx, smartSwapEnabled, toggleSmartSwap } from '../stores/state';
  import type { FoodGroup } from '../types';

  export let group: FoodGroup;

  $: mainIdx  = getMainIdx(group, $mainItems);
  $: smartOn  = ($smartSwapEnabled[group.id] ?? true);
  $: multiItem = group.items.length > 1;

  function showSep(idx: number): boolean {
    if (!multiItem) return false;
    return idx === mainIdx + 1;
  }
</script>

<div class="group-card">
  <div class="group-header">
    <div class="header-left">
      <span class="group-title">{group.label}</span>
      {#if multiItem}
        <button
          class="swap-toggle"
          class:on={smartOn}
          on:click={() => toggleSmartSwap(group.id)}
          title={smartOn ? 'Smart Swap attivo — grammatura ottimizzata automaticamente' : 'Modalità manuale — scaling proporzionale'}
        >
          {#if smartOn}⚡ Smart Swap{:else}↕ Proporzionale{/if}
        </button>
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
    gap: 3px;
    min-width: 0;
  }

  .group-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .7px;
    opacity: .88;
  }

  .swap-toggle {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,.25);
    background: rgba(255,255,255,.10);
    color: rgba(255,255,255,.65);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: .3px;
    cursor: pointer;
    transition: background .15s, color .15s;
    align-self: flex-start;
  }
  .swap-toggle.on {
    background: rgba(255,255,255,.20);
    color: #fff;
    border-color: rgba(255,255,255,.45);
  }
  .swap-toggle:active { opacity: .8; }

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
