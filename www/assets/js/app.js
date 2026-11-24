function preventPlaceholderNavigation(event) {
    if (event.target.closest('a[aria-disabled="true"]')) {
        event.preventDefault();
    }
}

document.addEventListener('click', preventPlaceholderNavigation);
document.addEventListener('auxclick', preventPlaceholderNavigation);

const form = document.querySelector('#car-search');
const input = document.querySelector('#car-query');
const catalog = document.querySelector('#auta');
const catalogTitle = document.querySelector('#catalog-title');
const grid = document.querySelector('#car-grid');
const count = document.querySelector('#catalog-count');
const empty = document.querySelector('#catalog-empty');
const reset = document.querySelector('#catalog-reset');
const sort = document.querySelector('#catalog-sort');
const filters = Array.from(catalog.querySelectorAll('[data-body-filter]'));

let activeBody = '';
let appliedQuery = '';

function normalize(text) {
    return text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('cs').trim();
}

const cars = Array.from(grid.querySelectorAll('.car-card'), (card, index) => ({
    card,
    index,
    body: card.dataset.body,
    price: Number(card.dataset.price),
    mileage: Number(card.dataset.mileage),
    text: normalize(card.textContent),
}));

function filterCars() {
    const words = normalize(appliedQuery).split(/\s+/).filter(Boolean);
    let visible = 0;

    for (const { card, body, text } of cars) {
        const matchesBody = !activeBody || activeBody === body;
        const matchesQuery = words.every((word) => text.includes(word));
        card.hidden = !(matchesBody && matchesQuery);
        visible += Number(!card.hidden);
    }

    for (const filter of filters) {
        filter.setAttribute('aria-pressed', String(filter.dataset.bodyFilter === activeBody));
    }

    count.textContent = 'Zobrazeno ' + visible + ' z ' + cars.length + ' vozů';
    empty.hidden = visible !== 0;
    reset.hidden = !activeBody && words.length === 0;
}

const sortFields = { default: 'index', price: 'price', mileage: 'mileage' };

sort.addEventListener('change', () => {
    const field = sortFields[sort.value];
    const sorted = [...cars].sort((first, second) => first[field] - second[field] || first.index - second.index);
    grid.append(...sorted.map(({ card }) => card));
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    appliedQuery = input.value;
    filterCars();
    catalogTitle.focus({ preventScroll: true });
    catalog.scrollIntoView();
});

for (const filter of filters) {
    filter.addEventListener('click', () => {
        activeBody = filter.dataset.bodyFilter;
        filterCars();
    });
}

for (const link of document.querySelectorAll('[data-category], [data-fuel]')) {
    link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }

        activeBody = link.dataset.category || '';
        appliedQuery = link.dataset.fuel || '';
        input.value = appliedQuery;
        filterCars();
    });
}

reset.addEventListener('click', () => {
    activeBody = '';
    appliedQuery = '';
    input.value = '';
    filterCars();
    filters[0].focus({ preventScroll: true });
});
