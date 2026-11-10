# Playlog – semestrální projekt REWB

Jednoduchý anglický web o hrách. Nette 3.2, Latte, Bootstrap 5.3.8,
jQuery a DataTables 2.1.8, tedy stejné komponenty jako ve cvičeních.
Bez databáze, účtů, Node sestavení nebo dalších aplikačních vrstev.

- [Veřejný web](https://firexik.github.io/osu-rewb/)
- [Wireframe ve Figmě](https://www.figma.com/design/aaaKaCVb3XdVRnkH6chlAk)
- Zadání: `docs/assignment.txt`; mobilní wireframe a jeho popis: `docs/`.

## Spuštění Nette

PHP 8.2+ s rozšířením mbstring a Composer. V kořeni projektu:

```text
composer install
composer serve
```

Otevři http://127.0.0.1:8001/. V XAMPP lze použít PHP z
`C:\Users\jakub\xampp\php\php.exe`; v něm otevřený Shell má PHP dostupné.
Pro Apache nastav kořen webu na složku `www` a povol `mod_rewrite`.
Existující odkaz `htdocs/rewb` míří do starého OneDrive umístění;
pro tuto pracovní kopii na Proton Drive použij uvedený místní server.

V přenosném ZIPu jsou knihovny `vendor` již přiložené. U kopie z GitHubu
je nejprve doinstaluje `composer install`.

## Co ukázat při prezentaci

| Požadavek | Kde jej najít |
| --- | --- |
| Název, šest funkčních položek menu, ikony a breadcrumb | Všechny stránky |
| Carousel se třemi obrázky, ovládáním a pauzou | Home |
| Podrobnosti v modálním okně | Home → Quick look |
| 60 skutečných her, hledání, řazení, stránkování | Games |
| Skutečný textový obsah a různé styly tlačítek | Reviews, About, Home |
| Vložené video v responzivním kontejneru `ratio-16x9` | Reviews → Portal 2 in motion |
| Tři přepínatelné záložky | Genres |
| 13 polí, text, radio, checkbox, select, textarea, Input Group, Save | Play Planner |
| Mobilní wireframe a popis | `docs/wireframe-mobile.png`, `docs/wireframe.txt` |
| Online adresa pro odevzdání | `project-url.txt` |

Zmenši okno na telefon: menu se sbalí, karty i formulář jsou pod sebou.
Tabulka se posouvá pouze ve svém kontejneru. Ve formuláři vyzkoušej
prázdné odeslání, potom vyplň plán a stiskni Save; plán zůstane po obnovení.

## Kód a publikování

- `PagePresenter.php`: předání dat šablonám a Nette formulář s validací.
- `app/Presentation/Page/*.latte`: šest stránek; sdílený vzhled v `@layout.latte`.
- `data/games.json`: 60 her a tři krátké herní poznámky, bez volání API za běhu.
- `www/assets`: místní knihovny, šest ikon, tři obrázky, malé CSS a JavaScript.

GitHub Pages spouští pouze statické soubory, nikoli PHP.
`composer export` proto přes skutečnou Nette aplikaci vygeneruje šest HTML
stránek do `dist`; vzhled a obsah pochází ze stejných Latte šablon.
Na Nette Save validuje server a ukládá plán do relace prohlížeče na sedm dní.
Na Pages Save používá validaci prohlížeče a `localStorage` na daném zařízení.
Toto rozlišení uvádí i text pod formulářem. Data se nikde nezveřejňují.

Workflow `.github/workflows/pages.yml` publikuje při pushi do větve `project`.
Na GitHubu je zdroj Pages nastavený na GitHub Actions; sestavuje větev `project`.
Zdrojový projekt je záměrně oddělený od cvičení samostatnou historií.

Odevzdání: `submission/REWB-Playlog.zip` obsahuje zdroje, knihovny, statickou
ukázku, wireframe a `project-url.txt`. Složky `temp` a `log` se vytvoří za běhu.
Zdrojové údaje, obrázky a licence jsou uvedeny na stránce About.

Ověřeno v prohlížeči pro Nette i export při šířkách 320, 390, 768 a 1440 px:
šest stránek, menu, obrázky, carousel, modal, záložky, DataTables a ukládání
plánu po obnovení stránky. Ověřena také serverová validace a ochrana formuláře.
Video na Reviews zachovává poměr 16:9 i na telefonu; breadcrumb na vnitřních
stránkách má podobu Home › název stránky a umožňuje návrat na Home.
