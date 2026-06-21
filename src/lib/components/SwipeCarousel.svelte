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

  // Sync tab-click → carousel position
  $: if (!sliding && mounted && track && $activePage >= 1 && $activePage <= 5) {
    scrollToPage($activePage);
  }

  onMount(() => {
    mounted = true;
    scrollToPage($activePage, false);

    // First-use swipe hint: slightly scroll right then bounce back
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
