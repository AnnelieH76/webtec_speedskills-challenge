
// Setup: Base web address to the JSON files and the list of countries.
const BASE_URL = 'https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom05/data'

// Countries to fetch and display
const countries = [
  { name: 'Sweden', filename: 'sweden.json' },
  { name: 'Norway', filename: 'norway.json' },
  { name: 'Denmark', filename: 'denmark.json' }
]

// ------------------------------------------------------------------------------------
// FUNCTION DEFINITIONS
// ------------------------------------------------------------------------------------

// Generates and appends year options to the select element.
export function populateYearSelect() {
  // find the select menu by its unique HTML ID attribute
  const selectElement = document.getElementById('year-select')
  // Stop execution if the select element is not present in the DOM
  if (!selectElement) return

  // Loop every year from 1900 up to 2019
  for (let year = 1900; year <= 2019; year++) {
    // Instantiate a new <option> HTML element in memory
    const option = document.createElement('option')
    // Set the hidden value when an option is selected
    option.value = year 
    // The visible text for the user i dropdown list
    option.textContent = year 
    // Append option element into the menu
    selectElement.appendChild(option) 
  }
}

// Builds table rows and highlights the lowest Co2 emission in green.
export function renderTable(rows) {
  // Target the table body element where rows should be placed
  const tableBody = document.getElementById('table-body')
  // Stop the function immediately if the element does not exist
  if (!tableBody) return 

  // Empty old rows so we do not get duplicate data
  tableBody.innerHTML = ''

  // Start with the array of country objects and store the filtered numbers in a new array
  const validCo2Values = rows
    // Extract only the co2 value from each country object, creating an array of just numbers/nulls. Ex: [{ country: 'Sweden', co2: 9.171 }, ...] to [9.171, 4.155, 5.148]
    .map(row => row.co2)
    // Filter only actual numbers, removing null or undefined values
    .filter(val => typeof val === 'number')

  // Declare a constant to hold the lowest emission number, check if the array contains at least one numeric value, Ternary operator(?) - If true: find the smallest number,
  // Spread operator (...): unpacks array items into individual arguments, Colon (:) - If false: default to null
  const minCo2 = validCo2Values.length > 0 ? Math.min(...validCo2Values) : null

  // Loop through each country's data object in the rows array
  for (let i = 0; i < rows.length; i++) {
    // Reference the current country object in this iteration
    const item = rows[i]
    // Create a new table row element (<tr>) in memory
    const tr = document.createElement('tr')

    // 1. COUNTRY NAME CELL
    // Create a standard table data cell (<td>)
    const tdCountry = document.createElement('td')
    // Insert the country string as plain text inside the cell
    tdCountry.textContent = item.country
    // Append the cell as a child element inside the current row
    tr.appendChild(tdCountry)

    // 2. CO2 CELL & WINNER CHECK
    // Create the data cell for total Co2 emissions
    const tdCo2 = document.createElement('td')
    // Set cell text to the number if available, otherwise display a dash (-) fallback
    tdCo2.textContent = item.co2 !== null ? item.co2 : '-'

    // Condition: verify a minimum value exists and matches this country's emission number
    if (minCo2 !== null && item.co2 === minCo2) {
      // Add CSS class for green color
      tdCo2.classList.add('winner') 
    }
    // Append the Co2 cell to the row
    tr.appendChild(tdCo2)

    // 3. CO2 PER CAPITA CELL
    // Create the data cell for emissions per inhabitant
    const tdPerCapita = document.createElement('td')
    // Display the per-capita number, or fallback to '-' if no data exists for this year
    tdPerCapita.textContent = item.co2PerCapita !== null ? item.co2PerCapita : '-'
    // Append the per-capita cell to the row
    tr.appendChild(tdPerCapita)

    // 4. OIL CO2 CELL
    // Create the data cell for oil-derived emissions
    const tdOilCo2 = document.createElement('td')
    tdOilCo2.textContent = item.oilCo2 !== null ? item.oilCo2 : '-'
    tr.appendChild(tdOilCo2)
    tableBody.appendChild(tr)
  }
}

// Asynchronous event handler triggered when a user selects a year in the dropdown.
export async function fetchData(event) {
  // Read selected value from dropdown and parse string into base-10 integer
  const selectedYear = parseInt(event.target.value, 10)
  // Stop execution if parsing fails or returns zero/NaN
  if (!selectedYear) return

  // Initialize an empty array to collect formatted row objects for all countries
  const rows = []

  // Wrap network requests in a try/catch block to catch HTTP and parsing errors
  try {
    // Loop through the countries one at a time
    for (const country of countries) {
      // Send HTTP GET request to GitHub endpoint and pause until headers resolve
      const response = await fetch(`${BASE_URL}/${country.filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load data for ${country.name}`)
      }

      // Read response body stream and parse JSON text into a JavaScript object
      const jsonData = await response.json()

      // Search inside the data list for the selected year
      const yearEntry = jsonData.data.find(entry => entry.year === selectedYear)

      // Construct formatted object and push into our results collection
      rows.push({
        // Country display name
        country: country.name,
        // Co2 metric: assign number if entry exists and is numeric, else fallback to null
        co2: yearEntry && typeof yearEntry.co2 === 'number' ? yearEntry.co2 : null,
        // Per capita metric
        co2PerCapita: yearEntry && typeof yearEntry.co2_per_capita === 'number' ? yearEntry.co2_per_capita : null,
        // Oil metric
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

// Execute function immediately upon module load to fill dropdown with options
populateYearSelect()

//Retrieve reference to the year selector element from the document
const yearSelect = document.getElementById('year-select')

// ensure element exists before binding event handlers or dispatching
if (yearSelect) {
  // Listen for user changing year in the dropdown to trigger fetchData
  yearSelect.addEventListener('change', fetchData)

  // Trigger the default selected year (1900) when page opens
  yearSelect.dispatchEvent(new Event('change'))
}
