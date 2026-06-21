<script lang="ts">
  import { onMount } from 'svelte';
  import MealPanel from './MealPanel.svelte';
  import { activePage } from '../stores/state';
  import { MEALS } from '../data/meals';

  let track: HTMLElement;
  let mounted = false;
  let sliding = false;
  let scrollTimer: ReturnType<typeof setTimeout>;
  const GAP = 10;
  const LAST_IDX = MEALS.length - 1; // 4

  function slideWidth(): number {
    return window.innerWidth - 44;
  }

  function scrollToPage(page: number, smooth = true) {
    if (!track) return;
    const target = (page - 1) * (slideWidth() + GAP);
    if (Math.abs(track.scrollLeft - target) < 8) return;
    sliding = true;
    track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'instant' });
    setTimeout(() => { sliding = false; }, 650);
  }

  function onScroll() {
    if (sliding || !track) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = Math.round(track.scrollLeft / (slideWidth() + GAP));
      const page = Math.min(Math.max(idx + 1, 1), 5);
      if (page !== $activePage) {
        sliding = true;
        activePage.set(page);
        setTimeout(() => { sliding = false; }, 100);
      }
    }, 120);
  }

  // ── Velocity-based swipe detection ───────────────────────
  // CSS scroll-snap usa ~50% come soglia nativa; aggiungiamo
  // velocity check (> 280 px/s) per completare anche swipe brevi e veloci.
  let touchX0 = 0;
  let touchT0 = 0;

  function onTouchStart(e: TouchEvent) {
    touchX0 = e.touches[0].clientX;
    touchT0 = Date.now();
  }

  function onTouchEnd(e: TouchEvent) {
    if (!track) return;
    const dx       = e.changedTouches[0].clientX - touchX0;
    const elapsed  = Math.max(1, Date.now() - touchT0);
    const velocity = Math.abs(dx) / elapsed * 1000; // px/s
    const slideW   = slideWidth();

    const intentional = velocity > 280 || Math.abs(dx) > slideW * 0.28;
    if (!intentional) return; // gesto troppo corto/lento: lascia fare allo snap nativo

    // direzione: dx < 0 = swipe sinistra = avanza (idx+1)
    //            dx > 0 = swipe destra  = torna  (idx-1)
    const dir        = dx < 0 ? 1 : -1;
    const currentIdx = Math.round(track.scrollLeft / (slideW + GAP));

    // Bordo sinistro: swipe destra da Colazione → Oggi
    if (dir === -1 && currentIdx === 0) {
      activePage.set(6);
      return;
    }
    // Bordo destro: swipe sinistra da Cena → Base
    if (dir === 1 && currentIdx === LAST_IDX) {
      activePage.set(0);
      return;
    }

    // Navigazione interna al carousel
    const targetIdx  = Math.max(0, Math.min(LAST_IDX, currentIdx + dir));
    const targetPage = targetIdx + 1;
    if (targetPage !== $activePage) {
      // Impostiamo activePage e lasciamo che la $: reactive chiami scrollToPage
      activePage.set(targetPage);
    }
  }

  // Sync tab-click → carousel position
  $: if (!sliding && mounted && track && $activePage >= 1 && $activePage <= 5) {
    scrollToPage($activePage);
  }

  onMount(() => {
    mounted = true;
    scrollToPage($activePage, false);

    // First-use swipe hint: scroll leggermente a destra poi torna
    if (!localStorage.getItem('mp_swipe_hint')) {
      setTimeout(() => {
        track?.scrollTo({ left: 90, behavior: 'smooth' });
        setTimeout(() => {
          track?.scrollTo({ left: 0, behavior: 'smooth' });
          localStorage.setItem('mp_swipe_hint', '1');
        }, 480);
      }, 900);
    }
  });
</script>

<div class="carousel-wrap">
  <div
    class="swipe-track"
    bind:this={track}
    on:scroll={onScroll}
    on:touchstart|passive={onTouchStart}
    on:touchend|passive={onTouchEnd}
  >
    {#each MEALS as meal}
      <div class="swipe-slide">
        <MealPanel {meal} />
      </div>
    {/each}
  </div>

  <div class="dots" role="tablist" aria-label="Pasto attivo">
    {#each MEALS as meal, i}
      <button
        class="dot"
        class:active={$activePage === i + 1}
        on:click={() => activePage.set(i + 1)}
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

  .swipe-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 16px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 14px 16px 0;
    gap: 10px;
    overscroll-behavior-x: contain;
  }
  .swipe-track::-webkit-scrollbar { display: none; }

  .swipe-slide {
    flex: 0 0 calc(100vw - 44px);
    scroll-snap-align: start;
    scroll-snap-stop: always;
    padding: 0 2px 8px;
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
