<script lang="ts">
  import { onMount } from 'svelte';
  import MealPanel from './MealPanel.svelte';
  import { activePage } from '../stores/state';
  import { MEALS } from '../data/meals';

  const LAST_IDX       = MEALS.length - 1; // 4
  const DIST_THRESHOLD = 0.20;   // 20% larghezza schermo
  const VEL_THRESHOLD  = 0.30;   // px/ms  (= 300 px/s)

  let outer:  HTMLElement;  // wrapper overflow:hidden
  let slider: HTMLElement;  // flex container traslato
  let mounted = false;
  let animLock = false;     // blocca il reactive durante navigateTo

  // ── Drag state ──────────────────────────────────────────
  let isDragging   = false;
  let isHorizontal = false;
  let touchX0 = 0, touchY0 = 0, touchT0 = 0;
  let dragDx  = 0;

  function slideW(): number {
    return outer?.clientWidth ?? window.innerWidth;
  }

  function animateTo(idx: number, animate: boolean) {
    if (!slider) return;
    slider.style.transition = animate ? 'transform 200ms ease-out' : 'none';
    slider.style.transform  = `translateX(${-idx * slideW()}px)`;
  }

  function navigateTo(idx: number) {
    animLock = true;
    animateTo(idx, true);
    const page = idx + 1;
    if (page !== $activePage) activePage.set(page);
    setTimeout(() => { animLock = false; }, 250);
  }

  // Sync da click sulle tab / navigazione esterna
  $: if (!animLock && mounted && slider && $activePage >= 1 && $activePage <= 5) {
    animateTo($activePage - 1, true);
  }

  // ── Touch handlers ──────────────────────────────────────
  function onTouchStart(e: TouchEvent) {
    touchX0 = e.touches[0].clientX;
    touchY0 = e.touches[0].clientY;
    touchT0 = Date.now();
    dragDx  = 0;
    isDragging   = true;
    isHorizontal = false;
    if (slider) slider.style.transition = 'none';
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging || !slider) return;
    const dx = e.touches[0].clientX - touchX0;
    const dy = e.touches[0].clientY - touchY0;

    // Rileva asse al primo movimento significativo
    if (!isHorizontal) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      if (Math.abs(dx) >= Math.abs(dy)) {
        isHorizontal = true;
      } else {
        isDragging = false; // gesto verticale — non interferire
        return;
      }
    }

    dragDx = dx;
    const idx = $activePage - 1;
    let effectiveDx = dx;

    // Resistenza ai bordi — dampen ma non bloccare
    if ((idx === 0 && dx > 0) || (idx === LAST_IDX && dx < 0)) {
      effectiveDx = dx * 0.30;
    }

    slider.style.transform = `translateX(${-idx * slideW() + effectiveDx}px)`;
  }

  function onTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (!isHorizontal) return; // gesto verticale — nessuna navigazione

    const elapsed  = Math.max(1, Date.now() - touchT0);
    const velocity = Math.abs(dragDx) / elapsed;         // px/ms
    const dist     = Math.abs(dragDx) / slideW();
    const dir      = dragDx < 0 ? 1 : -1;
    const idx      = $activePage - 1;

    const intentional = dist >= DIST_THRESHOLD || velocity >= VEL_THRESHOLD;

    if (intentional) {
      // Bordi: naviga fuori dal carousel
      if (dir === -1 && idx === 0)        { activePage.set(6); return; } // → Oggi
      if (dir === 1  && idx === LAST_IDX) { activePage.set(0); return; } // → Base

      navigateTo(Math.max(0, Math.min(LAST_IDX, idx + dir)));
    } else {
      // Rimbalzo seco, nessuna animazione elastica
      animateTo(idx, true);
    }
  }

  onMount(() => {
    mounted = true;
    animateTo($activePage - 1, false);

    // Ricalcola posizione al resize (rotazione dispositivo)
    const onResize = () => {
      if ($activePage >= 1 && $activePage <= 5) animateTo($activePage - 1, false);
    };
    window.addEventListener('resize', onResize);

    // First-use hint
    if (!localStorage.getItem('mp_swipe_hint')) {
      setTimeout(() => {
        if (!slider) return;
        const idx = $activePage - 1;
        slider.style.transition = 'transform 300ms ease-out';
        slider.style.transform  = `translateX(${-idx * slideW() - 90}px)`;
        setTimeout(() => {
          slider.style.transform = `translateX(${-idx * slideW()}px)`;
          localStorage.setItem('mp_swipe_hint', '1');
        }, 480);
      }, 900);
    }

    return () => window.removeEventListener('resize', onResize);
  });
</script>

<div class="carousel-wrap">
  <div
    class="carousel-outer"
    bind:this={outer}
    on:touchstart|passive={onTouchStart}
    on:touchmove|passive={onTouchMove}
    on:touchend|passive={onTouchEnd}
  >
    <div class="carousel-slider" bind:this={slider}>
      {#each MEALS as meal}
        <div class="carousel-slide">
          <div class="slide-inner">
            <MealPanel {meal} />
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="dots" role="tablist" aria-label="Pasto attivo">
    {#each MEALS as meal, i}
      <button
        class="dot"
        class:active={$activePage === i + 1}
        on:click={() => navigateTo(i)}
        aria-label={meal.label}
        role="tab"
        aria-selected={$activePage === i + 1}
      ></button>
    {/each}
  </div>
</div>

<style>
  .carousel-wrap {
    padding-bottom: 86px;
  }

  .carousel-outer {
    overflow: hidden;
    width: 100%;
    /* Il browser gestisce lo scroll verticale nativo;
       noi gestiamo il pan orizzontale via JS */
    touch-action: pan-y;
  }

  .carousel-slider {
    display: flex;
    will-change: transform;
    /* transition gestito via JS in animateTo() */
  }

  .carousel-slide {
    flex: 0 0 100%;
    width: 100%;
    min-width: 0;
  }

  .slide-inner {
    padding: 14px 16px 8px;
  }

  /* ── Dots ── */
  .dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 12px 0 8px;
  }

  .dot {
    height: 6px;
    border-radius: 3px;
    background: var(--border);
    border: none;
    cursor: pointer;
    padding: 8px 3px;
    box-sizing: content-box;
    width: 6px;
    background-clip: content-box;
    transition: background .2s, width .25s cubic-bezier(.4,0,.2,1);
  }
  .dot.active {
    background: var(--accent);
    width: 20px;
  }
</style>
