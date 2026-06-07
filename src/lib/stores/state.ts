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

function loadSmartEnabled(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem('mp_smart');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {};
}

// ── Stores ───────────────────────────────────────────────
export const quantities     = writable<Record<string, number[]>>(loadQtys());
export const mainItems      = writable<Record<string, number>>(loadMains());
export const activeMeal     = writable(0);
export const expandedMacros = writable(new Set<string>());
export const flashSet       = writable(new Set<string>());

// Smart Swap
export type SmartTarget = { kcal: number; c: number; p: number; f: number };
export const smartSwapEnabled = writable<Record<string, boolean>>(loadSmartEnabled());
export const smartBadge       = writable(new Set<string>());
export const smartTargets     = writable<Record<string, SmartTarget>>({});

quantities.subscribe(v => {
  try { localStorage.setItem('mp_quantities', JSON.stringify(v)); } catch { /* quota */ }
});
mainItems.subscribe(v => {
  try { localStorage.setItem('mp_mains', JSON.stringify(v)); } catch { /* quota */ }
});
smartSwapEnabled.subscribe(v => {
  try { localStorage.setItem('mp_smart', JSON.stringify(v)); } catch { /* quota */ }
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

// Weights biased toward the dominant macro energy contribution in the target
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

function calcSmartQtyInternal(target: SmartTarget, substituteName: string): number {
  const sub = MACRO_DB[substituteName];
  if (!sub) return 50;

  const { wKcal, wC, wP, wF } = getWeights(target);
  const sK = (sub.c * 4 + sub.p * 4 + sub.f * 9) / 100;
  const sC = sub.c / 100;
  const sP = sub.p / 100;
  const sF = sub.f / 100;

  const den = wKcal * sK**2 + wC * sC**2 + wP * sP**2 + wF * sF**2;
  if (!den || !Number.isFinite(den)) return 50;

  const num = wKcal * sK * target.kcal + wC * sC * target.c + wP * sP * target.p + wF * sF * target.f;
  let x = num / den;
  if (!Number.isFinite(x) || x <= 0) return 5;
  x = Math.round(x / 5) * 5;
  return Math.max(5, Math.min(x, 500));
}

/** Match score 0–100 between a substitute at `qty` grams and the target nutritional profile. */
export function calcMatchScore(qty: number, name: string, target: SmartTarget): number {
  const sub = MACRO_DB[name];
  if (!sub || !qty) return 0;

  const { wKcal, wC, wP, wF } = getWeights(target);
  const sKcal = (sub.c * 4 + sub.p * 4 + sub.f * 9) / 100 * qty;
  const sC = sub.c / 100 * qty;
  const sP = sub.p / 100 * qty;
  const sF = sub.f / 100 * qty;

  const cost    = wKcal * (sKcal - target.kcal)**2 + wC * (sC - target.c)**2 +
                  wP * (sP - target.p)**2 + wF * (sF - target.f)**2;
  const maxCost = wKcal * target.kcal**2 + wC * target.c**2 + wP * target.p**2 + wF * target.f**2;

  if (!maxCost) return 100;
  return Math.max(0, Math.round(100 * (1 - cost / maxCost)));
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

  // Clear smart state on reset
  const mainIdx = get(mainItems)[groupId] ?? 0;
  smartBadge.update(s => { const n = new Set(s); n.delete(`${groupId}_${mainIdx}`); return n; });
  smartTargets.update(t => { const n = { ...t }; delete n[groupId]; return n; });

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

export function toggleSmartSwap(groupId: string) {
  smartSwapEnabled.update(m => ({ ...m, [groupId]: !(m[groupId] ?? true) }));
}

export function clearSmartBadge(key: string) {
  smartBadge.update(s => { const n = new Set(s); n.delete(key); return n; });
}

/** Set the active (main) item for a group. Applies Smart Swap if enabled. */
export function setMain(groupId: string, idx: number) {
  const group = findGroup(groupId);
  const currentMains = get(mainItems);
  const currentMainIdx = getMainIdx(group!, currentMains);

  if (currentMainIdx === idx) return;

  const smartOn = get(smartSwapEnabled)[groupId] ?? true;

  if (smartOn && group) {
    const currentQtys = get(quantities);
    const currentMainItem = group.items[currentMainIdx];
    const currentQty = currentQtys[groupId]?.[currentMainIdx] ?? currentMainItem.qty;
    const targetMacro = MACRO_DB[currentMainItem.name];

    if (targetMacro && currentQty > 0) {
      const tC = (targetMacro.c / 100) * currentQty;
      const tP = (targetMacro.p / 100) * currentQty;
      const tF = (targetMacro.f / 100) * currentQty;
      const target: SmartTarget = { c: tC, p: tP, f: tF, kcal: tC * 4 + tP * 4 + tF * 9 };

      const optimalQty = calcSmartQtyInternal(target, group.items[idx].name);

      smartTargets.update(t => ({ ...t, [groupId]: target }));
      smartBadge.update(s => {
        const n = new Set(s);
        n.delete(`${groupId}_${currentMainIdx}`);
        n.add(`${groupId}_${idx}`);
        return n;
      });

      quantities.update(q => {
        const arr = [...(q[groupId] ?? group.items.map(i => i.qty))];
        arr[idx] = optimalQty;
        return { ...q, [groupId]: arr };
      });
    }
  }

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
