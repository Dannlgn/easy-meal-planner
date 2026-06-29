export interface FoodItem {
  name: string;
  qty: number;
  main?: boolean;
  unitSize?: number;  // grammi per unità (es. 55 per un uovo medio)
  unitLabel?: string; // etichetta unità (es. 'uova')
}

export interface FoodGroup {
  id: string;
  label: string;
  items: FoodItem[];
  note?: string; // riga informativa mostrata sotto il titolo (es. disclaimer "Fuori Casa")
}

export interface MealSection {
  id: string;
  label: string;
  groupIds: string[]; // IDs dei FoodGroup che appartengono a questa sezione
}

export interface Meal {
  id: string;
  label: string;
  groups: FoodGroup[];
  sections?: MealSection[]; // quando presente, MealPanel usa la struttura gerarchica
}

export interface MacroData {
  c: number; // carboidrati per 100g
  p: number; // proteine per 100g
  f: number; // grassi per 100g
}
