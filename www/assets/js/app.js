'use strict';

// Bootstrap handles the navigation, tabs, carousel and modal itself.
const details = document.getElementById('gameDetails');
details?.addEventListener('show.bs.modal', (event) => {
    const game = event.relatedTarget.dataset;
    document.getElementById('gameDetailsLabel').textContent = game.gameTitle;
    document.getElementById('gameDescription').textContent = game.gameDescription;
    document.getElementById('gameDeveloper').textContent = game.gameDeveloper;
    document.getElementById('gameRelease').textContent = game.gameRelease;
    document.getElementById('gameStore').href = game.gameUrl;
});

const carousel = document.getElementById('featuredGames');
if (carousel) {
    const slider = bootstrap.Carousel.getOrCreateInstance(carousel);
    const pause = document.getElementById('carouselPause');
    function setPaused(paused) {
        paused ? slider.pause() : slider.cycle();
        pause.textContent = paused ? 'Play' : 'Pause';
        pause.setAttribute('aria-pressed', String(paused));
    }
    pause.addEventListener('click', () => setPaused(pause.getAttribute('aria-pressed') !== 'true'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
}

// GitHub Pages cannot run PHP. The exported form saves locally instead.
const planner = document.getElementById('plannerForm');
if (planner && document.body.dataset.staticPreview === 'true') {
    const status = document.getElementById('plannerStatus');
    const summary = document.getElementById('planSummary');
    const storageKey = 'playlog.plan.v1';
    const fields = ['planName', 'game', 'nickname', 'platform', 'startDate', 'sessions', 'minutes', 'pace', 'goal', 'notes'];
    function showPlan(plan) {
        summary.replaceChildren();
        const title = document.createElement('h3');
        title.className = 'h6 mt-2';
        title.textContent = plan.planName;
        summary.append(title);
        const game = planner.elements.game.selectedOptions[0].textContent;
        const mode = plan.mode === 'friends' ? 'With friends' : 'Solo';
        for (const text of [game, `${plan.startDate} · ${plan.platform}`, `${plan.sessions} × ${plan.minutes} min / week`, `${mode} · ${plan.pace}`, plan.goal, plan.notes]) {
            if (!text) continue;
            const paragraph = document.createElement('p');
            paragraph.className = 'small mb-2';
            paragraph.textContent = text;
            summary.append(paragraph);
        }
    }
    try {
        const plan = JSON.parse(localStorage.getItem(storageKey));
        if (plan && typeof plan === 'object' && fields.every(name => typeof plan[name] === 'string')) {
            for (const name of fields) planner.elements[name].value = plan[name];
            if (['solo', 'friends'].includes(plan.mode)) planner.elements.mode.value = plan.mode;
            planner.elements.breaks.checked = plan.breaks === true;
            planner.elements.confirm.checked = plan.confirm === true;
            if (planner.elements.game.value) showPlan(plan);
        }
    } catch {
        status.textContent = 'Browser storage is unavailable. You can still fill in the plan, but it may not survive a reload.';
    }
    planner.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!planner.reportValidity()) return;
        const plan = Object.fromEntries(fields.map(name => [name, planner.elements[name].value]));
        plan.mode = planner.elements.mode.value;
        plan.breaks = planner.elements.breaks.checked;
        plan.confirm = planner.elements.confirm.checked;
        try {
            localStorage.setItem(storageKey, JSON.stringify(plan));
            showPlan(plan);
            status.className = 'alert alert-success mt-3';
            status.textContent = 'Your plan has been saved in this browser.';
        } catch {
            status.className = 'alert alert-warning mt-3';
            status.textContent = 'Your browser could not save the plan. Allow local storage and try again.';
        }
    });
}
