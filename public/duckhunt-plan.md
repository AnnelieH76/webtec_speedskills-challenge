# Uppgiftsplan: Duckhunt

## 1. Mapp- och filstruktur
- `public/duckhunt.html`
- `public/css/duckhunt.css`
- `public/js/duckhunt.js`

---


## 2. Krav

### Setup (Innan spelet startar)
Använd input element för att välja vilken bakgrundsbild man vill ha samt ha möjlighet att slumpa fram en. Det finns 5 bilder (1-5) så 0 kan användas för att slumpa.

Använd input element för att välja hur länge spelet håller på: 10, 20 eller 30 sekunder.

Använd input element för att välja i vilken hastighet ankan ska förflytta sig: 1, 2 eller 3 sekunders intervall.

Se till att spärra möjligheterna att välja något annat.

Visa att datan laddas medan bilderna hämtas. Här kan du välja själv hur du vill att det ska se ut.

Utfrån valen man gör ska det skapas ett globalt objekt som håller informationen spelet behöver för att starta och fungera. Sätt alla värden via funktionen setupGame().

Använd fetch för att hämta ankan och den valda bakgrundsbilden.

Ankan: https://github.com/bth-webtec/teacher/blob/main/kmom06/duck/duck.png
(Den bilden kommer från rawpixel.com)

Bakgrundsbilderna: https://github.com/bth-webtec/teacher/tree/main/kmom06/backgrounds

För att använda länkarna med fetch behöver vi “raw” content från GitHub. Du kan se URL:en här. Bara byt siffran i slutet. Detsamma gäller för ankan.

### Spelet
Starta spelet via en knapp och funktionen startGame().

Placera rimlig logik i ditt objekt. Fundera på vad som passar där och vad som passar ligga utanför.

Ankans position ska slumpas fram med det valda intervallet. Hela ankan ska alltid vara innanför skärmens fönster.

Om man klickar på ankan får man 1 poäng.

När tiden är slut presenteras poängen via funktionen endGame() och spelet är över. Man ska få möjlighet att starta ett nytt spel.

### Extra uppgifter (optionellt)
Se till så man kan välja svårighetsgrad som påverkar till exempel:
ankans storlek?
Kan man få ankan att röra sig i olika riktningar och inte slumpas fram?
Snurra?
Ljud?


## 3. Pseudokod & Flöde

```text
// Globalt spelobjekt
GameObject {
  score: 0,
  duration: 10,       // 10, 20 eller 30 sek
  speed: 1000,        // 1000, 2000 eller 3000 ms
  backgroundId: 0,    // 0 = slumpa, 1-5 = specifik bild
  backgroundImageUrl: "",
  duckImageUrl: "",
  gameTimer: null,
  duckInterval: null
}

// 1. Setup-fasen
Function setupGame()
  Läs värden från input-element (bakgrund 0-5, tid 10-30s, hastighet 1-3s)
  Spara valen i GameObject
  Visa laddningsindikator ("Laddar...")
  Kör fetch på bakgrundsbild (slumpa 1-5 om 0 valts)
  Kör fetch på ankan
  Skapa ObjectURLs för bilderna
  Dölj laddningsindikator
  Aktivera startknapp

// 2. Starta spelet
Function startGame()
  Dölj inställningsformuläret
  Sätt bakgrundsbilden på spelplanen
  Nollställ score till 0 och uppdatera poängräknare i DOM
  Skapa ankelement (<img id="duck">) och lägg till i DOM
  Starta nedräkningstimer för hela spelets längd (duration)
  Starta intervall (speed) för moveDuck()

// 3. Spelloop & interaktion
Function moveDuck()
  Slumpa nya X och Y koordinater:
    X: mellan 0 och (fönsterbredd - ankans bredd)
    Y: mellan 0 och (fönsterhöjd - ankans höjd)
  Sätt anka.style.left och anka.style.top

Function onDuckClick()
  Öka GameObject.score med 1
  Uppdatera poäng i DOM
  Flytta ankan (moveDuck())

// 4. Avsluta spelet
Function endGame()
  Stoppa alla timers och intervaller (clearInterval/clearTimeout)
  Ta bort ankan från DOM
  Visa slutskärm med total poäng
  Visa knapp: "Spela igen" (återställer till setupGame eller startläge)
```

  ### Hur kan det bli när du är klar?
  https://www.youtube.com/watch?v=PmBuonQ1on4
