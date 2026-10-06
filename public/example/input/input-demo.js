
//---- EXAMPLE FORM MAID WITH AI -------

// Reference form and interactive controls
const form = document.getElementById('advanced-form')
const volumeRange = document.getElementById('volume')
const volumeValue = document.getElementById('volume-val')
const newsletterCheckbox = document.getElementById('newsletter')
const emailInput = document.getElementById('email-input')
const resetBtn = document.getElementById('reset-btn')
const resultBox = document.getElementById('result-box')
const outputJson = document.getElementById('output-json')

// 1. Sync range slider live value to label
volumeRange.addEventListener('input', (event) => {
  volumeValue.textContent = event.target.value
})

// 2. Enable/disable email field based on checkbox state
newsletterCheckbox.addEventListener('change', (event) => {
  const isChecked = event.target.checked
  emailInput.disabled = !isChecked
  emailInput.required = isChecked

  if (!isChecked) {
    emailInput.value = ''
    emailInput.classList.remove('touched')
  } else {
    emailInput.focus()
  }
})

// 3. Mark fields as touched on blur to trigger visible invalid styling
const validateInputs = form.querySelectorAll('input, select')
validateInputs.forEach((field) => {
  field.addEventListener('blur', () => {
    field.classList.add('touched')
  })
})

// 4. Reset form state and hide result box
resetBtn.addEventListener('click', () => {
  form.reset()
  emailInput.disabled = true
  emailInput.required = false
  volumeValue.textContent = '70'
  validateInputs.forEach((field) => field.classList.remove('touched'))
  resultBox.classList.add('hidden')
})

// 5. Submit event handling with custom validation check
form.addEventListener('submit', (event) => {
  event.preventDefault()

  // Mark all fields to reveal validation styles
  validateInputs.forEach((field) => field.classList.add('touched'))

  // Trigger HTML5 validation popup if any boundary or pattern fails
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  // Extract form values using FormData API
  const formData = new FormData(form)
  const collectedData = {
    username: formData.get('username'),
    score: Number(formData.get('score')),
    volume: Number(formData.get('volume')),
    eventDate: formData.get('eventDate'),
    favColor: formData.get('favColor'),
    category: formData.get('category'),
    level: formData.get('level'),
    newsletter: newsletterCheckbox.checked,
    email: formData.get('email') || null
  }

  // Display structured output on the page
  outputJson.textContent = JSON.stringify(collectedData, null, 2)
  resultBox.classList.remove('hidden')
})
