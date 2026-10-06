document.body.innerHTML = "<h1>Please wait...</h1>" // Ett meddelande som visas under tiden
let temp = await fetch(`https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom06/backgrounds/1.jpg`) // Hämta bilddatan
let blob = await temp.blob() // Skapa en blob
let backgroundImage = URL.createObjectURL(blob) // Hämta en användbar URL från blob

document.body.style.backgroundImage = `url(${backgroundImage})` // Sätt bilden som bakgrund
document.body.classList.add("background") // Lägg till css klassen

document.body.innerHTML = "" // Ta bort den temporära datan när bilden är klar

// Se resultatet av fech-image (enklast): 
// Högerklicka på fech-image.html i filträdet
// välj Open with Live Server
