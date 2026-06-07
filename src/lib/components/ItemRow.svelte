<script lang="ts">
  import { quantities, flashSet, toggleMacro, expandedMacros, scaleGroup } from '../stores/state';
  import { MACRO_DB } from '../data/macros';
  import type { FoodGroup, FoodItem } from '../types';

  export let group: FoodGroup;
  export let item: FoodItem;
  export let idx: number;
  export let isMain: boolean;

  $: qty      = $quantities[group.id]?.[idx] ?? item.qty;
  $: macro    = MACRO_DB[item.name];
  $: hasMacro = !!macro;
  $: key      = `${group.id}_${idx}`;
  $: expanded = $expandedMacros.has(key);
  $: flashing = $flashSet.has(key);

  $: macroC    = macro ? ((macro.c / 100) * qty).toFixed(1) : '—';
  $: macroP    = macro ? ((macro.p / 100) * qty).toFixed(1) : '—';
  $: macroF    = macro ? ((macro.f / 100) * qty).toFixed(1) : '—';
  $: macroKcal = macro ? Math.round((macro.c / 100) * qty * 4 + (macro.p / 100) * qty * 4 + (macro.f / 100) * qty * 9) : null;

  let invalid = false;

  function handleBlur(e: FocusEvent) {
    const el  = e.currentTarget as HTMLInputElement;
    const val = Math.round(parseFloat(el.value));
    if (!Number.isFinite(val) || val <= 0) {
      el.value = String(qty);
      invalid = true;
      setTimeout(() => { invalid = false; }, 600);
      return;
    }
    if (group.items.length <= 1) {
      quantities.update(q => {
        const arr = [...(q[group.id] ?? [])];
        arr[idx] = val;
        return { ...q, [group.id]: arr };
      });
    } else {
      scaleGroup(group.id, idx, val);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
  }

  function handleFocus(e: FocusEvent) {
    (e.currentTarget as HTMLInputElement).select();
  }
</script>

<div class="item-row" class:is-main={isMain} class:updated={flashing}>
  <div class="item-main-line">
    <div class="name-wrap">
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
      <span
        class="item-name"
        class:macro-toggle={hasMacro}
        on:click={() => hasMacro && toggleMacro(key)}
      >
        {item.name}
        {#if hasMacro}
          <span class="chv" class:open={expanded}> ›</span>
        {/if}
      </span>
      {#if isMain}
        <span class="badge-main">principale</span>
      {/if}
    </div>

    <div class="qty-wrap">
      <input
        type="number"
        inputmode="numeric"
        min="1"
        step="1"
        value={qty}
        class:invalid
        aria-label="{item.name} grammi"
        on:blur={handleBlur}
        on:focus={handleFocus}
        on:keydown={handleKeydown}
      />
      <span class="qty-unit">gr</span>
    </div>
  </div>

  {#if hasMacro && expanded}
    <div class="macro-row">
      <span class="macro-pill kcal"><b>{macroKcal}</b> kcal</span>
      <span class="macro-pill mc">C <b>{macroC}</b>g</span>
      <span class="macro-pill mp">P <b>{macroP}</b>g</span>
      <span class="macro-pill mf">G <b>{macroF}</b>g</span>
    </div>
  {/if}
</div>

<style>
  .item-row {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--border);
    background: #fff;
  }
  .item-row:last-child { border-bottom: none; }
  .item-row.is-main    { background: #f5f9ff; }

  .item-main-line {
    display: flex;
    align-items: center;
    padding: 9px 14px;
    gap: 10px;
    min-height: 46px;
  }

  .name-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .item-name {
    font-size: 14px;
    color: var(--text);
    line-height: 1.35;
  }
  .item-name.macro-toggle { cursor: pointer; }

  .chv {
    display: inline-block;
    font-size: 11px;
    color: var(--muted);
    transition: transform .2s;
  }
  .chv.open { transform: rotate(90deg); }

  .badge-main {
    background: var(--accent);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: .4px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .qty-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  input[type="number"] {
    width: 60px;
    text-align: right;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    padding: 7px 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    background: #fff;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    transition: border-color .15s, background .15s;
    font-family: inherit;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { display: none; }
  input[type="number"]:focus {
    border-color: var(--accent);
    background: var(--acl);
  }
  input[type="number"].invalid {
    border-color: #e53e3e;
    background: #fff5f5;
    animation: shake .3s ease;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-4px); }
    75%       { transform: translateX(4px); }
  }

  .qty-unit {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    width: 18px;
  }

  /* ── Macro row ── */
  .macro-row {
    display: flex;
    gap: 14px;
    padding: 2px 14px 9px;
  }

  .macro-pill {
    font-size: 11px;
    font-weight: 500;
  }
  .macro-pill b { font-weight: 700; }
  .macro-pill.kcal { color: var(--text); font-weight: 600; }
  .macro-pill.mc { color: var(--mc); }
  .macro-pill.mp { color: var(--mp); }
  .macro-pill.mf { color: var(--mf); }

  /* ── Flash animation ── */
  @keyframes flash {
    0%   { background: #fff59d; }
    100% { background: #fff; }
  }
  @keyframes flash-main {
    0%   { background: #fff59d; }
    100% { background: #f5f9ff; }
  }
  .item-row.updated          { animation: flash      .75s ease-out forwards; }
  .item-row.is-main.updated  { animation: flash-main .75s ease-out forwards; }
</style>
