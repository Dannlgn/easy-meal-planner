<script lang="ts">
  export let open = false;
  function close() { open = false; }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="overlay" on:click={close}>
    <div class="sheet" on:click|stopPropagation>
      <div class="sheet-header">
        <span class="sheet-title">Come funziona</span>
        <button class="btn-close" on:click={close} aria-label="Chiudi">✕</button>
      </div>

      <div class="steps">
        <div class="step">
          <span class="step-num">1</span>
          <div>
            <strong>Configura i tuoi pasti</strong>
            <p>Vai nelle tab <em>Colazione, Spuntino, Pranzo, Cena</em> e imposta gli alimenti che mangi normalmente. Per ogni gruppo scegli l'alimento principale toccando il cerchietto a sinistra, e inserisci la grammatura. Metti <strong>0g</strong> per escludere un alimento dal piano.</p>
          </div>
        </div>

        <div class="step">
          <span class="step-num">2</span>
          <div>
            <strong>Salva il piano base</strong>
            <p>Vai nella tab <em>Base</em>: vedrai il riepilogo di tutti i pasti con calorie e macronutrienti. Quando sei soddisfatto, premi <strong>Salva come Piano Base</strong>. Questo è il tuo piano di riferimento.</p>
          </div>
        </div>

        <div class="step">
          <span class="step-num">3</span>
          <div>
            <strong>Sostituisci un alimento</strong>
            <p>Torna su una tab pasto e seleziona un alimento diverso dal solito. Tutti gli altri alimenti del gruppo si ricalcolano automaticamente per mantenere calorie e macronutrienti simili al tuo main (<em>Smart Swap</em>).</p>
          </div>
        </div>

        <div class="step">
          <span class="step-num">4</span>
          <div>
            <strong>Controlla le variazioni</strong>
            <p>Vai nella tab <em>Oggi</em> per vedere il piano modificato a confronto con il tuo piano base. Trovi i delta di calorie, carboidrati, proteine e grassi per ogni pasto e in totale giornaliero.</p>
          </div>
        </div>

        <div class="step">
          <span class="step-num">5</span>
          <div>
            <strong>Naviga tra i pasti</strong>
            <p>Scorri orizzontalmente tra <em>Colazione, Spuntino, Pranzo e Cena</em> — puoi anche toccare le tab in alto o i pallini in basso. I puntini mostrano sempre in quale pasto ti trovi.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,41,66,.50);
    z-index: 200;
    display: flex;
    align-items: flex-end;
  }

  .sheet {
    background: var(--card);
    width: 100%;
    max-height: 85vh;
    border-radius: var(--r-lg) var(--r-lg) 0 0;
    overflow-y: auto;
    padding: 0 0 32px;
    animation: slideUp .25s ease;
    box-shadow: var(--sh-lg);
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: var(--card);
    z-index: 1;
  }

  .sheet-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
  }

  .btn-close {
    background: var(--bg);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 13px;
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background .15s;
  }
  .btn-close:active { background: var(--border); }

  .steps {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .step {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .step-num {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .step div { flex: 1; }

  .step strong {
    display: block;
    font-size: 14px;
    color: var(--text);
    margin-bottom: 4px;
  }

  .step p {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    margin: 0;
  }

  .step em {
    color: var(--accent);
    font-style: normal;
    font-weight: 600;
  }
</style>
