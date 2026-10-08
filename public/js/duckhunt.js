
// Duckhunt Game Implementation

// ------------------------------------------------------------
// CONSTANTS & GAME STATE
// ------------------------------------------------------------

// GitHub raw URLs pointing directly to github files
const BACKGROUND_BASE_URL = 'https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/backgrounds/'
const DUCK_IMAGE_URL = 'https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/duck/duck.png'

// Global game object holding active values, timers, and blob references
const gameObject = {
  score: 0,
  duration: 10,
  speed: 2000,
  backgroundId: 0,
  bgBlobUrl: null,
  duckBlobUrl: null,
  gameTimer: null,
  duckInterval: null,
  timeLeft: 0
}
// -----------------------------------------------------
// DOM REFERENCES
// ----------------------------------------------------

// DOM references: configuration controls and overlays
const gameIntro = document.getElementById('game-intro')
const settingsCard = document.getElementById('settings-card') // Settings card container
const settingsForm = document.getElementById('game-settings-form') // input form
const loadingOverlay = document.getElementById('loading-overlay')  // Loading banner element
const startBtn = document.getElementById('start-btn') // submit button
const bgInput = document.getElementById('bg-select') // Background number 
const durationSelect = document.getElementById('game-duration') // Duration dropdown menu
const speedSelect = document.getElementById('duck-speed') // Speed dropdown menu

// DOM references: gameplay area, HUD, and modal
const gameArea = document.getElementById('game-area')
const duckElement = document.getElementById('duck')
const scoreDisplay = document.getElementById('score-display') // Info in Heads-Up Display (HUD)
const timeLeftDisplay = document.getElementById('time-left')  // Info in Heads-Up Display
const gameOverModal = document.getElementById('game-over-modal')
const finalScoreDisplay = document.getElementById('final-score') // Inside game-over-modal
const playAgainBtn = document.getElementById('play-again-btn')   // Inside game-over-modal

// ---------------------------------------------------
// UTILITY & HELPER FUNCTIONS
// -----------------------------------------------------

// Definition of funktion that pauses execution for specified milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch remote image data and convert response blob to an object URL
 * @param {string} url - Target asset endpoint
 * @returns {Promise<string>}
 */

//"async function" works with "await"
async function fetchImageAsBlobUrl(url) {
  // Send HTTP GET request to download image file over network
  const response = await fetch(url)
  // If respons code is not OK (200-299)
  if (!response.ok) {
    // Throw an error to halt execution
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
  }

  // awaits the blob (Binary Large Object)
  const blob = await response.blob()
  // Create a temporary local URL pointing to the blob in memory
  return URL.createObjectURL(blob)
}

// -------------------------------------------------------
// GAME INITIALIZATION & ASSET LOADING
// ------------------------------------------------------------

/**
 * Validate selections, initialize settings, and fetch images
 * @returns {Promise<boolean>} True if preload succeeded, false otherwise
 */

// The asyncronius Game setup function
async function setupGame() {
  // Parse selection values from string into an integer using base 10
  const chosenBg = parseInt(bgInput.value, 10)
  const chosenDuration = parseInt(durationSelect.value, 10)
  const chosenSpeed = parseInt(speedSelect.value, 10)

  // Pick random background ID (1-5) if input is 0, else keep selected ID
  gameObject.backgroundId = chosenBg === 0 ? Math.floor(Math.random() * 5) + 1 : chosenBg
  // Assign selected game duration in seconds to game state
  gameObject.duration = chosenDuration
  // Convert selected speed from seconds to milliseconds
  gameObject.speed = chosenSpeed * 1000

  // Reveal loading indicator to the user and prevent duplicate clicks
  loadingOverlay.classList.remove('hidden')
  // Disable submit button to prevent redundant network requests
  startBtn.disabled = true

  // Artificial 1-second delay to keep the loading message visible
  await delay(1000)

  try {
    // Construct full image URL for the chosen background file
    const bgUrl = `${BACKGROUND_BASE_URL}${gameObject.backgroundId}.jpg`

    // Download duck and background images concurrently and await their blob URLs
    const [duckBlob, bgBlob] = await Promise.all([
      fetchImageAsBlobUrl(DUCK_IMAGE_URL),
      fetchImageAsBlobUrl(bgUrl)
    ])

    // Save temporary blob URLs to global state
    gameObject.duckBlobUrl = duckBlob
    gameObject.bgBlobUrl = bgBlob
    return true

  } catch (error) {
    // Log network or parsing failure to developer console
    console.error('Failed to load assets via fetch:', error)
    // Alert user that loading game assets failed
    alert('Kunde inte ladda spelgrafiken från GitHub.')
    return false

  } finally {
    // Hide loading banner regardless of success or failure
    loadingOverlay.classList.add('hidden')
    // Re-enable submit button for new attempts
    startBtn.disabled = false
  }
}

// ------------------------------------------------------
// GAME ENGINE & LOOP
// -----------------------------------------------------

/**
 * Compute random coordinates within board bounds and move duck
 */
function moveDuck() {
  // Duck size matches 80px in duckhunt.css
  const duckSize = 80

  // Calculate highest allowed X and Y coordinates inside boundaries
  const maxX = Math.max(0, gameArea.clientWidth - duckSize)
  const maxY = Math.max(0, gameArea.clientHeight - duckSize)

  // Apply randomized positions
  duckElement.style.left = `${Math.floor(Math.random() * maxX)}px`
  duckElement.style.top = `${Math.floor(Math.random() * maxY)}px`
}

/**
 * The function increment score and relocate target
 */
function handleDuckHit() {
  // Increment captured score count by 1
  gameObject.score += 1
  // Update score count text in HUD
  scoreDisplay.textContent = gameObject.score

  // Reset movement timer 
  clearInterval(gameObject.duckInterval)
  moveDuck()
  gameObject.duckInterval = setInterval(moveDuck, gameObject.speed)
}

/**
 * Halt active intervals, free object URLs, and show score summary
 */
function endGame() {
  // Stop countdown clock interval
  clearInterval(gameObject.gameTimer)
  // Stop duck movement interval
  clearInterval(gameObject.duckInterval)

  // Release memory held by preloaded blob URLs
  if (gameObject.bgBlobUrl) URL.revokeObjectURL(gameObject.bgBlobUrl)
  if (gameObject.duckBlobUrl) URL.revokeObjectURL(gameObject.duckBlobUrl)

  // Hide gamearea och duck and display result modal
  gameArea.classList.add('hidden')
  duckElement.classList.add('hidden')
  gameOverModal.classList.remove('hidden')
  // Print final earned score to modal display
  finalScoreDisplay.textContent = gameObject.score
}

/**
 * Initialize round, bind assets to DOM, and start countdown timers
 */
function startGame() {
  // Reset active score counter to 0
  gameObject.score = 0
  // Initialize remaining time from selected duration
  gameObject.timeLeft = gameObject.duration
  // Render reset score to HUD
  scoreDisplay.textContent = gameObject.score
  // Render initial countdown timer to HUD
  timeLeftDisplay.textContent = gameObject.timeLeft

  // Set board background and duck image using local blob URL
  gameArea.style.backgroundImage = `url('${gameObject.bgBlobUrl}')`
  duckElement.src = gameObject.duckBlobUrl

  // Hide game intro
  gameIntro.classList.add('hidden')
  // Hide setting card
  settingsCard.classList.add('hidden')
  // Hide game over
  gameOverModal.classList.add('hidden')
  // Reveal gameboard element
  gameArea.classList.remove('hidden')
  // Reveal duck element
  duckElement.classList.remove('hidden')

  // function sets duck at starting coordinates
  moveDuck()
  // Start periodic duck relocation timer
  gameObject.duckInterval = setInterval(moveDuck, gameObject.speed)

  // Start 1-second interval loop for countdown timer
  gameObject.gameTimer = setInterval(() => {
    // Decrement remaining seconds by 1
    gameObject.timeLeft -= 1
    // Update countdown value in HUD
    timeLeftDisplay.textContent = gameObject.timeLeft

    // End game when timer reaches zero
    if (gameObject.timeLeft <= 0) {
      endGame()
    }
  }, 1000) // Runs every 1000 Milliseconds
}

// --------------------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------------------

// Listen for form submit, run preload logic, and start game session
settingsForm.addEventListener('submit', async (event) => {
  // Prevent browser from reloading page
  event.preventDefault()
  // Await setup and asset preloading
  const isReady = await setupGame()
  // Start game loop if assets loaded successfully
  if (isReady) {
    startGame()
  }
})

// Listen for clicks on duck to handle duck hit
duckElement.addEventListener('click', handleDuckHit)

// Listen for clicks och play again button
playAgainBtn.addEventListener('click', () => {
  // Hide game over modal dialog
  gameOverModal.classList.add('hidden')
  // Reveal game intro
  gameIntro.classList.remove('hidden')
  // Reveal game setting card
  settingsCard.classList.remove('hidden')
})
