import type { MacroData } from '../types';

/** Valori per 100 g — fonte: tabelle CREA/INRAN */
export const MACRO_DB: Record<string, MacroData> = {
  // ── COLAZIONE ──
  'Cereali da Colazione (media)':     { c: 78.0, p:  8.0, f:  2.0 },
  'Biscotti secchi':                  { c: 74.5, p:  7.3, f:  8.5 },
  'Fette biscottate':                 { c: 74.9, p:  9.9, f:  5.5 },
  'Pane comune':                      { c: 54.3, p:  8.1, f:  1.0 },
  'Pane integrale':                   { c: 40.5, p:  7.9, f:  1.4 }, // CREA 000570
  'Cioccolato al latte':              { c: 58.0, p:  7.5, f: 30.0 }, // media commerciale (Lindt/Milka)
  'Cioccolato fondente':              { c: 50.1, p:  4.9, f: 31.3 }, // voce generica — mantenuta per compatibilità
  'Cioccolato fondente 70%':          { c: 44.0, p:  6.0, f: 43.0 }, // media commerciale (Lindt 70%)
  'Cioccolato fondente 80%':          { c: 37.0, p:  7.0, f: 46.0 }, // media commerciale (Lindt 80%)
  'Cioccolato fondente 90%':          { c: 31.0, p:  8.0, f: 50.0 }, // media commerciale (Lindt 90%)
  'Frutta secca e oleosa (media)':    { c: 11.7, p: 18.3, f: 54.1 },
  'Nocciolata – Rigoni di Asiago':    { c: 54.0, p:  5.8, f: 31.0 },
  'Nocciolata':                       { c: 54.0, p:  5.8, f: 31.0 },
  'Burro di Arachidi':                { c: 19.6, p: 25.1, f: 50.4 },
  'Burro di Mandorle':                { c: 19.7, p: 21.2, f: 55.8 },
  'Yogurt greco magro 0% bianco':     { c:  3.6, p: 10.0, f:  0.4 },
  'Yogurt greco intero':              { c:  3.8, p:  9.0, f:  5.0 }, // non in CREA — media commerciale (Fage/Chobani)
  'Skyr bianco':                      { c:  4.0, p: 11.0, f:  0.2 },
  'Latte intero':                     { c:  4.9, p:  3.3, f:  3.6 }, // CREA 135010
  'Latte parzialmente scremato':      { c:  5.0, p:  3.5, f:  1.5 }, // CREA 135020
  'Latte scremato':                   { c:  5.3, p:  3.6, f:  0.2 }, // CREA 135030
  'Latte senza lattosio':             { c:  4.9, p:  3.3, f:  3.6 }, // non in CREA — delattosazione non altera i macronutrienti, valori = latte intero
  'Latte di avena':                   { c:  6.6, p:  1.0, f:  1.5 }, // non in CREA — media Oatly/Alpro
  'Latte di soia':                    { c:  3.3, p:  3.3, f:  1.8 }, // non in CREA — media Alpro/Sojasun
  'Farina di riso':                   { c: 80.1, p:  6.5, f:  0.8 },
  "Farina d'avena":                   { c: 65.9, p: 12.9, f:  7.0 },
  "Fiocchi d'avena":                  { c: 64.9, p: 13.0, f:  6.9 }, // CREA 000440
  'Uova di gallina intere':           { c:  0.5, p: 12.4, f: 10.3 },
  'Uova di gallina – albume':         { c:  0.7, p: 10.9, f:  0.2 },
  // ── SPUNTINO ──
  'Gallette di riso':                 { c: 80.9, p:  7.0, f:  1.1 },
  'Gallette di mais':                 { c: 80.2, p:  7.2, f:  2.0 },
  'Crackers (normali, riso, mais)':   { c: 64.7, p:  9.1, f: 14.8 },
  'Whey Protein – Concentrate':       { c:  5.0, p: 80.0, f:  5.0 },
  'Affettato – Fesa di Tacchino':     { c:  0.5, p: 21.7, f:  1.5 },
  'Mandorle':                         { c: 16.8, p: 21.4, f: 55.3 }, // CREA 090010
  'Noci':                             { c:  5.0, p: 15.2, f: 65.2 }, // CREA 090090
  // Affettati — fonte CREA
  'Bresaola della Valtellina IGP':    { c:  0.4, p: 33.1, f:  2.0 }, // CREA 110020
  'Prosciutto crudo DOP di Parma':    { c:  0.3, p: 25.9, f: 18.3 }, // CREA 110510
  'Prosciutto cotto alta qualità':    { c:  0.8, p: 18.0, f: 11.9 }, // CREA 110410
  "Speck dell'Alto Adige IGP":        { c:  1.2, p: 30.7, f: 19.1 }, // CREA 110800
  'Mortadella Bologna IGP':           { c:  0.0, p: 15.7, f: 25.0 }, // CREA 110200
  'Salame Milano':                    { c:  1.1, p: 25.4, f: 31.0 }, // CREA 110640
  'Coppa':                            { c:  0.0, p: 28.9, f: 31.6 }, // CREA 110150
  'Pancetta tesa':                    { c:  0.0, p: 20.9, f: 28.1 }, // CREA 110310
  'Frutta fresca':                    { c:  9.9, p:  0.5, f:  0.2 },
  'Pura Frutta Frullata – Valfrutta': { c: 13.2, p:  0.4, f:  0.1 },
  'Marmellata':                       { c: 55.0, p:  0.5, f:  0.1 },
  'Miele':                            { c: 80.5, p:  0.3, f:  0.0 },
  // ── CARBOIDRATI Pranzo / Cena ──
  'Pasta':                            { c: 72.2, p: 13.0, f:  1.1 },
  'Pasta integrale':                  { c: 64.8, p: 13.3, f:  2.2 }, // CREA 000850
  'Pasta senza glutine':              { c: 74.0, p:  6.0, f:  1.5 }, // non in CREA — media Barilla/De Cecco GF
  'Riso':                             { c: 80.4, p:  6.7, f:  0.4 },
  'Riso integrale':                   { c: 77.4, p:  7.5, f:  1.9 }, // CREA 000110
  'Riso basmati':                     { c: 77.8, p:  7.1, f:  0.8 }, // non in CREA — media commerciale
  'Farro':                            { c: 67.0, p: 15.1, f:  2.5 },
  'Cous Cous':                        { c: 72.4, p: 12.8, f:  1.7 },
  'Orzo perlato':                     { c: 75.1, p: 10.0, f:  1.0 },
  'Polenta – farina di mais':         { c: 77.2, p:  8.7, f:  1.1 },
  'Quinoa':                           { c: 64.2, p: 14.1, f:  6.1 },
  'Gnocchi di Patate':                { c: 17.6, p:  1.8, f:  0.3 },
  'Gnocchi alla Romana – Rana':       { c: 22.0, p:  3.5, f:  3.5 },
  'Patate (media)':                   { c: 17.2, p:  2.1, f:  0.1 },
  'Polenta Pronta – Valsugana':       { c:  8.5, p:  1.0, f:  0.3 },
  'Lenticchie (cotte)':               { c: 17.1, p:  6.9, f:  0.4 }, // CREA 060650
  'Ceci (cotti)':                     { c: 21.3, p:  7.3, f:  2.6 }, // CREA 060250
  'Fagioli (cotti)':                  { c: 17.4, p:  6.9, f:  0.5 }, // CREA 060130
  // ── PRANZO — Proteico ──
  'Petto di pollo':                   { c:  0.0, p: 23.3, f:  1.2 }, // CREA 080220
  'Tacchino (petto)':                 { c:  0.0, p: 24.1, f:  1.0 }, // CREA 080800
  'Manzo (bistecca)':                 { c:  0.0, p: 20.7, f:  5.0 }, // CREA 070380
  'Carne (tagli magri)':              { c:  0.0, p: 21.3, f:  4.0 },
  'Pesce bianco':                     { c:  0.0, p: 18.2, f:  2.0 },
  'Merluzzo':                         { c:  0.0, p: 17.0, f:  0.7 }, // CREA 140060
  'Tonno al Naturale':                { c:  1.0, p: 26.0, f:  1.0 },
  'Sgombro al Naturale':              { c:  0.0, p: 22.0, f:  8.0 },
  'Molluschi':                        { c:  2.5, p: 15.8, f:  1.5 },
  'Crostacei (media)':                { c:  0.5, p: 17.9, f:  1.5 },
  'Seitan al Naturale':               { c: 12.0, p: 24.0, f:  1.5 },
  // ── Ricotta ──
  'Ricotta di vacca':                 { c:  3.5, p:  8.8, f: 10.9 }, // CREA 166820
  'Ricotta light':                    { c:  4.0, p:  9.5, f:  5.5 }, // non in CREA — media etichette commerciali (Granarolo/Galbani light)
  // ── CENA — Proteico ──
  'Fiocchi di Latte':                 { c:  3.2, p:  9.7, f:  7.1 },
  'Mozzarella high protein benessere':{ c:  2.0, p: 18.0, f: 14.0 },
  'Ricotta high protein benessere':   { c:  4.0, p: 12.0, f:  8.0 },
  'Parmigiano':                       { c:  0.0, p: 33.0, f: 29.0 },
  'Asiago':                           { c:  0.0, p: 30.0, f: 29.0 },
  'Hamburger Vegetale – Valsoia':     { c: 10.0, p: 16.0, f:  9.0 },
  'Tofu al naturale':                 { c:  1.9, p:  8.1, f:  4.8 },
  'Salmone':                          { c:  0.0, p: 20.1, f: 12.8 },
  'Salmone affumicato':               { c:  0.0, p: 25.4, f: 12.0 }, // CREA 140700
  "Tonno all'olio d'oliva sgocciolato": { c: 0.0, p: 25.2, f: 8.1 },
  // ── FRUTTA (fonte: tabelle CREA) ──
  'Mela':                             { c: 10.0, p:  0.2, f:  0.1 },
  'Banana':                           { c: 17.4, p:  1.2, f:  0.3 },
  'Pera':                             { c: 12.7, p:  0.2, f:  0.3 },
  'Arancia':                          { c:  7.8, p:  0.7, f:  0.2 },
  'Pesca':                            { c:  5.8, p:  0.7, f:  0.1 },
  'Fragola':                          { c:  5.3, p:  0.9, f:  0.4 },
  'Uva':                              { c: 15.6, p:  0.5, f:  0.1 },
  'Kiwi':                             { c:  9.0, p:  1.2, f:  0.6 },
  'Ananas':                           { c: 10.0, p:  0.5, f:  0.0 },
  'Mandarino':                        { c: 17.6, p:  0.9, f:  0.3 },
  'Mirtilli':                         { c:  7.2, p:  0.6, f:  0.3 }, // CREA 230140
  'Melone':                           { c:  7.4, p:  0.8, f:  0.2 }, // CREA 230430
  'Anguria':                          { c:  5.2, p:  0.5, f:  0.3 }, // CREA 230050
  'Susine':                           { c:  9.6, p:  0.7, f:  0.1 }, // CREA 230620
  'Albicocche':                       { c:  6.8, p:  0.6, f:  0.1 }, // CREA 230010
  // ── VERDURA / GRASSI ──
  'Verdura':                          { c:  4.7, p:  1.9, f:  0.3 },
  'Insalata':                         { c:  2.2, p:  1.3, f:  0.2 },
  'Olio di oliva EVO':                { c:  0.0, p:  0.0, f: 99.9 },
  'Pesto':                            { c:  5.2, p:  3.9, f: 46.0 },
  'Avocado':                          { c:  1.8, p:  2.0, f: 15.4 },
};
