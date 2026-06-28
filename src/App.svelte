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
    let x0 = 0, y0 = 0, t0 = 0;

    function onTouchStart(e: TouchEvent) {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      t0 = Date.now();
    }

    function onTouchEnd(e: TouchEvent) {
      const page = get(activePage);
      if (page >= 1 && page <= 5) return; // gestito da SwipeCarousel

      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;

      // Esclude gesti verticali (scroll pagina) e tap
      if (Math.abs(dy) >= Math.abs(dx) || Math.abs(dx) < 4) return;

      const elapsed  = Math.max(1, Date.now() - t0);
      const velocity = Math.abs(dx) / elapsed;            // px/ms
      const dist     = Math.abs(dx) / window.innerWidth;
      const intentional = velocity >= 0.10 || dist >= 0.05;
      if (!intentional) return;

      if (dx < 0 && page === 6) { activePage.set(1); return; } // Oggi → Colazione
      if (dx > 0 && page === 0) { activePage.set(5); return; } // Base → Cena
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
  <main class="no-overscroll"><BasePlan /></main>
{:else if $activePage >= 1 && $activePage <= 5}
  <SwipeCarousel />
{:else if $activePage === 6}
  <main class="no-overscroll"><TodayPlan /></main>
{/if}

<StickyTotals />
<Onboarding />
