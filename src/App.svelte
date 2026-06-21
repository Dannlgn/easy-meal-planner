<script lang="ts">
  import { onMount } from 'svelte';
  import Header from './lib/components/Header.svelte';
  import SwipeCarousel from './lib/components/SwipeCarousel.svelte';
  import BasePlan from './lib/components/BasePlan.svelte';
  import TodayPlan from './lib/components/TodayPlan.svelte';
  import StickyTotals from './lib/components/StickyTotals.svelte';
  import Onboarding from './lib/components/Onboarding.svelte';
  import { activePage } from './lib/stores/state';
  import { get } from 'svelte/store';

  onMount(() => {
    let x0 = 0;
    let t0 = 0;

    function onTouchStart(e: TouchEvent) {
      x0 = e.touches[0].clientX;
      t0 = Date.now();
    }

    function onTouchEnd(e: TouchEvent) {
      const page = get(activePage);
      // Solo per le pagine fuori dal carousel (SwipeCarousel gestisce pages 1-5)
      if (page >= 1 && page <= 5) return;

      const dx       = e.changedTouches[0].clientX - x0;
      const elapsed  = Math.max(1, Date.now() - t0);
      const velocity = Math.abs(dx) / elapsed * 1000;
      const intentional = velocity > 280 || Math.abs(dx) > window.innerWidth * 0.28;
      if (!intentional) return;

      // Oggi (6): swipe sinistra → Colazione (1)
      if (dx < 0 && page === 6) { activePage.set(1); return; }
      // Base (0): swipe destra → Cena (5)
      if (dx > 0 && page === 0) { activePage.set(5); return; }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend',   onTouchEnd);
    };
  });
</script>

<Header />

{#if $activePage === 0}
  <main><BasePlan /></main>
{:else if $activePage >= 1 && $activePage <= 5}
  <SwipeCarousel />
{:else if $activePage === 6}
  <main><TodayPlan /></main>
{/if}

<StickyTotals />
<Onboarding />
