import { writable, get } from 'svelte/store';
import { MEALS } from '../data/meals';
import type { FoodGroup } from '../types';

// ── Initializers ──────────────────────────────────────────
function initQtys(): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const meal of MEALS)
    for (const g of meal.groups)
      out[g.id] = g.items.map(i => i.qty);
  return out;
}

function initPills(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const meal of MEALS)
    for (const g of meal.groups)
      if (g.dualMain) out[g.id] = 0;
  return out;
}

// ── Stores ───────────────────────────────────────────────
export const quantities    = writable<Record<string, number[]>>(initQtys());
export const activePills   = writable<Record<string, number>>(initPills());
export const activeMeal    = writable(0);
export const expandedMacros = writable(new Set<string>());
export const flashSet      = writable(new Set<string>());

// ── Helpers ──────────────────────────────────────────────
function findGroup(id: string): FoodGroup | undefined {
  for (const meal of MEALS) {
    const g = meal.groups.find(g => g.id === id);
    if (g) return g;
  }
}

function triggerFlash(key: string) {
  flashSet.update(s => { const n = new Set(s); n.add(key); return n; });
  setTimeout(() => {
    flashSet.update(s => { const n = new Set(s); n.delete(key); return n; });
  }, 800);
}

// ── Mutations ────────────────────────────────────────────

/**
 * Scale all items in a group proportionally.
 * Formula: newQty_i = originalQty_i * (newVal / originalQty_changed)
 */
export function scaleGroup(groupId: string, changedIdx: number, newVal: number) {
  const group = findGroup(groupId);
  if (!group || newVal <= 0 || !Number.isFinite(newVal)) return;

  const origChanged = group.items[changedIdx].qty;
  if (origChanged === 0) return;

  const scaleFactor = newVal / origChanged;
  const currentQtys = get(quantities)[groupId] ?? group.items.map(i => i.qty);
  const newQtys = group.items.map(item => Math.round(item.qty * scaleFactor));

  quantities.update(q => ({ ...q, [groupId]: newQtys }));

  newQtys.forEach((nq, i) => {
    if (nq !== currentQtys[i]) triggerFlash(`${groupId}_${i}`);
  });
}

/** Reset a group to its original quantities. */
export function resetGroup(groupId: string) {
  const group = findGroup(groupId);
  if (!group) return;

  const currentQtys = get(quantities)[groupId] ?? [];
  const origQtys = group.items.map(i => i.qty);

  quantities.update(q => ({ ...q, [groupId]: origQtys }));

  origQtys.forEach((oq, i) => {
    if (oq !== currentQtys[i]) triggerFlash(`${groupId}_${i}`);
  });
}

/** Reset all groups in a meal. */
export function resetMeal(mealIdx: number) {
  MEALS[mealIdx]?.groups.forEach(g => resetGroup(g.id));
}

/** Toggle the macro row for an item. */
export function toggleMacro(key: string) {
  expandedMacros.update(s => {
    const n = new Set(s);
    n.has(key) ? n.delete(key) : n.add(key);
    return n;
  });
}

/** Return the active main index for a group. */
export function getMainIdx(group: FoodGroup, pills: Record<string, number>): number {
  if (group.dualMain) return pills[group.id] ?? 0;
  const i = group.items.findIndex(it => it.main);
  return i >= 0 ? i : 0;
}
