/**
 * A short script saying hello.
 */
console.log("Hello world!")
/**
 * Add the current year in the websites footer.
 */
const footer = document.querySelector('.footer-bottom')
const currentYear = new Date().getFullYear()
footer.textContent += ' ' + currentYear
