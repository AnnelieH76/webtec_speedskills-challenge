// Array of available colors for random generation
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']


// ------------------------------------------------------------------------------------
// FUNKTIONSDEFINITIONER
// ------------------------------------------------------------------------------------

/**
 * 2.1. Center the box element within the browser window.
 */
export function centerBox() {
  const box = document.getElementById('box')
  if (!box) return

  // Read dimensions
  const style = window.getComputedStyle(box)
  const boxWidth = parseInt(style.width, 10)
  const boxHeight = parseInt(style.height, 10)

  // Calculate centered coordinates
  const leftPosition = (window.innerWidth - boxWidth) / 2
  const topPosition = (window.innerHeight - boxHeight) / 2

  // Move the box
  box.style.left = leftPosition + 'px'
  box.style.top = topPosition + 'px'
}

/**
 * 2.2 Toggle (on, off) the 'selected' CSS class on the clicked element.
 *
 * @param {MouseEvent} event The click event object.
 */
export function toggleSelected(event) {
  event.target.classList.toggle('selected')
}

/**
 * 2.3 Handle double-click event: shrink the element and remove it after 2 seconds.
 *
 * @param {MouseEvent} event The double-click event object.
 */
export function doubleClick(event) {
  const element = event.target

  // Add the animation class
  element.classList.add('animateSize')

  // Shrink element dimensions to 2px
  element.style.width = '2px'
  element.style.height = '2px'

  // Remove element from DOM after 2 seconds (2000 ms)
  setTimeout(() => {
    element.remove()
  }, 2000)
}

/**
 * 5. Animate element appearance and position 5 times over 1 second.
 *
 * @param {HTMLElement} element The element to animate.
 */
export function animateTimer (element) {
  let count = 0
  const headerHeight = (document.querySelector('.siteheader')?.offsetHeight || 100) + 10

  const intervalId = setInterval(() => {
    // Randomize shape (toggle circle)
    element.classList.toggle('circle')

    // Remove any existing color class
    for (let i = 0; i < colors.length; i++) {
      element.classList.remove(colors[i])
    }

    // Assign a new random color from rainbow array
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    element.classList.add(randomColor)

    // Randomize position within viewport bounds
    const maxLeft = Math.max(0, window.innerWidth - element.offsetWidth)
    const maxTop = Math.max(headerHeight, window.innerHeight - element.offsetHeight)

    const randomLeft = Math.floor(Math.random() * maxLeft)
    const randomTop = Math.floor(Math.random() * (maxTop - headerHeight)) + headerHeight

    element.style.left = randomLeft + 'px'
    element.style.top = randomTop + 'px'

    // Increment count and stop timer after 5 executions
    count++
    if (count >= 5) {
      clearInterval(intervalId)
    }
  }, 200)
}

/**
 * Handle all keyboard events.
 *
 * @param {KeyboardEvent} event The keyboard event
 */
export function keyboardPress(event) {

  // 3.1 Toggle circle shape on selected elements with 'e'
  if (event.key === 'e') {

    const selectedElements = document.getElementsByClassName('selected')
    console.log('Antal markerade element hittade:', selectedElements.length)

    // Loop through all currently selected elements
    for (let i = 0; i < selectedElements.length; i++) {
      selectedElements[i].classList.toggle('circle')
    }
  }

  // 3.2 Change colors on selected elements with 'r'
  if (event.key === 'r') {
    const selectedElements = document.getElementsByClassName('selected')

    for (const item of selectedElements) {
      if (item.classList.contains('red')) {
        item.classList.remove('red')
        item.classList.add('orange')
      } else if (item.classList.contains('orange')) {
        item.classList.remove('orange')
        item.classList.add('yellow')
      } else if (item.classList.contains('yellow')) {
        item.classList.remove('yellow')
        item.classList.add('green')
      } else if (item.classList.contains('green')) {
        item.classList.remove('green')
        item.classList.add('blue')
      } else if (item.classList.contains('blue')) {
        item.classList.remove('blue')
        item.classList.add('indigo')
      } else if (item.classList.contains('indigo')) {
        item.classList.remove('indigo')
        item.classList.add('violet')
      } else if (item.classList.contains('violet')) {
        item.classList.remove('violet')
        item.classList.add('red')
      } else {
        // If the element has no color yet, assign the first color
        item.classList.add('red')
      }
    }
  }

  // 3.3 Key 'i' - Select all elements
  if (event.key === 'i') {
    // Retrieve all elements currently present in the document
    const allElements = document.querySelectorAll('.box')

    for (let i = 0; i < allElements.length; i++) {
      allElements[i].classList.add('selected')
    }
  }

  // 3.4 Key 'u' - Deselect all selected elements
  if (event.key === 'u') {
    // querySelectorAll creates a static NodeList snapshot so removing classes during iteration is safe
    const selectedElements = document.querySelectorAll('.selected')

    for (let i = 0; i < selectedElements.length; i++) {
      selectedElements[i].classList.remove('selected')
    }
  }

  // 3.5 Key 'y' - Remove all selected elements from the DOM
  if (event.key === 'y') {
    // Avoid index shifting issues when elements are removed
    const selectedElements = document.querySelectorAll('.box.selected')

    for (let i = 0; i < selectedElements.length; i++) {
      selectedElements[i].remove()
    }
  }

  // 3.6 Key 'p' - add a new random element
  if (event.key === 'p') {

    // Create a new div element
    const newBox = document.createElement('div')

    // Set the same base class as the initial box
    newBox.className = 'box'

    // Randomize shape (50% chance of circle)
    if (Math.random() > 0.5) {
      newBox.classList.add('circle')
    }

    // Randomize color from the colors array
    const randomIndex = Math.floor(Math.random() * colors.length)
    newBox.classList.add(colors[randomIndex])

    // Calculate boundaries accounting for the site header and + outliner 10px
    const headerHeight = (document.querySelector('.siteheader')?.offsetHeight || 100) +10
    const maxLeft = Math.max(0, window.innerWidth - 200)
    const maxTop = Math.max(headerHeight, window.innerHeight - 200)

    const randomLeft = Math.floor(Math.random() * maxLeft)
    // The random range so starts below the header
    const randomTop = Math.floor(Math.random() * (maxTop - headerHeight)) + headerHeight

    newBox.style.left = randomLeft + 'px'
    newBox.style.top = randomTop + 'px'

    // Attach interaction listeners to the duplicate
    newBox.addEventListener('click', toggleSelected)
    newBox.addEventListener('dblclick', doubleClick)

    // Append the element to the DOM
    document.body.appendChild(newBox)
  }

  // 3.9 Arrow keys - Move all selected elements within window bounds
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    // Prevent default browser viewport scrolling
    event.preventDefault()

    const selectedElements = document.querySelectorAll('.box.selected')
    const step = 10

    for (let i = 0; i < selectedElements.length; i++) {
      const element = selectedElements[i]

      // Read current positions (fallback to offset values if style is empty)
      let currentLeft = parseInt(element.style.left, 10) || element.offsetLeft
      let currentTop = parseInt(element.style.top, 10) || element.offsetTop

      // Calculate boundary limits
      const maxLeft = Math.max(0, window.innerWidth - element.offsetWidth)
      const maxTop = Math.max(0, window.innerHeight - element.offsetHeight)

      if (event.key === 'ArrowLeft') {
        currentLeft = Math.max(0, currentLeft - step)
      } else if (event.key === 'ArrowRight') {
        currentLeft = Math.min(maxLeft, currentLeft + step)
      } else if (event.key === 'ArrowUp') {
        // Stop (outliner 10px) before siteheader
        const headerHeight = (document.querySelector('.siteheader')?.offsetHeight || 100) +10
        currentTop = Math.max(headerHeight, currentTop - step)
      } else if (event.key === 'ArrowDown') {
        currentTop = Math.min(maxTop, currentTop + step)
      }

      // Apply updated coordinates
      element.style.left = currentLeft + 'px'
      element.style.top = currentTop + 'px'
    }
  }



  // 5. Key 'd' - Animate all selected elements with timer
  if (event.key === 'd') {
    const selectedElements = document.querySelectorAll('.box.selected')

    for (let i = 0; i < selectedElements.length; i++) {
      animateTimer(selectedElements[i])
    }
  }
}

// ------------------------------------------------------------------------------------
// INITIERING OCH EVENTHANTERING
// ------------------------------------------------------------------------------------

// 1 Center box on initial load
centerBox()

// 2.1 Keep box centered when window resizes
window.addEventListener('resize', centerBox)

// 2.2 & 2.3 Attach click and dblclick listeners to the initial box
const initialBox = document.getElementById('box')
if (initialBox) {
  initialBox.addEventListener('click', toggleSelected)
  initialBox.addEventListener('dblclick', doubleClick)
}

// 3 & 5. Keyboard events listener
window.addEventListener('keydown', keyboardPress)

