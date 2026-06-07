import type { Meal } from '../types';

export const MEALS: Meal[] = [
  {
    id: 'col', label: 'Colazione',
    groups: [
      {
        id: 'col_carb', label: '1° Piatto – Carboidrati',
        items: [
          { name: 'Cereali da Colazione (media)', qty: 30, main: true },
          { name: 'Biscotti secchi',              qty: 20 },
          { name: 'Fette biscottate',             qty: 30 },
          { name: 'Pane comune',                  qty: 40 },
        ],
      },
      {
        id: 'col_gr', label: 'Grassi / Dolce',
        items: [
          { name: 'Cioccolato fondente',           qty: 20, main: true },
          { name: 'Frutta secca e oleosa (media)', qty: 20 },
          { name: 'Nocciolata – Rigoni di Asiago', qty: 20 },
          { name: 'Burro di Arachidi',             qty: 15 },
          { name: 'Burro di Mandorle',             qty: 15 },
        ],
      },
      {
        id: 'col_prot', label: 'Proteico',
        items: [
          { name: 'Yogurt greco magro 0% bianco', qty: 250, main: true },
          { name: 'Skyr bianco',                  qty: 250 },
        ],
      },
      {
        id: 'col_alt1', label: 'Alt. Salata – 1° Piatto',
        items: [
          { name: 'Farina di riso',           qty:  40, main: true },
          { name: "Farina d'avena",           qty:  40 },
          { name: 'Uova di gallina intere',   qty:  50 },
          { name: 'Uova di gallina – albume', qty: 200 },
          { name: 'Cioccolato fondente',      qty:  10 },
          { name: 'Nocciolata',               qty:  10 },
          { name: 'Burro di Arachidi',        qty:  10 },
          { name: 'Burro di Mandorle',        qty:  10 },
        ],
      },
      {
        id: 'col_alt2', label: 'Alternativa 2 – 1° Piatto',
        items: [
          { name: 'Pane comune',              qty:  60, main: true },
          { name: 'Uova di gallina intere',   qty: 100 },
          { name: 'Uova di gallina – albume', qty: 100 },
        ],
      },
    ],
  },

  {
    id: 'spu', label: 'Spuntino',
    groups: [
      {
        id: 'spu_carb', label: 'Carboidrati',
        items: [
          { name: 'Cereali da Colazione (media)',   qty: 30, main: true },
          { name: 'Gallette di riso',               qty: 30 },
          { name: 'Gallette di mais',               qty: 30 },
          { name: 'Crackers (normali, riso, mais)', qty: 30 },
          { name: 'Farina di riso',                 qty: 30 },
          { name: "Farina d'avena",                 qty: 30 },
          { name: 'Pane comune',                    qty: 40 },
        ],
      },
      {
        id: 'spu_prot', label: 'Proteico',
        items: [
          { name: 'Yogurt greco magro 0% bianco', qty: 250, main: true },
          { name: 'Skyr bianco',                  qty: 250 },
          { name: 'Whey Protein – Concentrate',   qty:  30 },
          { name: 'Uova di gallina – albume',     qty: 250 },
          { name: 'Affettato – Fesa di Tacchino', qty: 130 },
        ],
      },
      {
        id: 'spu_fru', label: 'Frutta',
        items: [
          { name: 'Frutta fresca',                    qty: 150, main: true },
          { name: 'Pura Frutta Frullata – Valfrutta', qty: 100 },
          { name: 'Marmellata',                       qty:  30 },
          { name: 'Miele',                            qty:  20 },
        ],
      },
    ],
  },

  {
    id: 'pra', label: 'Pranzo',
    groups: [
      {
        id: 'pra_carb', label: 'Carboidrati', dualMain: true,
        items: [
          { name: 'Pasta',              qty:  80, main: true },
          { name: 'Riso',               qty:  80 },
          { name: 'Farro',                      qty:  80 },
          { name: 'Cous Cous',                  qty:  80 },
          { name: 'Orzo perlato',               qty:  80 },
          { name: 'Polenta – farina di mais',   qty:  80 },
          { name: 'Quinoa',                     qty:  80 },
          { name: 'Pane comune',                qty: 100 },
          { name: 'Gnocchi di Patate',          qty: 170 },
          { name: 'Gnocchi alla Romana – Rana', qty: 340 },
          { name: 'Patate (media)',              qty: 350 },
          { name: 'Polenta Pronta – Valsugana', qty: 400 },
        ],
      },
      {
        id: 'pra_prot', label: 'Proteico',
        items: [
          { name: 'Carne (tagli magri)',       qty: 150, main: true },
          { name: 'Pesce bianco',              qty: 200 },
          { name: 'Tonno al Naturale',         qty: 130 },
          { name: 'Sgombro al Naturale',       qty: 130 },
          { name: 'Molluschi',                 qty: 280 },
          { name: 'Crostacei (media)',         qty: 220 },
          { name: 'Uova di gallina – albume',  qty: 300 },
          { name: 'Seitan al Naturale',        qty: 120 },
        ],
      },
      {
        id: 'pra_verd', label: 'Verdura',
        items: [
          { name: 'Verdura',  qty: 200, main: true },
          { name: 'Insalata', qty:  80 },
        ],
      },
      {
        id: 'pra_gr', label: 'Grassi',
        items: [
          { name: 'Olio di oliva EVO', qty: 10, main: true },
          { name: 'Pesto',             qty: 20 },
          { name: 'Avocado',           qty: 40 },
        ],
      },
    ],
  },

  {
    id: 'cen', label: 'Cena',
    groups: [
      {
        id: 'cen_carb', label: 'Carboidrati', dualMain: true,
        items: [
          { name: 'Pasta',              qty:  80, main: true },
          { name: 'Riso',               qty:  80 },
          { name: 'Farro',                      qty:  80 },
          { name: 'Cous Cous',                  qty:  80 },
          { name: 'Orzo perlato',               qty:  80 },
          { name: 'Polenta – farina di mais',   qty:  80 },
          { name: 'Quinoa',                     qty:  80 },
          { name: 'Pane comune',                qty: 100 },
          { name: 'Gnocchi di Patate',          qty: 170 },
          { name: 'Gnocchi alla Romana – Rana', qty: 340 },
          { name: 'Patate (media)',              qty: 350 },
          { name: 'Polenta Pronta – Valsugana', qty: 400 },
        ],
      },
      {
        id: 'cen_prot', label: 'Proteico',
        items: [
          { name: 'Uova di gallina (media)',           qty: 150, main: true },
          { name: 'Fiocchi di Latte',                  qty: 200 },
          { name: 'Mozzarella high protein benessere', qty: 150 },
          { name: 'Ricotta high protein benessere',    qty: 200 },
          { name: 'Parmigiano',                        qty:  50 },
          { name: 'Asiago',                            qty:  50 },
          { name: 'Hamburger Vegetale – Valsoia',      qty: 130 },
          { name: 'Tofu al naturale',                  qty: 120 },
          { name: 'Salmone',                           qty: 100 },
          { name: "Tonno all'olio d'oliva sgocciolato", qty: 90 },
        ],
      },
      {
        id: 'cen_verd', label: 'Verdura',
        items: [
          { name: 'Verdura',  qty: 200, main: true },
          { name: 'Insalata', qty:  80 },
        ],
      },
      {
        id: 'cen_gr', label: 'Grassi',
        items: [
          { name: 'Olio di oliva EVO', qty: 10, main: true },
          { name: 'Pesto',             qty: 20 },
          { name: 'Avocado',           qty: 40 },
        ],
      },
    ],
  },
];
