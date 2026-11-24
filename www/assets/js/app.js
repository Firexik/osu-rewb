const menu = document.querySelector('#header-menu');
const menuToggle = menu.querySelector('summary');

function preventPlaceholderNavigation(event) {
    if (event.target.closest('a[aria-disabled="true"]')) {
        event.preventDefault();
    }
}

document.addEventListener('click', preventPlaceholderNavigation);
document.addEventListener('auxclick', preventPlaceholderNavigation);

document.addEventListener('click', (event) => {
    if (menu.open && !event.defaultPrevented && (!menu.contains(event.target) || event.target.closest('nav a'))) {
        menu.open = false;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menuToggle.focus();
    }
});

const form = document.querySelector('#project-search');
const input = document.querySelector('#project-query');
const projects = document.querySelector('#projekty');
const projectsTitle = document.querySelector('#projects-title');
const feedback = document.querySelector('#search-feedback');
const summary = document.querySelector('#search-summary');
const reset = document.querySelector('#search-reset');

function normalize(text) {
    return text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('cs').trim();
}

const searchIndex = Array.from(projects.querySelectorAll('.project-card'), (card) => ({
    card,
    text: normalize(card.textContent),
}));

function filterProjects(query) {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    let count = 0;

    for (const { card, text } of searchIndex) {
        const matches = words.every((word) => text.includes(word));
        card.hidden = !matches;
        count += Number(matches);
    }

    feedback.hidden = words.length === 0;
    summary.textContent = count === 0
        ? 'Žádný projekt neodpovídá hledání. Zkuste jiné město nebo název.'
        : 'Nalezené projekty (' + count + ')';
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    filterProjects(input.value);
    projectsTitle.focus({ preventScroll: true });
    projects.scrollIntoView();
});

reset.addEventListener('click', () => {
    input.value = '';
    filterProjects('');
    projectsTitle.focus({ preventScroll: true });
});
