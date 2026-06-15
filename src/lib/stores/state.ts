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

export type SavedPlan = {
  quantities: Record<string, number[]>;
  mains: Record<string, number>;
};

function loadSavedBase(): SavedPlan | null {
  try {
    const saved = localStorage.getItem('mp_base');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

// ── Stores ───────────────────────────────────────────────
export const quantities     = writable<Record<string, number[]>>(loadQtys());
export const mainItems      = writable<Record<string, number>>(loadMains());
export const activePage     = writable(loadSavedBase() ? 5 : 0); // 0=Base, 1-4=meals, 5=Oggi
export const expandedMacros = writable(new Set<string>());
export const flashSet       = writable(new Set<string>());
export const savedBase      = writable<SavedPlan | null>(loadSavedBase());

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

type SmartTarget = { kcal: number; c: number; p: number; f: number };

function getWeights(target: SmartTarget) {
  const cKcal = target.c * 4, pKcal = target.p * 4, fKcal = target.f * 9;
  const total = cKcal + pKcal + fKcal;
  if (!total) return { wKcal: 0.5, wC: 0.2, wP: 0.2, wF: 0.1 };
  const dominant = Math.max(cKcal, pKcal, fKcal) / total;
  if (dominant < 0.5) return { wKcal: 0.5, wC: 0.2, wP: 0.2, wF: 0.1 };
  if (cKcal >= pKcal && cKcal >= fKcal) return { wKcal: 0.2, wC: 0.6, wP: 0.1, wF: 0.1 };
  if (pKcal >= fKcal)                    return { wKcal: 0.2, wC: 0.1, wP: 0.6, wF: 0.1 };
  return                                        { wKcal: 0.2, wC: 0.1, wP: 0.1, wF: 0.6 };
}

function calcSmartQty(target: SmartTarget, substituteName: string): number {
  const sub = MACRO_DB[substituteName];
  if (!sub) return 50;
  const { wKcal, wC, wP, wF } = getWeights(target);
  const sK = (sub.c * 4 + sub.p * 4 + sub.f * 9) / 100;
  const sC = sub.c / 100, sP = sub.p / 100, sF = sub.f / 100;
  const den = wKcal * sK**2 + wC * sC**2 + wP * sP**2 + wF * sF**2;
  if (!den || !Number.isFinite(den)) return 50;
  const num = wKcal * sK * target.kcal + wC * sC * target.c + wP * sP * target.p + wF * sF * target.f;
  let x = num / den;
  if (!Number.isFinite(x) || x <= 0) return 5;
  x = Math.round(x / 5) * 5;
  return Math.max(5, Math.min(x, 500));
}

export function recalcGroupFromMain(groupId: string) {
  const group = findGroup(groupId);
  if (!group) return;
  const mainIdx   = getMainIdx(group, get(mainItems));
  const mainItem  = group.items[mainIdx];
  const mainQty   = get(quantities)[groupId]?.[mainIdx] ?? mainItem.qty;
  const mainMacro = MACRO_DB[mainItem.name];
  if (!mainMacro || mainQty <= 0) return;
  const tC = (mainMacro.c / 100) * mainQty;
  const tP = (mainMacro.p / 100) * mainQty;
  const tF = (mainMacro.f / 100) * mainQty;
  const target: SmartTarget = { c: tC, p: tP, f: tF, kcal: tC * 4 + tP * 4 + tF * 9 };
  quantities.update(q => {
    const arr = [...(q[groupId] ?? group.items.map(i => i.qty))];
    group.items.forEach((item, i) => {
      if (i !== mainIdx) arr[i] = calcSmartQty(target, item.name);
    });
    return { ...q, [groupId]: arr };
  });
}

// ── Mutations ────────────────────────────────────────────

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

export function resetTodayToBase() {
  const base = get(savedBase);
  if (!base) return;
  quantities.set({ ...base.quantities });
  mainItems.set({ ...base.mains });
}

export function resetMeal(mealIdx: number) {
  const meal = MEALS[mealIdx];
  if (!meal) return;
  const base = get(savedBase);
  if (base) {
    quantities.update(q => {
      const next = { ...q };
      for (const g of meal.groups) {
        next[g.id] = base.quantities[g.id]
          ? [...base.quantities[g.id]]
          : g.items.map(i => i.qty);
      }
      return next;
    });
    mainItems.update(m => {
      const next = { ...m };
      for (const g of meal.groups) {
        next[g.id] = base.mains[g.id] ?? Math.max(0, g.items.findIndex(it => it.main));
      }
      return next;
    });
    meal.groups.forEach(g => g.items.forEach((_, i) => triggerFlash(`${g.id}_${i}`)));
  } else {
    meal.groups.forEach(g => resetGroup(g.id));
  }
}

export function toggleMacro(key: string) {
  expandedMacros.update(s => {
    const n = new Set(s);
    n.has(key) ? n.delete(key) : n.add(key);
    return n;
  });
}

export function setMain(groupId: string, idx: number) {
  const group = findGroup(groupId);
  if (!group) return;
  if (getMainIdx(group, get(mainItems)) === idx) return;
  mainItems.update(m => ({ ...m, [groupId]: idx }));
  triggerFlash(`${groupId}_${idx}`);
  recalcGroupFromMain(groupId);
}

export function saveAsBase() {
  const plan: SavedPlan = {
    quantities: get(quantities),
    mains: get(mainItems),
  };
  savedBase.set(plan);
  try { localStorage.setItem('mp_base', JSON.stringify(plan)); } catch { /* quota */ }
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
