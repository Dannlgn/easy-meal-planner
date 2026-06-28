<script lang="ts">
  import { onMount } from 'svelte';
  import MealPanel from './MealPanel.svelte';
  import { activePage } from '../stores/state';
  import { MEALS } from '../data/meals';

  const LAST_IDX       = MEALS.length - 1;
  const DIST_THRESHOLD = 0.05;   // 5% larghezza schermo
  const VEL_THRESHOLD  = 0.10;   // px/ms

  let outer:  HTMLElement;
  let slider: HTMLElement;
  let mounted = false;
  let animLock = false;

  // ── Drag state ──────────────────────────────────────────
  let isDragging   = false;
  let isHorizontal = false;
  let touchX0 = 0, touchY0 = 0, touchT0 = 0;
  let dragDx = 0;

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

  // Sync da click header tab / navigazione esterna
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

    // Rilevamento asse al primo movimento significativo
    if (!isHorizontal) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      if (Math.abs(dx) >= Math.abs(dy)) {
        isHorizontal = true;
      } else {
        isDragging = false; // gesto verticale confermato
        return;
      }
    }

    // Orizzontale confermato: blocca lo scroll del browser
    e.preventDefault();

    dragDx = dx;
    const idx = $activePage - 1;
    const w   = slideW();

    // Controlla soglia durante il move → naviga subito senza aspettare touchend
    const elapsed = Math.max(1, Date.now() - touchT0);
    const dist    = Math.abs(dx) / w;
    const vel     = Math.abs(dx) / elapsed;

    if (dist >= DIST_THRESHOLD || vel >= VEL_THRESHOLD) {
      isDragging = false;
      const dir = dx < 0 ? 1 : -1;
      if (dir === -1 && idx === 0)        { activePage.set(6); return; }
      if (dir === 1  && idx === LAST_IDX) { activePage.set(0); return; }
      navigateTo(Math.max(0, Math.min(LAST_IDX, idx + dir)));
      return;
    }

    // Follow-finger (resistenza ai bordi)
    let effectiveDx = dx;
    if ((idx === 0 && dx > 0) || (idx === LAST_IDX && dx < 0)) {
      effectiveDx = dx * 0.30;
    }
    slider.style.transform = `translateX(${-idx * w + effectiveDx}px)`;
  }

  // Fallback per swipe veloci dove touchmove non ha sparato abbastanza eventi
  function onTouchEnd(e: TouchEvent) {
    if (!isDragging) return;
    isDragging = false;

    const totalDx = e.changedTouches[0].clientX - touchX0;
    const totalDy = e.changedTouches[0].clientY - touchY0;

    const horizontal = Math.abs(totalDx) > Math.abs(totalDy) && Math.abs(totalDx) >= 4;
    if (!horizontal) {
      if (dragDx !== 0) animateTo($activePage - 1, true);
      return;
    }

    const elapsed  = Math.max(1, Date.now() - touchT0);
    const velocity = Math.abs(totalDx) / elapsed;
    const dist     = Math.abs(totalDx) / slideW();
    const dir      = totalDx < 0 ? 1 : -1;
    const idx      = $activePage - 1;

    if (dist >= DIST_THRESHOLD || velocity >= VEL_THRESHOLD) {
      if (dir === -1 && idx === 0)        { activePage.set(6); return; }
      if (dir === 1  && idx === LAST_IDX) { activePage.set(0); return; }
      navigateTo(Math.max(0, Math.min(LAST_IDX, idx + dir)));
    } else {
      animateTo(idx, true);
    }
  }

  onMount(() => {
    mounted = true;
    // requestAnimationFrame garantisce che il layout sia calcolato
    // prima di leggere clientWidth per il posizionamento iniziale
    requestAnimationFrame(() => {
      animateTo($activePage - 1, false);
    });

    const onResize = () => {
      if ($activePage >= 1 && $activePage <= 5) animateTo($activePage - 1, false);
    };
    window.addEventListener('resize', onResize);

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
    on:touchmove|nonpassive={onTouchMove}
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
    /* Nessun touch-action: gestiamo tutto via JS con preventDefault */
  }

  .carousel-slider {
    display: flex;
    will-change: transform;
  }

  .carousel-slide {
    flex: 0 0 100%;
    width: 100%;
    min-width: 0;
  }

  .slide-inner {
    padding: 14px 16px 8px;
  }

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
