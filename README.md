# AutoMísto

Jednostránková česká ukázka katalogu ojetých aut pro skupinový projekt REWB. Web používá vlastní logo a fotografie z Pexels.

Responzivní mřížka, karty, rozbalovací nabídka a ovládací prvky vycházejí z Bootstrapu 5.3.8. Vzhled upravuje vlastní styl AutoMísta.

## Spuštění přes XAMPP

Přepněte repozitář na větev `groupWork`. Projekt používá PHP 8.2 nebo novější s rozšířením mbstring. Závislosti nainstalujte příkazem `composer install` v kořeni repozitáře.

V XAMPP má cesta `htdocs/rewb` mířit přímo na složku `www` tohoto projektu. Pokud ji nastavujete na jiném počítači, můžete jako `htdocs/rewb` vytvořit propojení na tuto složku příkazem `mklink /J` v Příkazovém řádku. Apache potřebuje zapnutý modul `mod_rewrite` a povolený soubor `.htaccess`.

V XAMPP spusťte Apache a otevřete [localhost/rewb/](http://localhost/rewb/).

## Další možnosti spuštění

Příkaz `composer serve` spustí vývojový server na [127.0.0.1:8001](http://127.0.0.1:8001/). Pro statickou verzi spusťte `composer export` a otevřete `dist/automisto/index.html`.

## Obsah

- Auta lze hledat podle značky, modelu a pohonu, filtrovat podle karoserie a seřadit podle ceny nebo nájezdu.
- Odkazy na sekce zůstávají na homepage. Odkazy na další stránky jsou HTML prvky `<a href="#">` a po kliknutí stránku nikam neposunou.
- Ukázkové nabídky se upravují v `data/cars.php`. Fotografie, písmo a ikony se načítají místně. Zdroje a licence jsou v `www/assets/LICENSES.txt`.
