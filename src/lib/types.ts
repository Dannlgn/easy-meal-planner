export interface FoodItem {
  name: string;
  qty: number;
  main?: boolean;
}

export interface FoodGroup {
  id: string;
  label: string;
  items: FoodItem[];
  dualMain?: boolean;
}

export interface Meal {
  id: string;
  label: string;
  groups: FoodGroup[];
}

export interface MacroData {
  c: number; // carboidrati per 100g
  p: number; // proteine per 100g
  f: number; // grassi per 100g
}
