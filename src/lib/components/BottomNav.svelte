<script lang="ts">
  import { activePage } from '../stores/state';

  let lastPastiPage = 1;
  $: if ($activePage >= 1 && $activePage <= 5) lastPastiPage = $activePage;
  $: tab = $activePage === 6 ? 'oggi' : ($activePage === 0 ? 'base' : 'pasti');
</script>

<nav class="bottom-nav" aria-label="Navigazione principale">

  <button class:active={tab === 'oggi'} on:click={() => activePage.set(6)} aria-label="Oggi">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
    <span>Oggi</span>
  </button>

  <button class:active={tab === 'pasti'} on:click={() => activePage.set(lastPastiPage)} aria-label="Pasti">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
      <path d="M21 15v7"/>
    </svg>
    <span>Pasti</span>
  </button>

  <button class:active={tab === 'base'} on:click={() => activePage.set(0)} aria-label="Base">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
    <span>Base</span>
  </button>

</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 300;
    background: var(--hdr);
    display: flex;
    align-items: stretch;
    height: calc(var(--botnav-h) + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(255,255,255,.07);
    box-shadow: 0 -4px 20px rgba(0,0,0,.28);
  }

  button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    border: none;
    background: none;
    color: rgba(255,255,255,.38);
    cursor: pointer;
    padding: 8px 4px 0;
    padding-bottom: max(8px, env(safe-area-inset-bottom, 8px));
    transition: color .15s;
    -webkit-tap-highlight-color: transparent;
    min-height: var(--botnav-h);
  }
  button:active { color: rgba(255,255,255,.7); }

  button.active {
    color: #fff;
  }

  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  span {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .3px;
    text-transform: uppercase;
  }

  /* Active indicator — thin line sopra il tab attivo */
  button.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 28px;
    height: 2px;
    border-radius: 0 0 2px 2px;
    background: var(--accent);
  }

  button { position: relative; }
</style>
