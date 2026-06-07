import { writable, get } from 'svelte/store';
import { MEALS } from '../data/meals';
import { MACRO_DB } from '../data/macros';
import type { FoodGroup, Meal } from '../types';

// ── Initializers ──────────────────────────────────────────
function initQtys(): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const meal of MEALS)
    for (const g of meal.groups)
      out[g.id] = g.items.map(i => i.qty);
  return out;
}

function initMains(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const meal of MEALS)
    for (const g of meal.groups) {
      const i = g.items.findIndex(it => it.main);
      out[g.id] = i >= 0 ? i : 0;
    }
  return out;
}

function loadQtys(): Record<string, number[]> {
  try {
    const saved = localStorage.getItem('mp_quantities');
    if (saved) return { ...initQtys(), ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return initQtys();
}

function loadMains(): Record<string, number> {
  try {
    const saved = localStorage.getItem('mp_mains');
    if (saved) return { ...initMains(), ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return initMains();
}

// ── Stores ───────────────────────────────────────────────
export const quantities     = writable<Record<string, number[]>>(loadQtys());
export const mainItems      = writable<Record<string, number>>(loadMains());
export const activeMeal     = writable(0);
export const expandedMacros = writable(new Set<string>());
export const flashSet       = writable(new Set<string>());

quantities.subscribe(v => {
  try { localStorage.setItem('mp_quantities', JSON.stringify(v)); } catch { /* quota */ }
});
mainItems.subscribe(v => {
  try { localStorage.setItem('mp_mains', JSON.stringify(v)); } catch { /* quota */ }
});

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

export function resetGroup(groupId: string) {
  const group = findGroup(groupId);
  if (!group) return;

  const currentQtys = get(quantities)[groupId] ?? [];
  const origQtys = group.items.map(i => i.qty);

  quantities.update(q => ({ ...q, [groupId]: origQtys }));

  let anyChanged = false;
  origQtys.forEach((oq, i) => {
    if (oq !== currentQtys[i]) { triggerFlash(`${groupId}_${i}`); anyChanged = true; }
  });
  if (!anyChanged) origQtys.forEach((_, i) => triggerFlash(`${groupId}_${i}`));
}

export function resetMeal(mealIdx: number) {
  MEALS[mealIdx]?.groups.forEach(g => resetGroup(g.id));
}

export function toggleMacro(key: string) {
  expandedMacros.update(s => {
    const n = new Set(s);
    n.has(key) ? n.delete(key) : n.add(key);
    return n;
  });
}

/** Set the active (main) item for a group and flash it. */
export function setMain(groupId: string, idx: number) {
  mainItems.update(m => ({ ...m, [groupId]: idx }));
  triggerFlash(`${groupId}_${idx}`);
}

export function getMainIdx(group: FoodGroup, mains: Record<string, number>): number {
  return mains[group.id] ?? group.items.findIndex(it => it.main) ?? 0;
}

export function calcMealTotals(
  meal: Meal,
  qtys: Record<string, number[]>,
  mains: Record<string, number>,
) {
  let c = 0, p = 0, f = 0;
  for (const group of meal.groups) {
    const mIdx  = getMainIdx(group, mains);
    const item  = group.items[mIdx];
    const qty   = qtys[group.id]?.[mIdx] ?? item.qty;
    const macro = MACRO_DB[item.name];
    if (macro && qty > 0) {
      c += (macro.c * qty) / 100;
      p += (macro.p * qty) / 100;
      f += (macro.f * qty) / 100;
    }
  }
  return { c, p, f, kcal: c * 4 + p * 4 + f * 9 };
}
