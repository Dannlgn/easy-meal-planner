<script lang="ts">
  import Header from './lib/components/Header.svelte';
  import MealPanel from './lib/components/MealPanel.svelte';
  import BasePlan from './lib/components/BasePlan.svelte';
  import TodayPlan from './lib/components/TodayPlan.svelte';
  import StickyTotals from './lib/components/StickyTotals.svelte';
  import Onboarding from './lib/components/Onboarding.svelte';
  import { activePage } from './lib/stores/state';
  import { MEALS } from './lib/data/meals';
</script>

<Header />

<main>
  {#if $activePage === 0}
    <BasePlan />
  {:else if $activePage >= 1 && $activePage <= 5}
    <MealPanel meal={MEALS[$activePage - 1]} active />
  {:else if $activePage === 6}
    <TodayPlan />
  {/if}
</main>

<StickyTotals />
<Onboarding />
