
// ------------------------------------------------------------------------------------
// FUNKTIONSDEFINITIONER
// ------------------------------------------------------------------------------------

/**
 * Log current window and box metrics to the console.
 *
 * @param {HTMLElement} box The box element to inspect.
 */
function logDimensions (box) {
  const style = window.getComputedStyle(box)

  console.clear()

  console.log('Fönsterstorlek:', window.innerWidth, window.innerHeight)
  console.log('Lådans storlek:', parseInt(style.width, 10), parseInt(style.height, 10))
  console.log('Position (left, top):', style.left, style.top)
}

/**
 * Center the box element within the browser window.
 */
export function centerBox () {
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

  logDimensions(box)
}

/**
 * Toggle (on, off) the 'selected' CSS class on the clicked element.
 *
 * @param {MouseEvent} event The click event object.
 */
export function toggleSelected (event) {
  event.target.classList.toggle('selected')
}

/**
 * Handle double-click event: shrink the element and remove it after 2 seconds.
 *
 * @param {MouseEvent} event The double-click event object.
 */
export function doubleClick (event) {
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
