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
            <strong>Ripristina se vuoi</strong>
            <p>Usa i bottoni <strong>↺ Pasto</strong> o <strong>↺ Tutto</strong> nell'header per tornare ai valori di default, oppure il tasto <em>Reset</em> su un singolo gruppo.</p>
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
    background: rgba(0,0,0,.45);
    z-index: 200;
    display: flex;
    align-items: flex-end;
  }

  .sheet {
    background: #fff;
    width: 100%;
    max-height: 85vh;
    border-radius: 20px 20px 0 0;
    overflow-y: auto;
    padding: 0 0 32px;
    animation: slideUp .25s ease;
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
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
  }

  .sheet-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
  }

  .btn-close {
    background: #f0f0f0;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 13px;
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .btn-close:active { background: #ddd; }

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
    width: 26px;
    height: 26px;
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
