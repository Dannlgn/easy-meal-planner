<script lang="ts">
  import ItemRow from './ItemRow.svelte';
  import { activePills, resetGroup } from '../stores/state';
  import { getMainIdx } from '../stores/state';
  import type { FoodGroup } from '../types';

  export let group: FoodGroup;

  $: mainIdx = getMainIdx(group, $activePills);

  // Separator appears after dual mains (idx 2) or after main item (idx mainIdx+1)
  function showSep(idx: number): boolean {
    if (group.items.length <= 1) return false;
    if (group.dualMain) return idx === 2;
    return idx === mainIdx + 1;
  }

  function switchPill(p: number) {
    activePills.update(pills => ({ ...pills, [group.id]: p }));
  }
</script>

<div class="group-card">
  <div class="group-header">
    <span class="group-title">{group.label}</span>
    <button class="btn-reset" on:click={() => resetGroup(group.id)}>↺ Reset</button>
  </div>

  {#if group.dualMain}
    <div class="dual-selector">
      <button
        class="pill-btn"
        class:active={($activePills[group.id] ?? 0) === 0}
        on:click={() => switchPill(0)}
      >🍝 Pasta</button>
      <button
        class="pill-btn"
        class:active={($activePills[group.id] ?? 0) === 1}
        on:click={() => switchPill(1)}
      >🍚 Riso</button>
    </div>
  {/if}

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
  }

  .group-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .7px;
    opacity: .88;
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
  }
  .btn-reset:active { background: rgba(255,255,255,.22); }

  .dual-selector {
    display: flex;
    gap: 8px;
    padding: 8px 14px;
    background: #edf2f7;
    border-bottom: 1px solid var(--border);
  }

  .pill-btn {
    flex: 1;
    padding: 6px 0;
    border-radius: 20px;
    border: 1.5px solid var(--border);
    background: #fff;
    color: var(--muted);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
  }
  .pill-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  .item-sep {
    height: 0;
    border-bottom: 1.5px dashed var(--border);
    margin: 0 14px;
  }
</style>
