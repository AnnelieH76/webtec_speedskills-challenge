// SpeedSkills Challenge Implementation

// ------------------------------------------------------------
// CONSTANTS & GAME STATE
// ------------------------------------------------------------

// Target assets configuration
const WATER_TARGET = 'img-project/target_vatten.jpeg'
const TARGET_IMAGES = [
  'img-project/target_apex.jpeg',
  'img-project/target_flagga.jpeg',
  'img-project/target_mc.jpeg',
  WATER_TARGET
]

// Global game object holding active values, runtime state, and intervals
const gameObject = {
  score: 0,
  pointsPerHit: 2,
  duration: 10,        // Match duration in seconds
  timeLeft: 10,        // Active countdown remaining
  isPlaying: false,    // State flag to control click registration
  speed: 2000,         // Interval between automatic target relocations (ms)
  targetSize: 70,      // Fallback size in px if element dimensions aren't rendered
  gameTimer: null,     // Holds the 1-second countdown interval
  moveInterval: null,  // Holds the target relocation interval
  backgroundId: 0,
  bgBlobUrl: null      // Holds local blob URL if loaded dynamically
}

// -----------------------------------------------------
// DOM REFERENCES
// -----------------------------------------------------

// DOM references: configuration controls and overlays
const gameIntro = document.getElementById('game-intro')
const settingsCard = document.getElementById('settings-card') // Settings card container
const settingsForm = document.getElementById('game-settings-form') // Input form
const loadingOverlay = document.getElementById('loading-overlay') // Loading banner element
const startBtn = document.getElementById('start-btn') // Submit / Start button
const trackSelect = document.getElementById('track-select') // Track background select
const difficultySelect = document.getElementById('game-difficulty')

// DOM references: gameplay area, HUD, and modal
const gameArea = document.getElementById('game-area')
const targetElement1 = document.getElementById('target-1') // First active game target
const targetElement2 = document.getElementById('target-2') // Second active game target
const targetElements = [targetElement1, targetElement2] // Array wrapper for target elements
const scoreDisplay = document.getElementById('score-display') // Info in Heads-Up Display (HUD)
const timeLeftDisplay = document.getElementById('time-left') // Info in Heads-Up Display
const gameOverModal = document.getElementById('game-over-modal')
const finalScoreDisplay = document.getElementById('final-score') // Inside game-over-modal
const playAgainBtn = document.getElementById('play-again-btn') // Inside game-over-modal


// ---------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------

// Definition of funktion that pauses execution for specified milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Save current session result to localStorage sorted by score
 */
function recordHighScore() {
  // Retrieve saved scores or initialize empty list
  const existingScores = JSON.parse(localStorage.getItem('speedskills_scores')) || []

  // Create new score object (name defaults to 'Anonym')
  const newEntry = {
    score: gameObject.score,
    name: 'Anonym',
    tier: gameObject.tierName || 'Normal'
  }

  // Push, sort descending by score
  existingScores.push(newEntry)
  existingScores.sort((a, b) => b.score - a.score)

  // Keep top 10 scores
  const topScores = existingScores.slice(0, 10)

  // Save back to session storage
  localStorage.setItem('speedskills_scores', JSON.stringify(topScores))
}

/**
 * Render saved scores from localStorage into the HTML table
 */
function renderHighscoreTable() {
  const tbody = document.getElementById('highscore-body')
  if (!tbody) return

  const savedScores = JSON.parse(localStorage.getItem('speedskills_scores')) || []

  if (savedScores.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Inga spelade spel än. Starta en session ovan!</td>
      </tr>
    `
    return
  }

  tbody.innerHTML = ''
  savedScores.forEach((entry, index) => {
    const row = document.createElement('tr')
    // Matches columns: Poäng | Placering | Namn | Svårighetsgrad
    row.innerHTML = `
      <td><strong>${entry.score} p</strong></td>
      <td>#${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.tier}</td>
    `
    tbody.appendChild(row)
  })
}

// ------------------------------------------------------------
// GAME INITIALIZATION & ASSET LOADING
// ------------------------------------------------------------

/**
 * Validate selections, initialize settings, and fetch configuration
 * @returns {Promise<boolean>} True if preload succeeded, false otherwise
 */

// The asynchronous game setup function
async function setupGame() {
  // Read selected values from the form
  const chosenTrack = trackSelect ? trackSelect.value : 'img-project/karlskoga_bana.jpeg'
  const chosenDifficulty = difficultySelect ? difficultySelect.value : 'normal'

  // Reveal loading indicator to the user and prevent duplicate clicks
  if (loadingOverlay) loadingOverlay.classList.remove('hidden')
  // Disable submit button to prevent redundant network requests
  if (startBtn) startBtn.disabled = true

  // Artificial delay in milliseconds to keep the loading message visible
  await delay(500)

  try {
    // Fetch configuration dynamically from easy.json, normal.json, or hard.json 
    const response = await fetch(`${chosenDifficulty}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load ${chosenDifficulty}.json (Status: ${response.status})`)
    }

    const config = await response.json()

    // Assign configuration parameters from JSON into global game state
    gameObject.speed = config.speed
    gameObject.targetSize = config.targetSize
    gameObject.pointsPerHit = config.pointsPerHit
    gameObject.duration = config.gameDuration
    gameObject.tierName = config.tierName

    // Set chosen track background directly on the game area
    gameArea.style.backgroundImage = `url('${chosenTrack}')`
    gameArea.style.backgroundSize = 'cover'
    gameArea.style.backgroundPosition = 'center'

    return true

  } catch (error) {
    // Log network or parsing failure to developer console
    console.error('Failed to load assets via fetch:', error)
    // Alert user that loading game configuration failed
    alert('Kunde inte ladda spelinställningarna från JSON.')
    return false

  } finally {
    // Hide loading banner regardless of success or failure
    if (loadingOverlay) loadingOverlay.classList.add('hidden')
    // Re-enable submit button for new attempts
    if (startBtn) startBtn.disabled = false
  }
}

// ------------------------------------------------------
//  GAME ENGINE & LOOP
// -----------------------------------------------------

// ----------------------- START GAME --------------------------------
/**
 * Initialize round, bind assets to DOM, and start countdown timers
 */
function startGame() {
  // Clear any residual running intervals
  clearInterval(gameObject.gameTimer)
  clearInterval(gameObject.moveInterval)

  // Set runtime state flag
  gameObject.isPlaying = true

  // Reset active score counter to 0
  gameObject.score = 0

  // Initialize remaining time from selected duration
  gameObject.timeLeft = gameObject.duration

  // Render reset score to HUD
  scoreDisplay.textContent = gameObject.score

  // Render initial countdown timer to HUD
  timeLeftDisplay.textContent = gameObject.timeLeft

  // Set board background image (blob URL or fallback background asset)
  if (gameObject.bgBlobUrl) {
    gameArea.style.backgroundImage = `url('${gameObject.bgBlobUrl}')`
  }

  // Hide UI overlays
  gameIntro.classList.add('hidden')
  settingsCard.classList.add('hidden')
  gameOverModal.classList.add('hidden')

  // Reveal gameboard
  gameArea.classList.remove('hidden')

  // Initialize and reveal all active target elements
  targetElements.forEach((el) => {
    el.style.width = `${gameObject.targetSize}px`
    el.style.height = `${gameObject.targetSize}px`
    el.classList.remove('hidden')
  })

  // Position initial targets immediately
  moveTargets()

  // Start continuous relocation timer
  gameObject.moveInterval = setInterval(moveTargets, gameObject.speed)

  // Start 1-second match countdown timer
  gameObject.gameTimer = setInterval(() => {
    gameObject.timeLeft -= 1
    timeLeftDisplay.textContent = gameObject.timeLeft

    if (gameObject.timeLeft <= 0) {
      endGame()
    }
  }, 1000)
}

// ----------------------- MOVE TARGETS --------------------------------
/**
 * Select two unique random images and place both targets at safe random positions
 */
function moveTargets() {
  // 1. Shuffle or pick 2 unique images from TARGET_IMAGES
  const shuffledImages = [...TARGET_IMAGES].sort(() => 0.5 - Math.random())
  const selectedImages = shuffledImages.slice(0, 2)

  // 2. Position each target independently
  targetElements.forEach((el, index) => {
    el.src = selectedImages[index]

    // Calculate dynamic boundaries for each element
    const targetWidth = el.offsetWidth || gameObject.targetSize
    const targetHeight = el.offsetHeight || gameObject.targetSize

    const maxX = Math.max(0, gameArea.clientWidth - targetWidth)
    const maxY = Math.max(0, gameArea.clientHeight - targetHeight)

    const randomX = Math.floor(Math.random() * maxX)
    const randomY = Math.floor(Math.random() * maxY)

    el.style.position = 'absolute'
    el.style.left = `${randomX}px`
    el.style.top = `${randomY}px`
    el.style.display = 'block'
  })
}

// ----------------------- HANDLE TARGET HITS --------------------------------
/**
 * Handle clicks on a specific target 
 * @param {MouseEvent|Event} event - The click event triggered by hitting a target
 */
function handleTargetHit(event) {
  // Identify which specific image was clicked
  const clickedTarget = event.currentTarget || event.target
  const clickedSrc = clickedTarget.src

  // Check if player clicked the hazard (water puddle)
  if (clickedSrc.includes(WATER_TARGET)) {
    // Penalty: subtract 2 points (prevent score from going below 0)
    gameObject.score = Math.max(0, gameObject.score - 2)
  } else {
    // Standard hit: add points defined in tier config
    gameObject.score += gameObject.pointsPerHit
  }

  // Update HUD
  scoreDisplay.textContent = gameObject.score

  // Immediately relocate both targets and reset cadence interval
  clearInterval(gameObject.moveInterval)
  moveTargets()
  gameObject.moveInterval = setInterval(moveTargets, gameObject.speed)
}

// ----------------------- END GAME --------------------------------
/**
 * Halt active intervals, restore navigation, and show score summary
 */
function endGame() {
  // Stop countdown clock interval
  clearInterval(gameObject.gameTimer)
  // Stop target relocation interval
  clearInterval(gameObject.moveInterval)

  // Reset runtime state flag
  gameObject.isPlaying = false

  // Hide game area and both active targets
  if (gameArea) gameArea.classList.add('hidden')
  targetElements.forEach((el) => {
    if (el) el.classList.add('hidden')
  })

  // Restore navigation header
  const siteHeader = document.querySelector('.siteheader')
  if (siteHeader) siteHeader.classList.remove('hidden')

  // Display result modal and print final earned score to modal display
  if (gameOverModal) gameOverModal.classList.remove('hidden')
  if (finalScoreDisplay) finalScoreDisplay.textContent = gameObject.score

  // Save score to persistent storage and update table if present
  recordHighScore()
  renderHighscoreTable()
}

// --------------------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------------------

// Listen for form submit, run preload logic, and start game session (only if form exists)
if (settingsForm) {
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
}

// Attach click listeners to both elements (if elements exist)
targetElements.forEach((el) => {
  if (el) {
    el.addEventListener('click', handleTargetHit)
  }
})

// "Play again" resets to settings
if (playAgainBtn) {
  playAgainBtn.addEventListener('click', () => {
    // Hide game over modal
    if (gameOverModal) gameOverModal.classList.add('hidden')

    // Reveal pre-game intro and settings card again
    if (gameIntro) gameIntro.classList.remove('hidden')
    if (settingsCard) settingsCard.classList.remove('hidden')
  })
}

// Render highscores when DOM tree is ready
document.addEventListener('DOMContentLoaded', () => {
  renderHighscoreTable()
})

// Clear highscores ONLY when the gameplay page is specifically reloaded (F5 / Refresh)
const perfNav = performance.getEntriesByType('navigation')[0]
const isReload =
  (perfNav && perfNav.type === 'reload') ||
  (performance.navigation && performance.navigation.type === 1)

if (isReload) {
  localStorage.removeItem('speedskills_scores')
}

