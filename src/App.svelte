<script lang="ts">
  import Header from './lib/components/Header.svelte';
  import MealPanel from './lib/components/MealPanel.svelte';
  import { activeMeal } from './lib/stores/state';
  import { MEALS } from './lib/data/meals';
</script>

<Header />

<main>
  {#each MEALS as meal, i}
    <MealPanel {meal} active={$activeMeal === i} />
  {/each}
</main>
