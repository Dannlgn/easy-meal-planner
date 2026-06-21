<script lang="ts">
  import { onMount } from 'svelte';

  let visible = false;

  onMount(() => {
    if (!localStorage.getItem('mp_onboarded')) {
      visible = true;
    }
  });

  function dismiss() {
    visible = false;
    localStorage.setItem('mp_onboarded', '1');
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="overlay" on:click={dismiss}>
    <div class="card" on:click|stopPropagation>
      <h3>Come funziona</h3>
      <ul>
        <li><span class="icon">◉</span> Tocca il <b>cerchio</b> di un alimento per impostarlo come principale — i totali si aggiornano</li>
        <li><span class="icon" style="text-decoration:underline;color:var(--accent)">Nome ▶</span> Tocca il <b>nome</b> per vedere kcal e macronutrienti</li>
        <li><span class="icon">✏</span> Modifica una <b>quantità</b> per scalare proporzionalmente tutto il gruppo</li>
        <li><span class="icon">👆</span> <b>Scorri</b> orizzontalmente tra i pasti — o usa le tab in alto</li>
      </ul>
      <button class="btn-ok" on:click={dismiss}>Capito!</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,41,66,.55);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadein .25s ease;
  }

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .card {
    background: var(--card);
    border-radius: var(--r-lg);
    padding: 24px 20px 20px;
    max-width: 340px;
    width: 100%;
    box-shadow: var(--sh-lg);
  }

  h3 {
    font-size: 17px;
    font-weight: 800;
    color: var(--hdr2);
    margin-bottom: 16px;
    text-align: center;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: var(--text);
    line-height: 1.45;
  }

  .icon {
    font-size: 16px;
    flex-shrink: 0;
    width: 22px;
    text-align: center;
    margin-top: 1px;
  }

  .btn-ok {
    width: 100%;
    padding: 13px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--r);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    min-height: 48px;
    transition: background .15s;
  }
  .btn-ok:active { background: var(--accent-dk); }
</style>
