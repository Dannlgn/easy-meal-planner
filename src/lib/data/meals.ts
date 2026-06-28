import type { Meal } from '../types';

export const MEALS: Meal[] = [
  {
    id: 'col', label: 'Colazione',
    groups: [
      {
        id: 'col_carb', label: '1° Piatto – Carboidrati',
        items: [
          { name: 'Biscotti secchi',              qty: 20 },
          { name: 'Cereali da Colazione (media)', qty: 30, main: true },
          { name: "Farina d'avena",               qty: 40 },
          { name: 'Farina di riso',               qty: 40 },
          { name: 'Fette biscottate',             qty: 30 },
          { name: "Fiocchi d'avena",              qty: 40 },
          { name: 'Pane comune',                  qty: 40 },
          { name: 'Pane integrale',               qty: 40 },
        ],
      },
      {
        id: 'col_gr', label: 'Grassi / Dolce',
        items: [
          { name: 'Burro di Arachidi',             qty: 15 },
          { name: 'Burro di Mandorle',             qty: 15 },
          { name: 'Cioccolato al latte',           qty: 20, main: true },
          { name: 'Cioccolato fondente 70%',       qty: 20 },
          { name: 'Cioccolato fondente 80%',       qty: 20 },
          { name: 'Cioccolato fondente 90%',       qty: 20 },
          { name: 'Frutta secca e oleosa (media)', qty: 20 },
          { name: 'Nocciolata – Rigoni di Asiago', qty: 20 },
        ],
      },
      {
        id: 'col_prot', label: 'Proteico',
        items: [
          { name: 'Fiocchi di Latte',              qty: 200 },
          { name: 'Ricotta di vacca',              qty: 150 },
          { name: 'Ricotta light',                 qty: 150 },
          { name: 'Skyr bianco',                   qty: 250 },
          { name: 'Uova di gallina – albume',      qty: 200 },
          { name: 'Uova di gallina intere',        qty:  55, unitSize: 55, unitLabel: 'uova' },
          { name: 'Whey Protein – Concentrate',   qty:  30 },
          { name: 'Yogurt greco intero',           qty: 250 },
          { name: 'Yogurt greco magro 0% bianco',  qty: 250, main: true },
        ],
      },
      {
        id: 'col_latte', label: 'Latte',
        items: [
          { name: 'Latte di avena',              qty: 200 },
          { name: 'Latte di soia',               qty: 200 },
          { name: 'Latte intero',                qty: 200, main: true },
          { name: 'Latte parzialmente scremato', qty: 200 },
          { name: 'Latte scremato',              qty: 200 },
          { name: 'Latte senza lattosio',        qty: 200 },
        ],
      },
      {
        id: 'col_fru', label: 'Frutta',
        items: [
          { name: 'Albicocche',  qty: 150 },
          { name: 'Ananas',      qty: 150 },
          { name: 'Anguria',     qty: 200 },
          { name: 'Arancia',     qty: 150 },
          { name: 'Banana',      qty: 100 },
          { name: 'Fragola',     qty: 150 },
          { name: 'Kiwi',        qty: 100 },
          { name: 'Mandarino',   qty: 100 },
          { name: 'Mela',        qty: 150, main: true },
          { name: 'Melone',      qty: 200 },
          { name: 'Mirtilli',    qty: 150 },
          { name: 'Pera',        qty: 150 },
          { name: 'Pesca',       qty: 150 },
          { name: 'Susine',      qty: 150 },
          { name: 'Uva',         qty: 100 },
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
          { name: 'Crackers (normali, riso, mais)', qty: 30 },
          { name: "Farina d'avena",                 qty: 30 },
          { name: 'Farina di riso',                 qty: 30 },
          { name: 'Gallette di mais',               qty: 30 },
          { name: 'Gallette di riso',               qty: 30 },
          { name: 'Pane comune',                    qty: 40 },
          { name: 'Pane integrale',                 qty: 40 },
        ],
      },
      {
        id: 'spu_prot', label: 'Proteico',
        items: [
          { name: 'Affettato – Fesa di Tacchino', qty: 130 },
          { name: 'Fiocchi di Latte',             qty: 200 },
          { name: 'Skyr bianco',                  qty: 250 },
          { name: 'Uova di gallina – albume',     qty: 250 },
          { name: 'Whey Protein – Concentrate',  qty:  30 },
          { name: 'Yogurt greco intero',          qty: 250 },
          { name: 'Yogurt greco magro 0% bianco', qty: 250, main: true },
        ],
      },
      {
        id: 'spu_aff', label: 'Affettati',
        items: [
          { name: 'Bresaola della Valtellina IGP',  qty: 80, main: true },
          { name: 'Coppa',                          qty: 60 },
          { name: 'Mortadella Bologna IGP',         qty: 60 },
          { name: 'Pancetta tesa',                  qty: 50 },
          { name: 'Prosciutto cotto alta qualità',  qty: 80 },
          { name: 'Prosciutto crudo DOP di Parma',  qty: 60 },
          { name: 'Salame Milano',                  qty: 50 },
          { name: "Speck dell'Alto Adige IGP",      qty: 60 },
        ],
      },
      {
        id: 'spu_fn', label: 'Frutta Secca',
        items: [
          { name: 'Mandorle', qty: 30, main: true },
          { name: 'Noci',     qty: 25 },
        ],
      },
      {
        id: 'spu_fru', label: 'Frutta',
        items: [
          { name: 'Albicocche',                       qty: 150 },
          { name: 'Ananas',                           qty: 150 },
          { name: 'Anguria',                          qty: 200 },
          { name: 'Arancia',                          qty: 150 },
          { name: 'Banana',                           qty: 100 },
          { name: 'Fragola',                          qty: 150 },
          { name: 'Kiwi',                             qty: 100 },
          { name: 'Mandarino',                        qty: 100 },
          { name: 'Marmellata',                       qty:  30 },
          { name: 'Mela',                             qty: 150, main: true },
          { name: 'Melone',                           qty: 200 },
          { name: 'Miele',                            qty:  20 },
          { name: 'Mirtilli',                         qty: 150 },
          { name: 'Pera',                             qty: 150 },
          { name: 'Pesca',                            qty: 150 },
          { name: 'Pura Frutta Frullata – Valfrutta', qty: 100 },
          { name: 'Susine',                           qty: 150 },
          { name: 'Uva',                              qty: 100 },
        ],
      },
    ],
  },

  {
    id: 'spu2', label: 'Spuntino 2',
    groups: [
      {
        id: 'spu2_carb', label: 'Carboidrati',
        items: [
          { name: 'Cereali da Colazione (media)',   qty: 30, main: true },
          { name: 'Crackers (normali, riso, mais)', qty: 30 },
          { name: "Farina d'avena",                 qty: 30 },
          { name: 'Farina di riso',                 qty: 30 },
          { name: 'Gallette di mais',               qty: 30 },
          { name: 'Gallette di riso',               qty: 30 },
          { name: 'Pane comune',                    qty: 40 },
          { name: 'Pane integrale',                 qty: 40 },
        ],
      },
      {
        id: 'spu2_prot', label: 'Proteico',
        items: [
          { name: 'Affettato – Fesa di Tacchino', qty: 130 },
          { name: 'Fiocchi di Latte',             qty: 200 },
          { name: 'Skyr bianco',                  qty: 250 },
          { name: 'Uova di gallina – albume',     qty: 250 },
          { name: 'Whey Protein – Concentrate',  qty:  30 },
          { name: 'Yogurt greco intero',          qty: 250 },
          { name: 'Yogurt greco magro 0% bianco', qty: 250, main: true },
        ],
      },
      {
        id: 'spu2_aff', label: 'Affettati',
        items: [
          { name: 'Bresaola della Valtellina IGP',  qty: 80, main: true },
          { name: 'Coppa',                          qty: 60 },
          { name: 'Mortadella Bologna IGP',         qty: 60 },
          { name: 'Pancetta tesa',                  qty: 50 },
          { name: 'Prosciutto cotto alta qualità',  qty: 80 },
          { name: 'Prosciutto crudo DOP di Parma',  qty: 60 },
          { name: 'Salame Milano',                  qty: 50 },
          { name: "Speck dell'Alto Adige IGP",      qty: 60 },
        ],
      },
      {
        id: 'spu2_fn', label: 'Frutta Secca',
        items: [
          { name: 'Mandorle', qty: 30, main: true },
          { name: 'Noci',     qty: 25 },
        ],
      },
      {
        id: 'spu2_fru', label: 'Frutta',
        items: [
          { name: 'Albicocche',                       qty: 150 },
          { name: 'Ananas',                           qty: 150 },
          { name: 'Anguria',                          qty: 200 },
          { name: 'Arancia',                          qty: 150 },
          { name: 'Banana',                           qty: 100 },
          { name: 'Fragola',                          qty: 150 },
          { name: 'Kiwi',                             qty: 100 },
          { name: 'Mandarino',                        qty: 100 },
          { name: 'Marmellata',                       qty:  30 },
          { name: 'Mela',                             qty: 150, main: true },
          { name: 'Melone',                           qty: 200 },
          { name: 'Miele',                            qty:  20 },
          { name: 'Mirtilli',                         qty: 150 },
          { name: 'Pera',                             qty: 150 },
          { name: 'Pesca',                            qty: 150 },
          { name: 'Pura Frutta Frullata – Valfrutta', qty: 100 },
          { name: 'Susine',                           qty: 150 },
          { name: 'Uva',                              qty: 100 },
        ],
      },
    ],
  },

  {
    id: 'pra', label: 'Pranzo',
    sections: [
      { id: 'pra_sec_carb', label: 'Carboidrati', groupIds: ['pra_carb_cer', 'pra_carb_leg', 'pra_carb_alt'] },
      { id: 'pra_sec_prot', label: 'Proteico',    groupIds: ['pra_prot_car', 'pra_prot_pes', 'pra_prot_uov', 'pra_prot_lat', 'pra_prot_veg'] },
      { id: 'pra_sec_verd', label: 'Verdura',     groupIds: ['pra_verd'] },
      { id: 'pra_sec_gr',   label: 'Grassi',      groupIds: ['pra_gr'] },
    ],
    groups: [
      {
        id: 'pra_carb_cer', label: 'Carboidrati – Pasta e cereali',
        items: [
          { name: 'Cous Cous',                qty:  80 },
          { name: 'Farro',                    qty:  80 },
          { name: 'Orzo perlato',             qty:  80 },
          { name: 'Pasta',                    qty:  80, main: true },
          { name: 'Pasta integrale',          qty:  80 },
          { name: 'Pasta senza glutine',      qty:  80 },
          { name: 'Polenta – farina di mais', qty:  80 },
          { name: 'Quinoa',                   qty:  80 },
          { name: 'Riso',                     qty:  80 },
          { name: 'Riso basmati',             qty:  80 },
          { name: 'Riso integrale',           qty:  80 },
        ],
      },
      {
        id: 'pra_carb_leg', label: 'Carboidrati – Legumi',
        items: [
          { name: 'Ceci (cotti)',       qty: 200 },
          { name: 'Fagioli (cotti)',    qty: 200 },
          { name: 'Lenticchie (cotte)', qty: 200, main: true },
        ],
      },
      {
        id: 'pra_carb_alt', label: 'Carboidrati – Altro',
        items: [
          { name: 'Gnocchi alla Romana – Rana', qty: 340 },
          { name: 'Gnocchi di Patate',          qty: 170 },
          { name: 'Pane comune',                qty: 100, main: true },
          { name: 'Pane integrale',             qty: 100 },
          { name: 'Patate (media)',              qty: 350 },
          { name: 'Polenta Pronta – Valsugana', qty: 400 },
        ],
      },
      {
        id: 'pra_prot_car', label: 'Proteico – Carne',
        items: [
          { name: 'Manzo (bistecca)', qty: 150 },
          { name: 'Petto di pollo',   qty: 150, main: true },
          { name: 'Tacchino (petto)', qty: 150 },
        ],
      },
      {
        id: 'pra_prot_pes', label: 'Proteico – Pesce e mare',
        items: [
          { name: 'Crostacei (media)',                  qty: 220 },
          { name: 'Merluzzo',                           qty: 200 },
          { name: 'Molluschi',                          qty: 280 },
          { name: 'Pesce bianco',                       qty: 200, main: true },
          { name: 'Salmone',                            qty: 100 },
          { name: 'Salmone affumicato',                 qty: 100 },
          { name: 'Sgombro al Naturale',                qty: 130 },
          { name: 'Tonno al Naturale',                  qty: 130 },
          { name: "Tonno all'olio d'oliva sgocciolato", qty:  90 },
        ],
      },
      {
        id: 'pra_prot_uov', label: 'Proteico – Uova',
        items: [
          { name: 'Uova di gallina – albume', qty: 300 },
          { name: 'Uova di gallina intere',   qty: 165, main: true, unitSize: 55, unitLabel: 'uova' },
        ],
      },
      {
        id: 'pra_prot_lat', label: 'Proteico – Latticini',
        items: [
          { name: 'Asiago',                            qty:  50 },
          { name: 'Fiocchi di Latte',                  qty: 200, main: true },
          { name: 'Mozzarella high protein benessere', qty: 150 },
          { name: 'Parmigiano',                        qty:  50 },
          { name: 'Ricotta di vacca',                  qty: 150 },
          { name: 'Ricotta high protein benessere',    qty: 200 },
          { name: 'Ricotta light',                     qty: 150 },
        ],
      },
      {
        id: 'pra_prot_veg', label: 'Proteico – Vegetale',
        items: [
          { name: 'Hamburger Vegetale – Valsoia', qty: 130 },
          { name: 'Seitan al Naturale',           qty: 120 },
          { name: 'Tofu al naturale',             qty: 120, main: true },
        ],
      },
      {
        id: 'pra_verd', label: 'Verdura',
        items: [
          { name: 'Insalata', qty:  80 },
          { name: 'Verdura',  qty: 200, main: true },
        ],
      },
      {
        id: 'pra_gr', label: 'Grassi',
        items: [
          { name: 'Avocado',           qty: 40 },
          { name: 'Olio di oliva EVO', qty: 10, main: true },
          { name: 'Pesto',             qty: 20 },
        ],
      },
    ],
  },

  {
    id: 'cen', label: 'Cena',
    sections: [
      { id: 'cen_sec_carb', label: 'Carboidrati', groupIds: ['cen_carb_cer', 'cen_carb_leg', 'cen_carb_alt'] },
      { id: 'cen_sec_prot', label: 'Proteico',    groupIds: ['cen_prot_car', 'cen_prot_pes', 'cen_prot_uov', 'cen_prot_lat', 'cen_prot_veg'] },
      { id: 'cen_sec_verd', label: 'Verdura',     groupIds: ['cen_verd'] },
      { id: 'cen_sec_gr',   label: 'Grassi',      groupIds: ['cen_gr'] },
    ],
    groups: [
      {
        id: 'cen_carb_cer', label: 'Carboidrati – Pasta e cereali',
        items: [
          { name: 'Cous Cous',                qty:  80 },
          { name: 'Farro',                    qty:  80 },
          { name: 'Orzo perlato',             qty:  80 },
          { name: 'Pasta',                    qty:  80, main: true },
          { name: 'Pasta integrale',          qty:  80 },
          { name: 'Pasta senza glutine',      qty:  80 },
          { name: 'Polenta – farina di mais', qty:  80 },
          { name: 'Quinoa',                   qty:  80 },
          { name: 'Riso',                     qty:  80 },
          { name: 'Riso basmati',             qty:  80 },
          { name: 'Riso integrale',           qty:  80 },
        ],
      },
      {
        id: 'cen_carb_leg', label: 'Carboidrati – Legumi',
        items: [
          { name: 'Ceci (cotti)',       qty: 200 },
          { name: 'Fagioli (cotti)',    qty: 200 },
          { name: 'Lenticchie (cotte)', qty: 200, main: true },
        ],
      },
      {
        id: 'cen_carb_alt', label: 'Carboidrati – Altro',
        items: [
          { name: 'Gnocchi alla Romana – Rana', qty: 340 },
          { name: 'Gnocchi di Patate',          qty: 170 },
          { name: 'Pane comune',                qty: 100, main: true },
          { name: 'Pane integrale',             qty: 100 },
          { name: 'Patate (media)',              qty: 350 },
          { name: 'Polenta Pronta – Valsugana', qty: 400 },
        ],
      },
      {
        id: 'cen_prot_car', label: 'Proteico – Carne',
        items: [
          { name: 'Manzo (bistecca)', qty: 150 },
          { name: 'Petto di pollo',   qty: 150, main: true },
          { name: 'Tacchino (petto)', qty: 150 },
        ],
      },
      {
        id: 'cen_prot_pes', label: 'Proteico – Pesce e mare',
        items: [
          { name: 'Crostacei (media)',                  qty: 220 },
          { name: 'Merluzzo',                           qty: 200 },
          { name: 'Molluschi',                          qty: 280 },
          { name: 'Pesce bianco',                       qty: 200, main: true },
          { name: 'Salmone',                            qty: 100 },
          { name: 'Salmone affumicato',                 qty: 100 },
          { name: 'Sgombro al Naturale',                qty: 130 },
          { name: 'Tonno al Naturale',                  qty: 130 },
          { name: "Tonno all'olio d'oliva sgocciolato", qty:  90 },
        ],
      },
      {
        id: 'cen_prot_uov', label: 'Proteico – Uova',
        items: [
          { name: 'Uova di gallina – albume', qty: 300 },
          { name: 'Uova di gallina intere',   qty: 165, main: true, unitSize: 55, unitLabel: 'uova' },
        ],
      },
      {
        id: 'cen_prot_lat', label: 'Proteico – Latticini',
        items: [
          { name: 'Asiago',                            qty:  50 },
          { name: 'Fiocchi di Latte',                  qty: 200, main: true },
          { name: 'Mozzarella high protein benessere', qty: 150 },
          { name: 'Parmigiano',                        qty:  50 },
          { name: 'Ricotta di vacca',                  qty: 150 },
          { name: 'Ricotta high protein benessere',    qty: 200 },
          { name: 'Ricotta light',                     qty: 150 },
        ],
      },
      {
        id: 'cen_prot_veg', label: 'Proteico – Vegetale',
        items: [
          { name: 'Hamburger Vegetale – Valsoia', qty: 130 },
          { name: 'Seitan al Naturale',           qty: 120 },
          { name: 'Tofu al naturale',             qty: 120, main: true },
        ],
      },
      {
        id: 'cen_verd', label: 'Verdura',
        items: [
          { name: 'Insalata', qty:  80 },
          { name: 'Verdura',  qty: 200, main: true },
        ],
      },
      {
        id: 'cen_gr', label: 'Grassi',
        items: [
          { name: 'Avocado',           qty: 40 },
          { name: 'Olio di oliva EVO', qty: 10, main: true },
          { name: 'Pesto',             qty: 20 },
        ],
      },
    ],
  },
];
