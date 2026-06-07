# Trading Dashboard — Piano di Progetto
> Documento di lavoro — aggiornato progressivamente
> Ultima revisione: 2026-05-31 (v7 — review trader + nuove feature analitiche)

---

## 1. Stato attuale (tutto implementato e funzionante)

| Componente | Stato |
|-----------|-------|
| Backend FastAPI + SQLite | ✅ |
| Frontend React + Tailwind | ✅ |
| Launcher .bat + VBScript | ✅ |
| Trade Log (CRUD completo) | ✅ |
| Rating engine A+/A/B/C/~ | ✅ |
| Dashboard KPI + calendario integrato | ✅ |
| Stats per sessione / giorno / setup | ✅ |
| Fasce orarie 30 min — stacked bar chart Win/Loss/BE | ✅ |
| Account selector + gestione multi-account | ✅ |
| Psicologia (checklist + disciplina) | ✅ |
| Backup automatico ad ogni avvio | ✅ |
| Libreria Confluenze Globali (model-agnostic) | ✅ |
| DOL — has_dol + dol_global_confluence_id | ✅ |
| Screenshot multipli con drag & drop + preview inline | ✅ |
| Pagina Statistiche (confluenze + DOL) | ✅ |

---

## 2. Architettura

### Stack
- **Backend**: FastAPI (Python) + SQLite — porta 8000
- **Frontend**: React + TypeScript + Vite + Tailwind CSS — porta 5173

### Struttura cartelle
```
trading-dashboard/
├── backend/
│   ├── main.py
│   ├── database.py          # schema + migrations + seed
│   ├── rating.py            # rating engine (global confluences)
│   ├── session_utils.py     # auto-assign sessione + durata
│   ├── schemas.py
│   └── routers/
│       ├── accounts.py
│       ├── trades.py        # CRUD + screenshot multi + DOL
│       ├── playbook.py      # modelli + confluenze per-modello
│       ├── global_confluences.py   # libreria globale CRUD
│       ├── dashboard.py     # KPI + stats (30 min slot, session, day, model)
│       ├── calendar.py
│       ├── psychology.py    # checklist + disciplina
│       ├── coach.py         # Ollama AI coach
│       └── statistics.py   # stats per confluenza + DOL
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── types/index.ts
│       ├── api/client.ts
│       ├── components/Layout/Sidebar.tsx
│       └── pages/
│           ├── DashboardPage.tsx
│           ├── TradeLogPage.tsx
│           ├── PlaybookPage.tsx
│           ├── StatisticsPage.tsx
│           ├── PsychologyPage.tsx
│           └── CoachPage.tsx
```

### Database — tabelle principali
| Tabella | Scopo |
|---------|-------|
| `accounts` | Multi-account |
| `models` | Setup / modelli di trading |
| `confluences` | Confluenze per-modello (legacy, backward compat) |
| `global_confluences` | Libreria confluenze globale (nuova) |
| `trades` | Trade + campi DOL + rating |
| `trade_global_confluences` | Giunzione trade ↔ global confluences |
| `trade_screenshots` | Immagini multiple per trade |
| `checklist_questions` / `daily_checklists` | Pre-session checklist |
| `discipline_questions` / `daily_discipline` | Score disciplina |

---

## 3. Logiche chiave

### Confluenze
- **Global confluences**: libreria centrale, model-agnostic, selezionabili nel form trade
- **Per-model confluences**: restano nel DB e nel Playbook per documentazione strategica; NON più usate nel form trade
- Il **rating** (A+/A/B/C/~) è calcolato dinamicamente sulle combinazioni di global confluences

### DOL (Draw on Liquidity)
- `has_dol` (bool) — se il trade ha un DOL
- `dol_global_confluence_id` — quale tipo di DOL (dalla libreria globale)
- Statistiche DOL vs no-DOL disponibili nella pagina Statistiche

### Sessione auto-assign
Basata sull'ora di entrata (UTC):
- `02:00–04:59` → London
- `09:00–10:59` → NY AM
- `12:00–12:59` → NY Lunch
- `13:30–15:59` → NY PM
- Tutto il resto → Other

### Fasce orarie
- Bucket da 30 minuti basati sull'`entry_time`
- Stacked bar chart nel dashboard: Win (verde) / BE (grigio) / Loss (rosso)

---

---

## 3b. Update v7 — Analisi critica trader ✅ COMPLETATO

### Feature A — Expectancy KPI
- Calcolo: `(WR × avg_R_win) + (LR × avg_R_loss)` — dati già esistenti
- Aggiunta come 5ª card KPI nella Dashboard
- Backend: nuovo campo `expectancy` nel response `/api/dashboard/stats`

### Feature B — Equity Curve
- Grafico P&L cumulativo per trade nel tempo
- Backend: nuovo endpoint `GET /api/statistics/equity-curve?account_id=`
- Frontend: in pagina Statistiche (verrà riposizionata nel prossimo step di layout)
- Nota futura: aggiungere linea tratteggiata trailing drawdown prop firm (plus feature)

### Feature C — Bias (Bullish / Bearish / No bias)
- Campo `bias` sul trade: 3 stati — `'Bullish'`, `'Bearish'`, `NULL` (= no bias)
- Logica identica a DOL: `has_bias` + `bias_direction` → unico campo `bias TEXT`
- Backend: `ALTER TABLE trades ADD COLUMN bias TEXT`
- Frontend: select 3 stati nel form trade (sezione modello, accanto a DOL)
- Stats: sezione "Analisi Bias" in pagina Statistiche (struttura identica a DOL: Bullish / Bearish / No bias)

### Feature D — Tag Errori (personalizzabili)
- Nuove tabelle: `mistake_tags` + `trade_mistake_tags` (struttura identica a global_confluences)
- Default seeded: SL spostato · Entrato presto · Uscito presto · Trade fuori piano · FOMO/Revenge · Sizing sbagliato
- Frontend form: multi-select nel form trade (sezione separata dopo Esito)
- Gestione tag: sezione nel Playbook (come global confluences)
- Stats: sezione "Analisi Errori" in pagina Statistiche (per ogni tag: totale, % perdite, P&L medio)

### File modificati
| File | Modifica |
|---|---|
| `backend/database.py` | Aggiunge `bias` column, tabelle `mistake_tags`/`trade_mistake_tags`, seed |
| `backend/routers/trades.py` | `bias` + `mistake_tag_ids` in Create/Update/response |
| `backend/routers/dashboard.py` | `expectancy`, `avg_r_win`, `avg_r_loss` nel response stats |
| `backend/routers/statistics.py` | Endpoints bias stats, mistake stats, equity curve |
| `backend/routers/mistake_tags.py` | Nuovo router CRUD mistake tags |
| `backend/main.py` | Include nuovo router |
| `frontend/src/types/index.ts` | Nuovi tipi |
| `frontend/src/api/client.ts` | Nuove funzioni API |
| `frontend/src/pages/TradeLogPage.tsx` | Campo bias + mistake tags form |
| `frontend/src/pages/PlaybookPage.tsx` | Sezione gestione mistake tags |
| `frontend/src/pages/DashboardPage.tsx` | Expectancy KPI card |
| `frontend/src/pages/StatisticsPage.tsx` | Equity curve + bias + mistake stats |

---

---

## 3c. Update v8 — Miglioramento Layout Dashboard

### Obiettivo
Eliminare lo spazio vuoto causato dal calendario full-width. Layout più denso e professionale.

### Nuovo layout Dashboard

```
[KPI cards — 5 colonne]

[Calendario (50%) | Sidebar (50%)]
                     ├─ Rating Distribution (grafico compatto)
                     ├─ Probability Widget
                     └─ Mini-stats Sessione (tabella compatta)

[Giorno della Settimana | Performance Setup]  ← 2 colonne

[Fasce Orarie 30min — full-width]
```

### Componenti modificati
| File | Modifica |
|---|---|
| `frontend/src/pages/DashboardPage.tsx` | Nuovo layout griglia; `MiniSessionStats` component; `CalendarSection` senza `mt-4` |

### Decisioni layout
- Sessione completa rimossa dalla sezione inferiore (già visibile nella sidebar)
- Rating Distribution + Probability Widget spostati nella colonna destra del calendario
- Fasce orarie rimangono full-width (grafico stacked bar necessita di spazio)
- Setup + Giorno settimana affiancati in 2 colonne (tabelle compact)

---

---

## 3d. Project Review v9 — Data Safety, Workflow & Roadmap
> Analisi completata: 2026-06-02 | Revisione da trader, product designer, software architect

### Contesto raccolto
- **Volume dati attuale**: < 100 trade
- **Deploy**: Locale ora, cloud in 6+ mesi
- **Pain point principale**: Logging (accettabile), maggiore preoccupazione = affidabilità dati e restore
- **Workflow**: Entry / SL / TP / Exit / Size inseriti manualmente ogni volta
- **Analytics usate**: DOL e Bias (con pochi dati attuali, focus futuro)
- **Review quotidiana**: "Sto rispettando il mio piano di trading?"

---

### A. Critical Bugs

| ID | Problema | Priorità | Impatto | Complessità | Note |
|----|---------|----------|---------|-------------|------|
| A1 | **Route `/patterns` senza pagina** — App.tsx include PatternDiscoveryPage non implementata → crash React se navigata | P1 | Alto | Bassa | Rimuovere la route |
| A2 | **Logica sessione duplicata** — `session_utils.py` e `api/client.ts` hanno entrambi la logica di auto-assign sessione. Divergenza silente possibile | P1 | Alto | Bassa | Consolidare su backend only |
| A3 | **Rating O(T²)** — recalculate_all_ratings() gira ad ogni CRUD; con 500+ trade può bloccare. Non urgente ora | P3 | Basso ora | Media | Rivalutare a 500+ trade |
| A4 | **Screenshot dual-path** — legacy `screenshot_path` + nuovo `trade_screenshots` coesistono. Trade da vecchi backup possono mostrare screenshot mancanti | P2 | Medio | Media | Normalizzare al restore |

---

### B. Workflow Improvements

| ID | Problema | Priorità | Impatto | Complessità | Note |
|----|---------|----------|---------|-------------|------|
| B1 | **Auto-calcolo live nel form** — Entry + SL + Size → Risk$, P&L, R-multiple calcolati live. User: "testiamo" | P1 | Alto | Bassa | Calcolo lato frontend |
| B2 | **Clone trade** — ripetere setup simile richiede form da zero | P2 | Medio | Bassa | |
| B3 | **Filtri non persistenti** — Trade Log azzera filtri ad ogni navigazione | P2 | Medio | Bassa | localStorage |
| B4 | **Form senza draft** — crash durante compilazione = perdita tutto | P3 | Medio | Bassa | localStorage |
| B5 | **Modifica in-lista** — per correggere esito serve aprire form completo | P3 | Basso | Media | |

---

### C. Analytics Improvements

| ID | Problema | Priorità | Impatto | Complessità | Note |
|----|---------|----------|---------|-------------|------|
| C1 | **Probability Widget rotto** — algoritmo usa streak + distribuzione normale: staticamente non valido per trading. User: "non lo uso" | P1 | Alto | Bassa | Sostituire con Streak Awareness Widget (vedi C1b) |
| C1b | **Streak Awareness Widget** — sostituto del Probability Widget: mostra streak corrente + reminder psicologico calibrato sul WR personale | P1 | Alto | Bassa | Nessuna "previsione" — solo contesto emotivo |
| C2 | **Trend performance mensile** — nessun modo di vedere se si sta migliorando mese su mese per lo stesso setup | P2 | Alto | Media | |
| C3 | **Drawdown non tracciato** — no peak-to-valley, no max drawdown, no recovery factor | P2 | Alto | Media | |
| C4 | **MAE/MFE** — Maximum Adverse/Favorable Excursion. User non conosce i concetti | P3 | Alto (futuro) | Alta | Da introdurre dopo cloud |
| C5 | **Mistake analysis prominenza** — "Sto rispettando il piano?" è la domanda principale. I mistake tags esistono ma non abbastanza visibili nella review quotidiana | P2 | Alto | Bassa | Widget dedicato nella Dashboard |

---

### D. Data Safety & Recovery

| ID | Problema | Priorità | Impatto | Complessità | Note |
|----|---------|----------|---------|-------------|------|
| D1 | **Restore mai testato** — User non ha mai usato il pulsante Restore, non sa come funziona | P1 | Critico | Bassa | Guided restore dialog + test del flusso |
| D2 | **Backup nella stessa cartella del DB** — disco guasto = perdita DB + backup insieme | P1 | Critico | Bassa | Configurare path backup esterno (OneDrive, ecc.) |
| D3 | **Rotazione backup assente** — backup si accumulano senza limite | P2 | Medio | Bassa | Mantenere ultimi N backup (es. 30) |
| D4 | **CORS aperto a `*`** — accettabile in locale, da chiudere prima del deploy cloud | P2 | Basso ora | Bassissima | Fix in 2 righe |
| D5 | **Upload senza validazione backend** — frontend-only check. Da correggere prima del cloud | P2 | Basso ora | Bassa | Whitelist estensioni + size limit lato backend |
| D6 | **Nessun export** — user non lo richiede attualmente | P3 | Basso | Bassa | Rivalutare al cloud |

---

### E. Long-Term (Cloud & Future)

| ID | Idea | Priorità | Impatto | Complessità | Note |
|----|------|----------|---------|-------------|------|
| E1 | **Authentication** — prima del deploy cloud. JWT o session-based | P2 | Critico (cloud) | Alta | Non fare ora |
| E2 | **Mobile responsive** — sidebar fissa, chart non responsive | P3 | Alto | Alta | |
| E3 | **Import da broker CSV** — eliminare logging manuale | P3 | Alto | Alta | |
| E4 | **Trend mensile per setup** — performance rolling nel tempo | P2 | Alto | Media | |

---

### Roadmap Ordinata

#### Fase 0 — Fix Immediati ✅ COMPLETATO 2026-06-02
1. **A1** ✅ — Route `/patterns` e voce sidebar **ripristinate** (pagina esiste ed è completa; endpoint backend `/statistics/clusters` attivo — errore di valutazione iniziale basato su report impreciso dell'Explore agent)
2. **A2** ✅ — `autoAssignSession` rimossa da client.ts; helper privato `sessionFromTime` in TradeLogPage.tsx; submit già mandava `session: undefined` quando auto (backend fa assign)
3. **C1 → C1b** ✅ — `ProbabilityWidget` sostituito con `StreakAwarenessWidget`: mostra WR storico, ultimi 10 trade, streak corrente, messaggio psicologico contestuale. Nessuna "previsione"

#### Fase 1 — Valore Immediato ✅ COMPLETATO 2026-06-02
4. **B1** ✅ — Auto-calcolo live nel form: `computedTPR()`, `computedPnL()`, `computedRMultiple()` — panel live sotto i prezzi mostra Rischio / Target TP (R) / P&L / R effettivo man mano che si compilano i campi
5. **D1** ✅ — RestoreButton: wording migliorato nel dialog di conferma — spiega cosa selezionare (.zip da "Scarica backup") e cosa accade ai dati correnti
6. **D2** ✅ — `BackupInfoPanel` in sidebar: mostra cartella backup, conteggio, ultimo backup, suggerimento OneDrive. Backend: nuovo endpoint `GET /api/backup/info`

#### Fase 2 — Robustezza ✅ COMPLETATO 2026-06-02
7. **B2** ✅ — Clone trade: `openCloneForm(t)` pre-compila il form con setup/modello/confluenze/size del trade sorgente; data e ora = oggi; esito/exit/note/screenshot azzerati. Pulsante ⎘ in ogni riga della tabella
8. **B3** ✅ — Filtri persistenti: tutti e 6 i filtri del Trade Log salvati in localStorage (tlf_*); reset pulisce anche il localStorage
9. **C5** ✅ — `MistakeWidget` in Dashboard: top 5 errori più frequenti con barra e loss rate; posizionato come terza colonna nella griglia Giorno/Setup. Solo se ci sono dati
10. **D3** ✅ — Già implementato in `database.py` (mantieni ultimi 30 backup, rimuove i più vecchi ad ogni avvio)

#### Fase 3 — Pre-Cloud Security (quando si avvicina il deploy)
11. **D4** — CORS → `["http://localhost:5173"]`
12. **D5** — Validazione backend upload (whitelist + size limit)
13. **E1** — Authentication layer

#### Fase 4 — Analytics Avanzate ✅ PARZIALE 2026-06-02
14. **C2** ✅ — Trend mensile per setup: `GET /statistics/monthly-trend` · `MonthlyTrendSection` in StatisticsPage. Grafico line chart (win rate % per mese per setup) + tabella con WR%, P&L, n trade per cella. Appare solo con 2+ mesi di dati
15. **C3** ✅ — Drawdown avanzato in EquityCurveSection: Max Drawdown ($), Recovery Factor (P&L÷MaxDD, colorato), Drawdown corrente (appare solo se in DD). Recovery Factor ≥2 = verde, ≥1 = giallo, <1 = rosso
16. **C4** — MAE/MFE — rimosso dalla roadmap (richiede input manuale su ogni trade, non vale il costo ora)

#### Completato extra — Pattern Discovery v2 (2026-06-02)
- Pagina riscrtta con 4 tab: Impatto Fattori / Pattern Cross-Setup / Sinergie Confluenze / Cluster Esatti
- Backend: 3 nuovi endpoint `/statistics/factor-impact`, `/statistics/cross-model-patterns`, `/statistics/confluence-synergy`
- Layer 1 (Factor Impact): marginal impact per confluenza/sessione/DOL/bias — risponde "quale fattore cambia l'expectancy?"
- Layer 2 (Cross-Model): cluster senza model_id — trova edge di mercato indipendente dal setup
- Layer 3 (Confluence Synergy): co-occurrence analysis — trova coppie sinergiche
- Cluster Esatti spostati come ultima tab (utili quando dati crescono)

#### Fase 5 — Weekly Review ✅ COMPLETATO 2026-06-02
- Nuova pagina `/weekly` con 8 sezioni: Summary · Best/Worst Conditions · Top/Worst Trades · Error Review · Insights · Action Items
- Backend: `GET /api/weekly-review?week_start=YYYY-MM-DD` · `POST /api/weekly-review/notes`
- DB: tabella `weekly_notes` (action items persistenti per settimana)
- Navigazione settimane ← →, default = settimana corrente
- Insights rule-based (6 regole: WR vs storico, R:R inversion, errori ripetuti, best session, rating, consistenza, DOL edge)
- Sidebar: voce "Weekly Review" con icona ◗ tra Trade Log e Playbook

#### Non fare (rimossi dalla roadmap)
- Export CSV — non serve all'utente attuale
- Import broker — troppo complesso, basso ROI ora
- Multi-utente — fuori scope

---

## 4. Regole di sviluppo (immutabili)

- NON eliminare tabelle/colonne esistenti
- NON modificare strutture già implementate
- NON rimuovere funzionalità presenti
- SOLO aggiunte e migrazioni additive
- Backup automatico ad ogni avvio garantisce la sicurezza dei dati reali
- Ogni migrazione DB è gestita in `init_db()` con check `_col_exists()` per sicurezza
