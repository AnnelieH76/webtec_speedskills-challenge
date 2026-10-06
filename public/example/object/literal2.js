// Detta är en övning inför komom06
// Kör i terminalen med kommando: node public/object/literal2.js

//--------------------------------------------------------------------------

// Exempel 1, skapa ett objekt med objekt-literalen {}
let myObject1 = {
  height: 0,
  width: 0
}

console.log(myObject1.height) // 0
console.log(myObject1.width)  // 0

//--------------------------------------------------------------------------

// Exempel 2. Ett objekt kan även innehålla andra objekt.
let myObject2 = {
  size: {
    h: 5,
    w: 8
  },
  background: ""
}

console.log(myObject2.size.h) // 5
console.log(myObject2.size.w) // 8

//-----------------------------------------------------------------------

//Exempel 3. Vi kan även ha funktioner som egenskaper i objekten. De kallas då för metoder:
let myObject3 = {
  size: {
    h: 10,
    w: 20
  },
  background: "green",
  draw: function () {
    console.log("I am a method!")
  }
}
console.log(myObject3.size.h) // 10
console.log(myObject3.size.w) // 20
myObject3.draw() // I am a method!

//------------------------------------------------------------------

//Exempel 4. Nå objektets egenskaper inifrån objektet med nyckelordet this. 
// Rita ut objektet i metoden draw()
let myObject4 = {
  size: {
    h: 200,
    w: 200
  },
  background: "green",
  draw: function() {
    let element = document.getElementById("content")
    let obj = document.createElement("div")
    obj.style.height = this.size.h + "px"
    obj.style.width = this.size.w + "px"
    obj.style.backgroundColor = this.background

    element.appendChild(obj)
  }
}

myObject4.draw()

// Se resultatet av Literal2 Exempel 4 (enklast): 
// Högerklicka på literal2.html i filträdet
// välj Open with Live Server
