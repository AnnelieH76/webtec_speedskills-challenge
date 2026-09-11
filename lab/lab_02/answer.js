/**
 * This file contains the functions you shall implement to solve the lab.
 * Implement them one by one and check if they pass all tests.
 * 
 * Execute the lab in the browser through lab.html and review the output in the 
 * console, or execute the lab through node using `node lab` in the terminal.
 */



/**
 * Returns a boolean weither the incoming value is larger than 42.
 *
 * @param {number} value The value to use.
 * @returns {boolean} true the incoming value is larger than 42, else false.
 */
export function isLarger(value) {
  // TODO: Write your code here.
  return value > 42
}



/**
 * Returns "Positive" if the incoming value is positive, "Negative" if it is negative and "Neither" if it is zero.
 *
 * @param {number} value The value to use.
 * @returns {string} The answering string.
 */
export function isPositiveNegative(value) {
  // TODO: Write your code here.

  if (value > 0) {
    return "Positive"
  }
  else if (value < 0) {
    return "Negative"
  }
  else {
    return "Neither"
  }
}





/**
 * Returns "Odd" if the incoming value is odd and "Even" if it is even.
 *
 * @param {number} value The value to use.
 * @returns {string} The answering string.
 */
export function isOddEven(value) {
  // TODO: Write your code here.
  if (value % 2 === 0) {
    return "Even"
  }
  else {
    return "Odd"
  }
}




/**
 * Returns "Black Jack" if the total sum is 21. If the sum is larger, return "Busted" and if it is lower, return "Draw".
 *
 * @param {number} value1 The first value to use.
 * @param {number} value2 The second value to use.
 * @param {number} value3 The third value to use.
 * @returns {string} The answering string.
 */
export function blackJack(value1, value2, value3) {
  // TODO: Write your code here.
  let totalSum = value1 + value2 + value3

  if (totalSum === 21) {
    return "Black Jack"
  }
  else if (totalSum > 21) {
    return "Busted"
  }
  else {
    return "Draw"
  }
}



/**
 * Returns the specific grade for a test score.
 * Score equal or higher than 90: A
 * Score equal or higher than 80: B
 * Score equal or higher than 70: C
 * Score lower than 70: F
 *
 * @param {number} score The score to use.
 * @returns {string} The answering grade.
 */
export function gradeChecker(score) {
  // TODO: Write your code here.

  if (score >= 90) {
    return "A"
  }
  else if (score >= 80) {
    return "B"
  }
  else if (score >= 70) {
    return "C"
  }
  else {
    return "F"
  }
}



/**
 * Returns a string based on the incoming temperature.
 * Temperature below 10: "Cold"
 * Temperature between or equal to 10 and 25: "Warm"
 * Temperature above 25: "Hot"
 *
 * @param {number} temp The temperature to use.
 * @returns {string} The answering string.
 */
export function temperature(temp) {
  // TODO: Write your code here.

  if (temp < 10) {
    return "Cold"
  }

  else if (temp > 25) {
    return "Hot"
  }

  else {
    return "Warm"
  }
}



/**
 * Returns the action based on the incoming traffic light color, using the if-statement.
 * If the color is "Red", return "Stop"
 * If the color is "Yellow", return "Wait"
 * If the color is "Green", return "Go"
 * Otherwise return "Invalid color"
 * 
 * The check should not be case-sensitive.
 *
 * @param {string} color The color to use.
 * @returns {string} The answering string.
 */
export function trafficlight(color) {
  // TODO: Write your code here.

  if (color.toLowerCase() === "red") {
    return "Stop"
  }

  else if (color.toLowerCase() === "yellow") {
    return "Wait"
  }

  else if (color.toLowerCase() === "green") {
    return "Go"
  }

  else {
    return "Invalid color"
  }
}



/**
 * Returns a boolean weither the incoming number is equal to the integer representation of the incoming string.
 *
 * @param {number} value The number to use.
 * @param {string} text The string to use.
 * @returns {boolean} The answering boolean.
 */
export function intRepresentation(value, text) {
  // TODO: Write your code here.

  // Explanation and assistance from MDN and Gemini.
  const parsedInt = parseInt(text, 10) // Extract integer from the start of the string using base 10 (decimal system)

  return value === parsedInt // Compare original number to parsed integer; returns true if identical, otherwise false
}



/**
 * Returns "Fizz", "Buzz", "FizzBuzz" or the passed value.
 * This is a code exercise called "FizzBuzz".
 * If the incoming number is divisible by 3, return "Fizz". 
 * If the incoming number is divisible by 5, return "Buzz". 
 * If the incoming number is divisible by 3 and 5, return "FizzBuzz".
 * Otherwise you return the actual number. 
 *
 * Read more: https://en.wikipedia.org/wiki/Fizz_buzz
 * 
 * @param {number} value The value to use.
 * @returns {string|number} The answering result.
 */
export function fizzBuzz(value) {
  // TODO: Write your code here.

  if (value % 3 === 0 && value % 5 === 0) {
    return "FizzBuzz"
  }

  else if (value % 3 === 0) {
    return "Fizz"
  }

  else if (value % 5 === 0) {
    return "Buzz"
  }

  else {
    return value
  }
}



/**
 * Returns the action based on the incoming traffic light color, using the switch statement.
 * If the color is "Red", return "Stop"
 * If the color is "Yellow", return "Wait"
 * If the color is "Green", return "Go"
 * Otherwise return "Invalid color"
 * 
 * The check should not be case-sensitive.
 *
 * @param {string} color The color to use.
 * @returns {string} The answering string.
 */
export function trafficlightSwitch(color) {
  // TODO: Write your code here.

  switch (color.toLowerCase()) {
  case "red":
    return "Stop"

  case "yellow":
    return "Wait"

  case "green":
    return "Go"

  default:
    return "Invalid color"
  }
}



/**
 * Returns the result from a calculation on the incoming values, using the switch statement.
 * Default 
 *
 * @param {number} value1 The first value to use.
 * @param {number} value2 The second value to use.
 * @param {string} op The operator to use (+, -, *, /, %).
 * @param {boolean} reverse Boolean if values should be reversed so value2 is the first value to use.
 * @returns {number} The result.
 */
export function calculator(value1, value2, op) {
  // TODO: Write your code here.

  switch (op) {
  case "+":
    return value1 + value2

  case "-":
    return value1 - value2

  case "*":
    return value1 * value2

  case "/":
    return value1 / value2

  case "%":
    return value1 % value2

  default:
    return null  
  }
}
