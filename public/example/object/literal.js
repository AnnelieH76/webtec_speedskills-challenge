
// Övningsexempel på object literal i JavaSctipt, komom06
// Kör i terminalen med kommando: node public/object/literal.js

let animal = {
  "sound": "",
  "color": "",
  "age": 0,
  "print": function () {
    console.log(`I am ${this.color} and ${this.age} years old.
I sound like this: ${this.sound}`)
  },
  "init": function(newsound, newage, newcolor) {
    this.sound = newsound
    this.age = newage
    this.color = newcolor
  }
}

let cow = Object.create(animal)
cow.init('moo', 100, 'red')
let horse = Object.create(animal)
horse.init('gnäägg', 10, 'yellow')

cow.print()
horse.print()
