<script lang="ts">
  import GroupCard from './GroupCard.svelte';
  import MealTotals from './MealTotals.svelte';
  import type { Meal } from '../types';

  export let meal: Meal;
  export let active: boolean;
</script>

<div class="meal-panel" class:active>
  {#each meal.groups as group}
    <GroupCard {group} />
  {/each}
  <MealTotals {meal} />
</div>

<style>
  .meal-panel { display: none; }
  .meal-panel.active { display: block; }
</style>
