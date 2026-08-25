# webtec-anhj26

[![Check kmom](https://github.com/bth-webtec/webtec-anhj26/actions/workflows/check.yml/badge.svg)](https://github.com/bth-webtec/webtec-anhj26/actions/workflows/check.yml)

Nu är mitt kursrepo uppdaterat med utvecklingsmiljön så att jag kan komma igång med kmom01.

## Krav

* Node version 24 eller högre krävs.

## VS Code extensions

Repot innehåller rekommenderade VS Code-extensions i `.vscode/extensions.json`. VS Code frågar automatiskt om du vill installera dem när du öppnar repot, eller så hittar du dem under Extensions-fliken via "Show Recommended Extensions".

| Extension | Beskrivning |
|-----------|-------------|
| ESLint | Visar lint-fel direkt i editorn |
| EditorConfig | Läser in `.editorconfig` för konsekvent formatering |
| Live Server | Startar en lokal webbserver med auto-reload |
| Auto Rename Tag | Byter namn på öppnings- och stängningstagg samtidigt |
| HTML CSS Support | CSS-komplettering i HTML-filer |

## Kom igång

När du klonat repot behöver du installera de utvecklingsverktyg som kursen använder. Det gör du med:

```bash
npm install
```

Kommandot läser `package.json` och laddar ned alla verktyg som listas under `devDependencies` — bland annat eslint och webbservern. Verktygen sparas i katalogen `node_modules/` som skapas automatiskt. Du behöver bara köra `npm install` en gång per dator (eller igen om du kört `npm run clean`).

## Kommandon

Repot innehåller ett antal skript definierade i `package.json`. Du kör dem med `npm run <skript>`. Kör `npm run` utan argument för att se alla tillgängliga skript.

| Kommando | Beskrivning |
|----------|-------------|
| `npm install` | Installera utvecklingsverktygen (kör en gång efter kloning) |
| `npm run lint` | Kör lintverktyget på koden |
| `npm run lint:fix` | Kör lintverktyget och rätta de fel som går att rätta automatiskt |
| `npm run check kmom01` | Kontrollera att kmom01 är korrekt (även kmom02–kmom10) |
| `npm run server` | Starta en lokal webbserver |
| `npm run clean` | Ta bort node_modules |
