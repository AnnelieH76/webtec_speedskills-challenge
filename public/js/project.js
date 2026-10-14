
// Target assets configuration
const water_target = 'img-project/target_vatten.jpeg'
const target_images = [
  'img-project/target_apex.jpeg',
  'img-project/target_flagga.jpeg',
  'img-project/target_mc.jpeg',
  water_target
]

// Current active target URL
let currentTargetSrc = ''

/**
 * Move target to a safe random position and select a new image
 */
function moveTarget() {
  // Select random target image
  const randomImgIndex = Math.floor(Math.random() * target_images.length)
  currentTargetSrc = target_images[randomImgIndex]
  targetElement.src = currentTargetSrc

  // Calculate dynamic boundaries
  const targetWidth = targetElement.offsetWidth || gameObject.targetSize
  const targetHeight = targetElement.offsetHeight || gameObject.targetSize

  const maxX = Math.max(0, gameArea.clientWidth - targetWidth)
  const maxY = Math.max(0, gameArea.clientHeight - targetHeight)

  const randomX = Math.floor(Math.random() * maxX)
  const randomY = Math.floor(Math.random() * maxY)

  targetElement.style.position = 'absolute'
  targetElement.style.left = `${randomX}px`
  targetElement.style.top = `${randomY}px`
}

/**
 * Handle clicks on the target with bonus points or water penalty
 */
function handleTargetHit() {
  // Check if player clicked the hazard (water puddle)
  if (currentTargetSrc === water_target) {
    // Penalty: subtract 2 points (prevent score from going below 0)
    gameObject.score = Math.max(0, gameObject.score - 2)
  } else {
    // Standard hit: add points defined in tier config
    gameObject.score += gameObject.pointsPerHit
  }

  // Update HUD
  scoreDisplay.textContent = gameObject.score

  // Immediately relocate target and reset cadence interval
  clearInterval(gameObject.moveInterval)
  moveTarget()
  gameObject.moveInterval = setInterval(moveTarget, gameObject.speed)
}
