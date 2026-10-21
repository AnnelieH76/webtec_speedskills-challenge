// SpeedSkills Challenge Implementation

// ------------------------------------------------------------
// CONSTANTS & GAME STATE
// ------------------------------------------------------------

// Available track backgrounds for random selection
const TRACK_OPTIONS = [
  'img-project/karlskoga_bana.jpeg',
  'img-project/mantorp_bana.jpeg',
  'img-project/vastgota_bana.jpeg'
]

// Target assets configuration
const WATER_TARGET = 'img-project/target_vatten.jpeg'
const TARGET_IMAGES = [
  'img-project/target_apex.jpeg',
  'img-project/target_flagga.jpeg',
  'img-project/target_mc.jpeg',
  WATER_TARGET
]

// ------------ SOUND EFFECTS ----------

// Sound effects using standard HTML5 Audio instances
const hitSound = new Audio('audio-project/hit_target.mp3')
const splashSound = new Audio('audio-project/splash.mp3')
const countdownSound = new Audio('audio-project/3_2_1_go.mp3')
const gameOverSound = new Audio('audio-project/game_over.mp3')
const bgMusic = new Audio('audio-project/bg_music.wav')
const bonusTimeSound = new Audio('audio-project/bonus_time.mp3')

// Configure looping for continuous track background music
bgMusic.loop = true

// Balance audio volume levels
bgMusic.volume = 0.3
hitSound.volume = 0.6
splashSound.volume = 0.6
countdownSound.volume = 0.6
gameOverSound.volume = 0.7
bonusTimeSound.volume = 0.6

// ---------  GAME OBJECT ----------------

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
const menuToggle = document.getElementById('menu-toggle')
const navLinks = document.getElementById('nav-links')
const tableResetBtn = document.getElementById('reset-btn-section4') // Reset button in sekton 4
const gameIntro = document.getElementById('game-intro')
const settingsCard = document.getElementById('settings-card') // Settings card container
const settingsForm = document.getElementById('game-settings-form') // Input form
const nameInput = document.getElementById('player-name')
const trackSelect = document.getElementById('track-select') // Track background select
const difficultySelect = document.getElementById('game-difficulty')
const startBtn = document.getElementById('start-btn') // Submit / Start button
const loadingOverlay = document.getElementById('loading-overlay') // Loading banner element

// DOM references: gameplay area, HUD, and modal
const countdownOverlay = document.getElementById('countdown-overlay')
const countdownText = document.getElementById('countdown-text')
const gameArea = document.getElementById('game-area')
const targetElement1 = document.getElementById('target-1') // First active game target
const targetElement2 = document.getElementById('target-2') // Second active game target
const targetBonus = document.getElementById('target-bonus')
const targetElements = [targetElement1, targetElement2] // Array wrapper for target elements
const scoreDisplay = document.getElementById('score-display') // Info in Heads-Up Display (HUD)
const timeLeftDisplay = document.getElementById('time-left') // Info in Heads-Up Display
const tierDisplay = document.getElementById('tier-display') // Difficulty info in Heads-Up Display
const gameOverModal = document.getElementById('game-over-modal')
const finalScoreDisplay = document.getElementById('final-score') // Inside game-over-modal
const resetScoresBtn = document.getElementById('reset-scores-btn') // Reset button in modal
const playAgainBtn = document.getElementById('play-again-btn') // Inside game-over-modal


// ---------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------

// Definition of funktion that pauses execution for specified milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// -------------- HIDE TARGETS --------------

// Force targets to be hidden whenever setup runs
function hideAllTargets() {
  targetElements.forEach((el) => {
    el.classList.add('hidden')
    el.style.display = 'none'
  })
}

// ---------------- HIGH SCORE -----------------

/**
 * Save current session result to localStorage sorted by score
 */
function recordHighScore() {
  // Retrieve saved scores or initialize empty list
  const existingScores = JSON.parse(localStorage.getItem('speedskills_scores')) || []

  // Create new score object (name defaults to 'Anonym')
  const newEntry = {
    score: gameObject.score,
    name: gameObject.playerName || 'Anonym',
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
    // Matches columns: Placering | Namn | Poäng | Svårighetsgrad
    row.innerHTML = `
      <td>#${index + 1}</td>
      <td>${entry.name}</td>
      <td><strong>${entry.score} p</strong></td>
      <td>${entry.tier}</td>
    `
    tbody.appendChild(row)
  })
}

// -------------- SOUND EFFECTS ------------------------

/**
 * Play sound effect and rewind playback to start
 * @param {HTMLAudioElement} audio
 */
function playSound(audio) {
  if (audio) {
    // Reset playback position so rapid clicks fire immediately
    audio.currentTime = 0
    // Play sound and handle browser autoplay promise rejections
    audio.play().catch((err) => {
      console.warn('Ljudfel för:', audio.src, err)
    })
  }
}

/**
 * Stop an audio element and reset playback position
 * @param {HTMLAudioElement} audio
 */
function stopSound(audio) {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }
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

  let chosenTrack = trackSelect ? trackSelect.value : 'random'
  const chosenDifficulty = difficultySelect ? difficultySelect.value : 'normal'

  // If user chose random, pick one randomly from the array
  if (chosenTrack === 'random') {
    const randomIndex = Math.floor(Math.random() * TRACK_OPTIONS.length)
    chosenTrack = TRACK_OPTIONS[randomIndex]
  }

  // Read player name or fallback to 'Anonym' if left empty
  const enteredName = nameInput && nameInput.value.trim() !== ''
    ? nameInput.value.trim()
    : 'Anonym'

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
    gameObject.playerName = enteredName

    // Render active tier name in HUD
    if (tierDisplay) {
      tierDisplay.textContent = config.tierName
    }

    // Set chosen track background directly on the game area
    gameArea.style.backgroundImage = `url('${chosenTrack}')`
    gameArea.style.backgroundSize = 'cover'
    gameArea.style.backgroundPosition = 'center'

    // Ensure targets are not visible yet
    hideAllTargets()

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
//            GAME ENGINE & LOOP
// -----------------------------------------------------

// ------- START COUNTDOWN 3 2 1 GO --------------------------------
/**
 * Run 3-2-1-GO sequence before actual gameplay commences
 * @param {Function} onComplete - Callback invoked when countdown finishes
 */
function startCountdown(onComplete) {
  const steps = ['3', '2', '1', 'GO!']
  let stepIndex = 0

  // Show overlay and start audio
  countdownOverlay.classList.remove('hidden')
  playSound(countdownSound)

  function showNextStep() {
    if (stepIndex < steps.length) {
      countdownText.textContent = steps[stepIndex]

      // Restart CSS pulse animation
      countdownText.classList.remove('countdown-pulse')
      void countdownText.offsetWidth // Trigger reflow
      countdownText.classList.add('countdown-pulse')

      stepIndex++
      setTimeout(showNextStep, 800)
    } else {
      // Countdown finished: hide overlay completely and wipe text
      countdownOverlay.classList.add('hidden')
      countdownText.textContent = ''
      countdownText.classList.remove('countdown-pulse')

      if (typeof onComplete === 'function') {
        onComplete()
      }
    }
  }
  showNextStep()
}

// ----------------------- START GAME --------------------------------
/**
 * Initialize round, bind assets to DOM, and start countdown timers
 */
function startGame() {
  // Clear any residual running intervals
  clearInterval(gameObject.gameTimer)
  clearInterval(gameObject.moveInterval)
  clearInterval(gameObject.bonusInterval)

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

  // 2. Start bonus spawn timer every 7 seconds
  gameObject.bonusInterval = setInterval(spawnBonusTime, 7000)

  // Start background music loop
  playSound(bgMusic)
}



// ----------------------- MOVE TARGETS --------------------------------
/**
 * Select two unique random images, place targets and drift them randomly
 */
function moveTargets() {
  // 1. Pick 2 unique images from TARGET_IMAGES
  const shuffledImages = [...TARGET_IMAGES].sort(() => 0.5 - Math.random())
  const selectedImages = shuffledImages.slice(0, 2)

  // 2. Position each target independently
  targetElements.forEach((el, index) => {
    el.src = selectedImages[index]

    // Calculate dynamic boundaries for each element
    const targetWidth = el.offsetWidth || gameObject.targetSize
    const targetHeight = el.offsetHeight || gameObject.targetSize
    const driftDistance = 60 // Pixels to drift across the track

    // Safe boundaries ensuring drift remains fully inside gameArea
    const maxX = Math.max(0, gameArea.clientWidth - targetWidth - driftDistance)
    const maxY = Math.max(0, gameArea.clientHeight - targetHeight - driftDistance)

    const startX = Math.floor(Math.random() * maxX)
    const startY = Math.floor(Math.random() * maxY)

    // Calculate random drift direction (-driftDistance to +driftDistance)
    const driftX = (Math.random() - 0.5) * 2 * driftDistance
    const driftY = (Math.random() - 0.5) * 2 * driftDistance

    // Ensure target doesn't drift outside the canvas borders
    const targetX = Math.min(Math.max(0, startX + driftX), gameArea.clientWidth - targetWidth)
    const targetY = Math.min(Math.max(0, startY + driftY), gameArea.clientHeight - targetHeight)

    // Instantly teleport target to start position without animation
    el.style.transition = 'none'
    el.style.position = 'absolute'
    el.style.left = `${startX}px`
    el.style.top = `${startY}px`
    el.style.display = 'block'

    // Trigger smooth continuous drift towards target coordinates
    requestAnimationFrame(() => {
      // Transition duration matches game speed cadence
      const moveDuration = Math.max(0.6, (gameObject.speed || 1500) / 1000)
      el.style.transition = `left ${moveDuration}s linear, top ${moveDuration}s linear`
      el.style.left = `${targetX}px`
      el.style.top = `${targetY}px`
    })
  })
}














// ----------------------- SPAWN BONUS TIME TARGET  --------------------------------

function spawnBonusTime() {
  if (!gameObject.isPlaying || !targetBonus) return

  // Use the same target size as other targets or a fixed size (e.g. 50px)
  const size = gameObject.targetSize || 50
  targetBonus.style.width = `${size}px`
  targetBonus.style.height = `${size}px`

  // Calculate random position within bounds
  const maxX = gameArea.clientWidth - size
  const maxY = gameArea.clientHeight - size

  targetBonus.style.left = `${Math.floor(Math.random() * maxX)}px`
  targetBonus.style.top = `${Math.floor(Math.random() * maxY)}px`

  // Make it visible
  targetBonus.classList.remove('hidden')

  // Automatically hide again if player misses it within 3 seconds
  setTimeout(() => {
    if (targetBonus && !targetBonus.classList.contains('hidden')) {
      targetBonus.classList.add('hidden')
    }
  }, 3000)
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
    // Play hazard sound effect
    playSound(splashSound)

  } else {
    // Standard hit: add points defined in tier config
    gameObject.score += gameObject.pointsPerHit
    // Play successful hit sound effect
    playSound(hitSound)
  }

  // Update HUD
  scoreDisplay.textContent = gameObject.score

  // Trigger CSS hit animation
  clickedTarget.classList.add('target-hit-anim')

  // Clear existing interval while animating
  clearInterval(gameObject.moveInterval)

  // Wait for animation to finish before relocating targets
  setTimeout(() => {
    clickedTarget.classList.remove('target-hit-anim')
    moveTargets()
    gameObject.moveInterval = setInterval(moveTargets, gameObject.speed)
  }, 220)
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

  // Stop background music and trigger game over sound
  stopSound(bgMusic)
  playSound(gameOverSound)
}

// --------------------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------------------

// Toggle navigation menu visibility on mobile screens
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show')
  })
}

// -----------------SUBMIT BUTTON -------------------

// Listen for form submit, run preload logic, and start game session (only if form exists)
if (settingsForm) {
  settingsForm.addEventListener('submit', async (event) => {
    // Prevent browser from reloading page
    event.preventDefault()

    // Await setup and asset preloading
    const isReady = await setupGame()

    if (isReady) {
      // 1. Hide intro/settings and show track canvas
      gameIntro.classList.add('hidden')
      settingsCard.classList.add('hidden')
      gameArea.classList.remove('hidden')

      // Hide targets during 3-2-1-GO
      hideAllTargets()

      if (gameObject.bgBlobUrl) {
        gameArea.style.backgroundImage = `url('${gameObject.bgBlobUrl}')`
      }

      // 2. Now run the 3-2-1-GO! countdown on the visible track
      startCountdown(() => {
        // Start background music loop when countdown finishes
        playSound(bgMusic)
        // Start timers and target spawns
        startGame()
      })
    }
  })
}

// ---------------------- TARGET HITS -------------------------------

// Attach click listeners to both elements (if elements exist)
targetElements.forEach((el) => {
  if (el) {
    el.addEventListener('click', handleTargetHit)
  }
})










// ---------------------- BONUS TARGET HIT -------------------------------

if (targetBonus) {
  targetBonus.addEventListener('click', (e) => {
    e.stopPropagation() // Prevent gameArea miss-click triggers

    console.log('Klick på bonus! isPlaying:', gameObject.isPlaying, 'Nuvarande tid:', gameObject.timeLeft)

    // Verify active game state
    if (!gameObject.isPlaying) return

    // 1. Add 5 seconds to remaining time
    gameObject.timeLeft = Number(gameObject.timeLeft) + 5

    // 2. Refresh HUD element display immediately
    if (timeLeftDisplay) {
      timeLeftDisplay.textContent = gameObject.timeLeft
    }

    // 3. Play hit sound effect
    playSound(bonusTimeSound)

    // 4. Hide bonus target
    targetBonus.classList.add('hidden')
  })
} else {
  console.warn('Hittade inte #target-bonus i DOM!')
}

















// ---------------------- PLAY AGAIN -------------------------------

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


// ---------------------- RESET HIGHSCORE -------------------------
// -----------when "Reload page" or click on "Reset button" -------------------
/**
 * Function to clear highscores and refresh the display table
 */
function resetHighscores() {
  localStorage.removeItem('speedskills_scores')
  renderHighscoreTable()
}

// "Reset scores" clears storage and updates the table immediately
if (resetScoresBtn) {
  resetScoresBtn.addEventListener('click', resetHighscores)
}

if (tableResetBtn) {
  tableResetBtn.addEventListener('click', resetHighscores)
}

// Render highscores when DOM tree is ready
document.addEventListener('DOMContentLoaded', () => {
  renderHighscoreTable()
})

// Clear highscores when the gameplay page is specifically reloaded (F5 / Refresh)
const perfNav = performance.getEntriesByType('navigation')[0]
const isReload =
  (perfNav && perfNav.type === 'reload') ||
  (performance.navigation && performance.navigation.type === 1)

if (isReload) {
  resetHighscores()
}

