// Function to fetch local JSON and render to page
async function loadPersonData () {
  const container = document.getElementById('json-output')

  try {
    // 1. Fetch the local JSON file
    const response = await fetch('person.json')

    // 2. Parse JSON response into a JavaScript object
    const person = await response.json()

    // 3. Render content dynamically into the DOM
    container.innerHTML = `
      <h2>${person.name}, ${person.age} år</h2>
      <p><strong>Stad:</strong> ${person.adress.city}</p>
      <h3>Kurser:</h3>
      <ul>
        ${person.courses.map(course => `<li>${course}</li>`).join('')}
      </ul>
    `
  } catch (error) {
    console.error('Failed to load JSON data:', error)
    container.innerHTML = '<p>Kunde inte ladda datan.</p>'
  }
}

// Execute function on load
loadPersonData()
