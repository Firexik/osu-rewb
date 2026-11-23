'use strict';

// Bootstrap handles the navigation, tabs, carousel and modal itself.
const details = document.getElementById('gameDetails');
details?.addEventListener('show.bs.modal', (event) => {
    const game = event.relatedTarget?.dataset;
    if (!game?.gameTitle) {
        event.preventDefault();
        return;
    }
    document.getElementById('gameDetailsLabel').textContent = game.gameTitle;
    document.getElementById('gameDescription').textContent = game.gameDescription;
    document.getElementById('gameDeveloper').textContent = game.gameDeveloper;
    document.getElementById('gameRelease').textContent = game.gameRelease;
    document.getElementById('gameStore').href = game.gameUrl;
});

const carousel = document.getElementById('featuredGames');
if (carousel) {
    // The pause button controls cycling, even after using the arrows or swiping.
    const slider = bootstrap.Carousel.getOrCreateInstance(carousel, { pause: false });
    const pause = document.getElementById('carouselPause');
    function setPaused(paused) {
        paused ? slider.pause() : slider.cycle();
        pause.textContent = paused ? 'Play' : 'Pause';
        pause.setAttribute('aria-pressed', String(paused));
    }
    pause.addEventListener('click', () => setPaused(pause.getAttribute('aria-pressed') !== 'true'));
    setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

const planner = document.getElementById('plannerForm');
if (planner) {
    const isStatic = document.body.dataset.staticPreview === 'true';
    const status = document.getElementById('plannerStatus');
    const summary = document.getElementById('planSummary');
    const controls = planner.elements;
    const storageKey = 'playlog.plan.v1';
    const fields = ['planName', 'game', 'nickname', 'platform', 'startDate', 'sessions', 'minutes', 'pace', 'goal', 'notes'];

    function checkNumber(input) {
        const wrongFormat = input.value && !/^-?[0-9]+$/.test(input.value);
        input.setCustomValidity(wrongFormat ? 'Enter a whole number using digits, for example 3.' : '');
    }

    function showStatus(message, type) {
        status.className = `alert alert-${type} mt-3 mb-0`;
        status.textContent = message;
    }

    function showPlan(plan) {
        summary.replaceChildren();
        const title = document.createElement('h3');
        title.className = 'h6 mt-2';
        title.textContent = plan.planName;
        summary.append(title);
        const game = controls.game.selectedOptions[0].textContent;
        const mode = plan.mode === 'friends' ? 'With friends' : 'Solo';
        for (const text of [game, `${plan.startDate} · ${plan.platform}`, `${plan.sessions} × ${plan.minutes} min / week`, `${mode} · ${plan.pace}`, plan.goal, plan.notes]) {
            if (!text) continue;
            const paragraph = document.createElement('p');
            paragraph.className = 'small mb-2';
            paragraph.textContent = text;
            summary.append(paragraph);
        }
    }
    planner.addEventListener('input', ({ target }) => {
        if (target.type === 'number') checkNumber(target);
        if (isStatic && status.classList.contains('alert-success')) {
            status.className = '';
            status.textContent = '';
        }
    });

    planner.addEventListener('submit', (event) => {
        if (isStatic) event.preventDefault();
        for (const input of planner.querySelectorAll('input[type="text"], textarea')) {
            input.value = input.value.trim();
        }
        for (const input of planner.querySelectorAll('input[type="number"]')) checkNumber(input);
        if (!planner.reportValidity()) {
            event.preventDefault();
            return;
        }
        if (!isStatic) return;

        const plan = Object.fromEntries(new FormData(planner));
        plan.breaks = controls.breaks.checked;
        plan.confirm = controls.confirm.checked;
        try {
            localStorage.setItem(storageKey, JSON.stringify(plan));
        } catch {
            showStatus('This browser could not save the plan. Your entries are still in the form.', 'warning');
            return;
        }
        showPlan(plan);
        showStatus('Your plan has been saved in this browser.', 'success');
    });

    // The online export saves one plan in the browser instead of using PHP.
    if (isStatic) {
        controls.save.disabled = false;
        try {
            const plan = JSON.parse(localStorage.getItem(storageKey));
            if (plan && fields.every(name => typeof plan[name] === 'string') &&
                ['solo', 'friends'].includes(plan.mode) && typeof plan.breaks === 'boolean' && plan.confirm === true) {
                for (const name of fields) {
                    const input = controls[name];
                    input.value = plan[name].trim();
                    // Older saved plans may have whole numbers such as 3.0.
                    if (input.type === 'number' && Number.isInteger(input.valueAsNumber)) {
                        input.value = String(input.valueAsNumber);
                    }
                    plan[name] = input.value;
                }
                controls.mode.value = plan.mode;
                controls.breaks.checked = plan.breaks;
                controls.confirm.checked = true;
                const textFits = fields.every(name => !(controls[name].maxLength >= 0 && plan[name].length > controls[name].maxLength));
                if (textFits && planner.checkValidity()) {
                    showPlan(plan);
                } else {
                    planner.reset();
                }
            }
        } catch (error) {
            if (!(error instanceof SyntaxError)) {
                showStatus('Browser storage is unavailable. You can still fill in the form.', 'warning');
            }
        }
    }
}
