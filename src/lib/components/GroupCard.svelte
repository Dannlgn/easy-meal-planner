<script lang="ts">
  import ItemRow from './ItemRow.svelte';
  import { mainItems, quantities, resetGroup, getMainIdx } from '../stores/state';
  import { MACRO_DB } from '../data/macros';
  import type { FoodGroup } from '../types';

  export let group: FoodGroup;

  let expanded = false;

  $: displayLabel = group.label.includes('–')
    ? group.label.split('–').pop()!.trim()
    : group.label.includes(' - ')
    ? group.label.split(' - ').pop()!.trim()
    : group.label;

  $: mainIdx  = getMainIdx(group, $mainItems);
  $: mainItem = group.items[mainIdx];
  $: mainQty  = $quantities[group.id]?.[mainIdx] ?? mainItem.qty;
  $: macro    = MACRO_DB[mainItem.name];
  $: mainKcal = macro && mainQty > 0
    ? Math.round((macro.c * 4 + macro.p * 4 + macro.f * 9) / 100 * mainQty)
    : null;
  $: allZero  = group.items.every((item, i) => ($quantities[group.id]?.[i] ?? item.qty) === 0);

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
  <div class="group-header" class:all-zero={allZero} on:click={() => expanded = !expanded}>
    <div class="header-left">
      <span class="group-title">{displayLabel}</span>
      {#if group.note}<span class="group-note">{group.note}</span>{/if}
      {#if !expanded}
        {#if mainQty === 0}
          <span class="inactive-hint">— non incluso</span>
        {:else}
          <span class="main-preview">
            {mainItem.name}
            {#if mainQty > 0}
              <span class="preview-qty">
                {mainItem.unitSize ? Math.round(mainQty / mainItem.unitSize) : mainQty}{mainItem.unitSize ? '' : 'g'}
                {#if mainItem.unitLabel}&nbsp;{mainItem.unitLabel}{/if}
              </span>
            {/if}
            {#if mainKcal !== null}<span class="preview-kcal">{mainKcal} kcal</span>{/if}
          </span>
        {/if}
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
    margin-bottom: 6px;
    overflow: hidden;
  }

  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: transparent;
    color: var(--text);
    gap: 8px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    min-height: 52px;
    transition: background .15s;
  }
  .group-header:active { background: var(--bg3); }
  .group-header.all-zero { opacity: .38; }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;
  }

  .group-title {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255,255,255,.28);
  }

  .group-note {
    font-size: 10px;
    font-weight: 400;
    color: rgba(255,255,255,.22);
    letter-spacing: 0;
    text-transform: none;
    font-style: italic;
  }

  .inactive-hint {
    font-size: 12px;
    font-style: italic;
    color: rgba(255,255,255,.28);
  }

  .main-preview {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    min-width: 0;
  }

  .preview-qty {
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
  }

  .preview-kcal {
    font-size: 11px;
    font-weight: 400;
    color: var(--muted);
  }

  .header-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .chevron {
    font-size: 16px;
    color: rgba(255,255,255,.25);
    transition: transform .2s ease-out;
    display: block;
    line-height: 1;
  }
  .chevron.open { transform: rotate(180deg); color: rgba(255,255,255,.5); }

  .card-footer {
    border-top: 1px solid var(--border);
    padding: 8px 14px;
    display: flex;
    justify-content: flex-end;
    background: var(--bg);
  }

  .btn-reset {
    background: none;
    border: none;
    color: rgba(255,255,255,.22);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 4px;
    min-height: 32px;
    font-family: inherit;
    transition: color .15s;
  }
  .btn-reset:active { color: var(--muted); }

  .item-sep {
    height: 0;
    border-bottom: 1px solid var(--border);
    margin: 0 14px;
  }
</style>
