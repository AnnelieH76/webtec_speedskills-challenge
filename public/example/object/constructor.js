// Övningsexempel på funktions constructor som skapar objekt, komom06
// Kör i terminalen med kommando: node public/object/constructor.js

function Animal(color, age, sound) {
  this.color = color
  this.age = age
  this.sound = sound
  this.print = function() {
    console.log(`I am ${this.color} and ${this.age} years old.
I sound like this: ${this.sound}`)
  }
}

let cow = new Animal('red', 500, 'Mooo')
cow.print()
