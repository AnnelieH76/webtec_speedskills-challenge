
// Setup: Base web address to the JSON files and the list of countries.
const BASE_URL = 'https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom05/data'

const countries = [
  { name: 'Sweden', filename: 'sweden.json' },
  { name: 'Norway', filename: 'norway.json' },
  { name: 'Denmark', filename: 'denmark.json' }
]

// ------------------------------------------------------------------------------------
// FUNCTION DEFINITIONS
// ------------------------------------------------------------------------------------

// Creates year options from 1900 to 2019 inside the dropdown menu.
export function populateYearSelect() {
  // Find the select menu in the HTML
  const selectElement = document.getElementById('year-select')
  if (!selectElement) return

  // Loop every year from 1900 up to 2019
  for (let year = 1900; year <= 2019; year++) {
    const option = document.createElement('option')
    option.value = year // The hidden value sent when selected
    option.textContent = year // The visible text for the user
    selectElement.appendChild(option) // Add option to the menu
  }
}

// Builds table rows and highlights the lowest Co2 emission in green.
export function renderTable(rows) {
  const tableBody = document.getElementById('table-body')
  if (!tableBody) return

  // Empty old rows so we do not get duplicate data
  tableBody.innerHTML = ''

  // Collect all Co2 numbers and find the lowest value
  const validCo2Values = rows
    .map(row => row.co2)
    .filter(val => typeof val === 'number')

  const minCo2 = validCo2Values.length > 0 ? Math.min(...validCo2Values) : null

  // Loop through all countries and build a table row (tr) for each
  for (let i = 0; i < rows.length; i++) {
    const item = rows[i]
    const tr = document.createElement('tr')

    // Cell for Country name
    const tdCountry = document.createElement('td')
    tdCountry.textContent = item.country
    tr.appendChild(tdCountry)

    // Cell for Co2 (check if this country has the lowest number)
    const tdCo2 = document.createElement('td')
    tdCo2.textContent = item.co2 !== null ? item.co2 : '-'
    if (minCo2 !== null && item.co2 === minCo2) {
      tdCo2.classList.add('winner') // Add CSS class for green color
    }
    tr.appendChild(tdCo2)

    // Cell for Co2 per capita 
    const tdPerCapita = document.createElement('td')
    tdPerCapita.textContent = item.co2PerCapita !== null ? item.co2PerCapita : '-'

    // if (minPerCapita !== null && item.co2PerCapita === minPerCapita) {
    //   tdPerCapita.classList.add('winner') // Add CSS class for green color
    // }

    tr.appendChild(tdPerCapita)

    // Cell for Oil Co2 
    const tdOilCo2 = document.createElement('td')
    tdOilCo2.textContent = item.oilCo2 !== null ? item.oilCo2 : '-'
    tr.appendChild(tdOilCo2)

    // Add the completed row to the table body
    tableBody.appendChild(tr)
  }
}

// Fetches data for each country one by one and draws the table.
export async function fetchData(event) {
  // Read the year chosen in the dropdown (convert text to number)
  const selectedYear = parseInt(event.target.value, 10)
  if (!selectedYear) return

  // Empty list of results for each country
  const rows = []

  try {
    // Loop through the countries one at a time
    for (const country of countries) {
      // Download file and wait for response
      const response = await fetch(`${BASE_URL}/${country.filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load data for ${country.name}`)
      }

      // Convert text from file into a JavaScript object
      const jsonData = await response.json()

      // Search inside the data list for the selected year
      const yearEntry = jsonData.data.find(entry => entry.year === selectedYear)

      // Save values to show in the table
      rows.push({
        country: country.name,
        co2: yearEntry && typeof yearEntry.co2 === 'number' ? yearEntry.co2 : null,
        co2PerCapita: yearEntry && typeof yearEntry.co2_per_capita === 'number' ? yearEntry.co2_per_capita : null,
        oilCo2: yearEntry && typeof yearEntry.oil_co2 === 'number' ? yearEntry.oil_co2 : null
      })
    }

    // Send the collected data to the function that draws the table
    renderTable(rows)
  } catch (error) {
    // Print in console if something went wrong
    console.error('Fetching error:', error)
  }
}

// ------------------------------------------------------------------------------------
// INITIALIZATION AND EVENT LISTENERS
// ------------------------------------------------------------------------------------

// Fill the dropdown with years
populateYearSelect()

const yearSelect = document.getElementById('year-select')
if (yearSelect) {
  // Listen for user changing year in the dropdown
  yearSelect.addEventListener('change', fetchData)

  // Trigger the default selected year (1900) when page opens
  yearSelect.dispatchEvent(new Event('change'))
}
