<script lang="ts">
  import Header from './lib/components/Header.svelte';
  import SwipeCarousel from './lib/components/SwipeCarousel.svelte';
  import BasePlan from './lib/components/BasePlan.svelte';
  import TodayPlan from './lib/components/TodayPlan.svelte';
  import StickyTotals from './lib/components/StickyTotals.svelte';
  import Onboarding from './lib/components/Onboarding.svelte';
  import { activePage } from './lib/stores/state';
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
