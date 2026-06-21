<script lang="ts">
  import { quantities, flashSet, toggleMacro, expandedMacros, setMain, recalcGroupFromMain } from '../stores/state';
  import { MACRO_DB } from '../data/macros';
  import type { FoodGroup, FoodItem } from '../types';

  export let group: FoodGroup;
  export let item: FoodItem;
  export let idx: number;
  export let isMain: boolean;

  $: qty        = $quantities[group.id]?.[idx] ?? item.qty;
  $: unitSize   = item.unitSize ?? 1;
  $: unitLabel  = item.unitLabel ?? 'gr';
  $: displayQty = item.unitSize ? Math.round(qty / item.unitSize) : qty;
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
  let focused = false;
  let inputEl: HTMLInputElement;

  function handleBlur(e: FocusEvent) {
    const el  = e.currentTarget as HTMLInputElement;
    const units = Math.round(parseFloat(el.value));
    if (!Number.isFinite(units) || units < 0) {
      el.value = String(displayQty);
      invalid = true;
      setTimeout(() => { invalid = false; }, 600);
      return;
    }

    const val = units * unitSize; // converti unità → grammi per lo store
    quantities.update(q => {
      const arr = [...(q[group.id] ?? group.items.map(i => i.qty))];
      arr[idx] = val;
      return { ...q, [group.id]: arr };
    });

    if (!isMain && val > 0) setMain(group.id, idx); // promuovi a main + ricalcola
    else if (isMain && val > 0) recalcGroupFromMain(group.id);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
  }

  function handleFocus(e: FocusEvent) {
    (e.currentTarget as HTMLInputElement).select();
    focused = true;
  }

  function handleBlurWrapper(e: FocusEvent) {
    focused = false;
    handleBlur(e);
  }

  function confirmValue() {
    inputEl?.blur();
  }
</script>

<div class="item-row" class:is-main={isMain} class:updated={flashing} class:zeroed={qty === 0}>
  <div class="item-main-line">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
      class="radio-indicator"
      class:active={isMain}
      on:click={() => !isMain && group.items.length > 1 && setMain(group.id, idx)}
      title={isMain ? 'Alimento selezionato per i totali' : 'Seleziona come principale'}
    >
      {#if isMain}<span class="radio-dot"></span>{/if}
    </div>

    <div class="name-wrap">
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
      <span
        class="item-name"
        class:macro-toggle={hasMacro}
        on:click={() => hasMacro && toggleMacro(key)}
      >
        {item.name}
        {#if hasMacro}
          <span class="chv" class:open={expanded}>▶</span>
        {/if}
      </span>
    </div>

    <div class="qty-wrap">
      <input
        bind:this={inputEl}
        type="number"
        inputmode="numeric"
        min="0"
        step="1"
        value={displayQty}
        class:invalid
        aria-label="{item.name} {unitLabel}"
        on:blur={handleBlurWrapper}
        on:focus={handleFocus}
        on:keydown={handleKeydown}
      />
      {#if focused}
        <button class="btn-confirm" on:mousedown|preventDefault={confirmValue} aria-label="Conferma">✓</button>
      {:else}
        <span class="qty-unit">{unitLabel}</span>
      {/if}
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
    background: var(--card);
    transition: opacity .2s;
  }
  .item-row:last-child { border-bottom: none; }
  .item-row.is-main    { background: var(--acl); }
  .item-row.zeroed     { opacity: .38; }

  .item-main-line {
    display: flex;
    align-items: center;
    padding: 10px 14px 10px 12px;
    gap: 8px;
    min-height: 48px;
  }

  .radio-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--border);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .15s, background .15s;
    cursor: pointer;
  }
  .radio-indicator.active {
    border-color: var(--accent);
    background: var(--acl);
  }
  .radio-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--accent);
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
  .item-name.macro-toggle {
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: var(--border);
    text-underline-offset: 3px;
    transition: opacity .15s;
  }
  .item-name.macro-toggle:active { opacity: .65; }

  .chv {
    display: inline-block;
    font-size: 9px;
    color: var(--accent);
    transition: transform .2s ease-out;
    margin-left: 2px;
    vertical-align: middle;
  }
  .chv.open { transform: rotate(90deg); }

  .qty-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  input[type="number"] {
    width: 62px;
    text-align: right;
    border: 1.5px solid var(--border);
    border-radius: var(--r-sm);
    padding: 8px 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    background: var(--card);
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
    border-color: var(--err);
    background: var(--err-bg);
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
    width: 22px;
    text-align: left;
  }

  .btn-confirm {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: var(--accent);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 1;
    transition: background .15s;
  }
  .btn-confirm:active { background: var(--accent-dk); }

  /* ── Macro row ── */
  .macro-row {
    display: flex;
    gap: 14px;
    padding: 2px 14px 10px;
  }

  .macro-pill {
    font-size: 11px;
    font-weight: 500;
  }
  .macro-pill b { font-weight: 700; }
  .macro-pill.kcal { color: var(--muted); font-weight: 600; }
  .macro-pill.mc   { color: var(--mc); }
  .macro-pill.mp   { color: var(--mp); }
  .macro-pill.mf   { color: var(--mf); }

  /* ── Flash animation ── */
  @keyframes flash {
    0%   { background: var(--flash); }
    100% { background: var(--card); }
  }
  @keyframes flash-main {
    0%   { background: var(--flash); }
    100% { background: var(--acl); }
  }
  .item-row.updated          { animation: flash      .75s ease-out forwards; }
  .item-row.is-main.updated  { animation: flash-main .75s ease-out forwards; }
</style>
