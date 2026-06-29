<script lang="ts">
  import GroupCard from './GroupCard.svelte';
  import SectionCard from './SectionCard.svelte';
  import MealTotals from './MealTotals.svelte';
  import type { Meal, FoodGroup } from '../types';

  export let meal: Meal;

  function groupsForSection(groupIds: string[]): FoodGroup[] {
    return groupIds
      .map(id => meal.groups.find(g => g.id === id))
      .filter((g): g is FoodGroup => g !== null && g !== undefined);
  }
</script>

<div class="meal-panel">
  {#if meal.sections}
    {#each meal.sections as section}
      {#if section.groupIds.length === 1}
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
