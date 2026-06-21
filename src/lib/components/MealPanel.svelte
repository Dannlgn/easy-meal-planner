<script lang="ts">
  import GroupCard from './GroupCard.svelte';
  import SectionCard from './SectionCard.svelte';
  import MealTotals from './MealTotals.svelte';
  import type { Meal, FoodGroup } from '../types';

  export let meal: Meal;
  export let active: boolean;

  function groupsForSection(groupIds: string[]): FoodGroup[] {
    return groupIds
      .map(id => meal.groups.find(g => g.id === id))
      .filter((g): g is FoodGroup => g !== null && g !== undefined);
  }
</script>

<div class="meal-panel" class:active>
  {#if meal.sections}
    {#each meal.sections as section}
      {#if section.groupIds.length === 1}
        <!-- sezione con un solo gruppo: GroupCard diretta, senza wrapper -->
        {#each groupsForSection(section.groupIds) as group}
          <GroupCard {group} />
        {/each}
      {:else}
        <SectionCard {section} groups={groupsForSection(section.groupIds)} />
      {/if}
    {/each}
  {:else}
    {#each meal.groups as group}
      <GroupCard {group} />
    {/each}
  {/if}
  <MealTotals {meal} />
</div>

<style>
  .meal-panel { display: none; }
  .meal-panel.active { display: block; }
</style>
