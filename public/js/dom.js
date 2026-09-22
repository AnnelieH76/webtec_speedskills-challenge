

/**
 * Log current window and box metrics to the console.
 *
 * @param {HTMLElement} box The element to inspect.
 */
function logDimensions(box) {
  const style = window.getComputedStyle(box)

  console.log('Fönsterstorlek:', window.innerWidth, window.innerHeight)
  console.log('Lådans storlek:', parseInt(style.width, 10), parseInt(style.height, 10))
  console.log('Position (left, top):', style.left, style.top)
}

// Select the element and call the function outside its definition
const box = document.getElementById('box')
logDimensions(box)



/**
 * Center the box element within the browser window.
 */
export function centerBox() {
  const box = document.getElementById('box')
  if (!box) return

  // 1. Read dimensions
  const style = window.getComputedStyle(box)
  const boxWidth = parseInt(style.width, 10)
  const boxHeight = parseInt(style.height, 10)

  // 2. Calculate centered coordinates
  const leftPosition = (window.innerWidth - boxWidth) / 2
  const topPosition = (window.innerHeight - boxHeight) / 2

  // 3. Move the box
  box.style.left = leftPosition + 'px'
  box.style.top = topPosition + 'px'

  // 4. Log the result 
  logDimensions(box)
}

centerBox()
