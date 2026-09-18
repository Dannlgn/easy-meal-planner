<script lang="ts">
  import { onMount } from 'svelte';
  import MealPanel from './MealPanel.svelte';
  import BasePlan from './BasePlan.svelte';
  import TodayPlan from './TodayPlan.svelte';
  import { activePage, quantities, mainItems, savedBase, calcMealTotals } from '../stores/state';
  import { MEALS } from '../data/meals';

  // Ordine slide: [Oggi(6), Col(1), Spu(2), Spu2(3), Pra(4), Cen(5), Base(0)]
  const LAST_IDX       = 6;
  const DIST_THRESHOLD = 0.05;
  const VEL_THRESHOLD  = 0.10;

  let outer:  HTMLElement;
  let slider: HTMLElement;
  let mounted   = false;
  let animLock  = false;

  let isDragging   = false;
  let isHorizontal = false;
  let touchX0 = 0, touchY0 = 0, touchT0 = 0;
  let dragDx = 0;

  function pageToIdx(page: number): number {
    if (page === 6) return 0;
    if (page >= 1 && page <= 5) return page;
    return 6;
  }

  function idxToPage(idx: number): number {
    if (idx === 0) return 6;
    if (idx === 6) return 0;
    return idx;
  }

  function slideW(): number {
    return outer?.clientWidth ?? window.innerWidth;
  }

  function animateTo(idx: number, animate: boolean) {
    if (!slider) return;
    slider.style.transition = animate ? 'transform 200ms ease-out' : 'none';
    slider.style.transform  = `translateX(${-idx * slideW()}px)`;
  }

  function navigateTo(idx: number) {
    animLock = true;
    animateTo(idx, true);
    const page = idxToPage(idx);
    if (page !== $activePage) activePage.set(page);
    setTimeout(() => { animLock = false; }, 250);
  }

  $: if (!animLock && mounted && slider) {
    animateTo(pageToIdx($activePage), true);
  }

  function isMealModified(mealIdx: number): boolean {
    const meal = MEALS[mealIdx];
    const base = $savedBase;
    const qtys  = $quantities;
    const mains = $mainItems;
    if (!base) {
      for (const g of meal.groups) {
        const dm = Math.max(0, g.items.findIndex(it => it.main));
        if ((mains[g.id] ?? dm) !== dm) return true;
        const cur = qtys[g.id];
        if (cur && cur.some((v, i) => v !== g.items[i].qty)) return true;
      }
      return false;
    }
    const todayTot = calcMealTotals(meal, qtys, mains);
    const baseTot  = calcMealTotals(meal, base.quantities, base.mains);
    return Math.abs(todayTot.kcal - baseTot.kcal) > 1;
  }

  // ── Touch handlers su document ───
  function onTouchStart(e: TouchEvent) {
    if ((e.target as Element)?.closest('header')) return;
    if ((e.target as Element)?.closest('.meal-subtabs')) return;
    if ((e.target as Element)?.closest('.bottom-nav')) return;
    const tag = (e.target as Element)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    touchX0 = e.touches[0].clientX;
    touchY0 = e.touches[0].clientY;
    touchT0 = Date.now();
    dragDx  = 0;
    isDragging   = true;
    isHorizontal = false;
    if (slider) slider.style.transition = 'none';
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging || !slider) return;
    const dx = e.touches[0].clientX - touchX0;
    const dy = e.touches[0].clientY - touchY0;

    if (!isHorizontal) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      if (Math.abs(dx) >= Math.abs(dy)) {
        isHorizontal = true;
      } else {
        isDragging = false;
        return;
      }
    }

    e.preventDefault();
    dragDx = dx;

    const idx     = pageToIdx($activePage);
    const w       = slideW();
    const elapsed = Math.max(1, Date.now() - touchT0);
    const dist    = Math.abs(dx) / w;
    const vel     = Math.abs(dx) / elapsed;

    if (dist >= DIST_THRESHOLD || vel >= VEL_THRESHOLD) {
      isDragging = false;
      const dir    = dx < 0 ? 1 : -1;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx > LAST_IDX) { animateTo(idx, true); return; }
      navigateTo(newIdx);
      return;
    }

    let effectiveDx = dx;
    if ((idx === 0 && dx > 0) || (idx === LAST_IDX && dx < 0)) {
      effectiveDx = dx * 0.30;
    }
    slider.style.transform = `translateX(${-idx * w + effectiveDx}px)`;
  }

  function onTouchEnd(e: TouchEvent) {
    if (!isDragging) return;
    isDragging = false;

    const totalDx = e.changedTouches[0].clientX - touchX0;
    const totalDy = e.changedTouches[0].clientY - touchY0;

    const horizontal = Math.abs(totalDx) > Math.abs(totalDy) && Math.abs(totalDx) >= 4;
    if (!horizontal) {
      if (dragDx !== 0) animateTo(pageToIdx($activePage), true);
      return;
    }

    const elapsed  = Math.max(1, Date.now() - touchT0);
    const velocity = Math.abs(totalDx) / elapsed;
    const dist     = Math.abs(totalDx) / slideW();
    const dir      = totalDx < 0 ? 1 : -1;
    const idx      = pageToIdx($activePage);

    if (dist >= DIST_THRESHOLD || velocity >= VEL_THRESHOLD) {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx > LAST_IDX) { animateTo(idx, true); return; }
      navigateTo(newIdx);
    } else {
      animateTo(idx, true);
    }
  }

  onMount(() => {
    animLock = true;
    mounted = true;
    requestAnimationFrame(() => {
      animateTo(pageToIdx($activePage), false);
      animLock = false;
    });

    const onResize = () => animateTo(pageToIdx($activePage), false);
    window.addEventListener('resize', onResize);

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove',  onTouchMove,  { passive: false });
    document.addEventListener('touchend',   onTouchEnd,   { passive: true });

    if (!localStorage.getItem('mp_swipe_hint') && $activePage >= 1 && $activePage <= 5) {
      setTimeout(() => {
        if (!slider) return;
        const idx = pageToIdx($activePage);
        slider.style.transition = 'transform 300ms ease-out';
        slider.style.transform  = `translateX(${-idx * slideW() - 90}px)`;
        setTimeout(() => {
          slider.style.transform = `translateX(${-idx * slideW()}px)`;
          localStorage.setItem('mp_swipe_hint', '1');
        }, 480);
      }, 900);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove',  onTouchMove);
      document.removeEventListener('touchend',   onTouchEnd);
    };
  });
</script>

<div class="carousel-wrap">

  <!-- Sub-tabs per i pasti — visibili solo quando activePage è 1-5 -->
  {#if $activePage >= 1 && $activePage <= 5}
    <div class="meal-subtabs" role="tablist" aria-label="Pasto attivo">
      {#each MEALS as meal, i}
        <button
          class:active={$activePage === i + 1}
          role="tab"
          aria-selected={$activePage === i + 1}
          on:click={() => navigateTo(i + 1)}
        >
          {meal.label}
          {#if isMealModified(i)}
            <span class="mod-dot" aria-label="modificato"></span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  <div class="carousel-outer" bind:this={outer}>
    <div class="carousel-slider" bind:this={slider}>

      <!-- Slide 0: Oggi -->
      <div class="carousel-slide">
        <div class="page-slide">
          <TodayPlan />
        </div>
      </div>

      <!-- Slide 1-5: pasti -->
      {#each MEALS as meal}
        <div class="carousel-slide">
          <div class="slide-inner">
            <MealPanel {meal} />
          </div>
        </div>
      {/each}

      <!-- Slide 6: Base -->
      <div class="carousel-slide">
        <div class="page-slide">
          <BasePlan />
        </div>
      </div>

    </div>
  </div>

</div>

<style>
  .carousel-wrap {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── Sub-tabs pasti ── */
  .meal-subtabs {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    background: var(--hdr);
    border-bottom: 1px solid rgba(255,255,255,.06);
    flex-shrink: 0;
    height: var(--subtabs-h);
    align-items: center;
    padding: 0 10px;
    gap: 6px;
  }
  .meal-subtabs::-webkit-scrollbar { display: none; }

  .meal-subtabs button {
    flex-shrink: 0;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,.42);
    cursor: pointer;
    border: none;
    background: rgba(255,255,255,.07);
    border-radius: 20px;
    white-space: nowrap;
    transition: color .15s, background .15s;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  .meal-subtabs button.active {
    color: #fff;
    font-weight: 700;
    background: var(--accent);
  }
  .meal-subtabs button:active { opacity: .8; }

  .mod-dot {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--mc);
    display: block;
    pointer-events: none;
  }

  .carousel-outer {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    width: 100%;
  }

  .carousel-slider {
    display: flex;
    height: 100%;
    will-change: transform;
  }

  .carousel-slide {
    flex: 0 0 100%;
    width: 100%;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: none;
  }

  /* bottom padding: StickyTotals (60px) + BottomNav (56px) + gap */
  .slide-inner {
    padding: 14px 16px 128px;
  }

  .page-slide {
    padding: 14px 14px 128px;
    max-width: 560px;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
