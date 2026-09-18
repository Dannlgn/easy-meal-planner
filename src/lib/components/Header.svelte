<script lang="ts">
  import HowTo from './HowTo.svelte';
  let howToOpen = false;
</script>

<header>
  <span class="app-title">Piano Alimentare</span>
  <button class="btn-howto" on:click={() => howToOpen = true}>Come funziona</button>
</header>

<HowTo bind:open={howToOpen} />

<style>
  header {
    background: var(--hdr);
    color: #fff;
    padding: 0 16px;
    height: var(--header-h);
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 0 rgba(255,255,255,.05);
    flex-shrink: 0;
  }

  .app-title {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -.4px;
  }

  .btn-howto {
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.16);
    color: rgba(255,255,255,.75);
    padding: 5px 13px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background .15s;
    min-height: 30px;
    font-family: inherit;
  }
  .btn-howto:active { background: rgba(255,255,255,.2); }
</style>
