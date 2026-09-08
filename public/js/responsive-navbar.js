/**
 * Enable a responsive navbar toggle.
 */
console.log('Hello navbar')

// Get the hamburger menu button element by its ID
const menuToggle = document.getElementById('menu-toggle')

// Get the navigation links container by its ID
const navLinks = document.getElementById('nav-links')

// Add a click event listener to the menu button
menuToggle.addEventListener('click', () => {
  // Toggle the 'show' class on the nav links to show/hide the menu
  navLinks.classList.toggle('show')
})
