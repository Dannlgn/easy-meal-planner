export interface FoodItem {
  name: string;
  qty: number;           // grammi; per gruppi portions: grammi per porzione (fisso)
  main?: boolean;
  unitSize?: number;     // grammi per unità (es. 55 per un uovo medio)
  unitLabel?: string;    // etichetta unità (es. 'uova')
  portionUnit?: string;  // etichetta porzione Fuori Casa (es. 'pizza', 'croissant')
}

export interface FoodGroup {
  id: string;
  label: string;
  items: FoodItem[];
  note?: string;
  portions?: true;       // se presente: input a porzioni intere, multi-select (Fuori Casa)
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
