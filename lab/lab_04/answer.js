/**
 * This file contains the functions you shall implement to solve the lab.
 * Implement them one by one and check if they pass all tests.
 * 
 * Execute the lab in the browser through lab.html and review the output in the 
 * console, or execute the lab through node using `node lab` in the terminal.
 */



/**
 * Create an array that holds the items 1, 2, 3, 42, "hello".
 *
 * @returns {Array} the resulting array.
 */
export function createArray() {
  // TODO: Write your code here.
  let Array = [1, 2, 3, 42, 'hello']

  return Array
}



/**
 * Returns the length of an array.
 *
 * @param {Array} arr The array to use.
 * @returns {number} The length of the array.
 */
export function arrayLength(arr) {
  // TODO: Write your code here.

  return arr.length
}



/**
 * Add the two variables to the end of the array and return the array.
 * 
 * @param {Array} arr The array to use.
 * @param {*} item1 The first variable to add.
 * @param {*} item2 The second variable to add.
 * 
 * @returns {Array} The resulting array.
 */
export function addToArray(arr, item1, item2) {
  // TODO: Write your code here.

  arr.push(item1)
  arr.push(item2)

  return arr
}


/**
 * Returns the nth element in the array.
 *
 * @param {number} n The index of the element to retrieve.
 * @param {Array} arr The array to use.
 * @returns {*} The nth element in the array.
 */
export function nthElement(arr, n) {
  // TODO: Write your code here.

  return arr[n]
}



/**
 * Use Array.slice() to extract the 2nd and 3rd element from the array.
 * Add the elements to the end of the array and return it. 
 * Hint: Array.slice()
 *
 * @param {Array} arr The array to use.
 * @returns {Array} The array with the 2nd and 3rd element in the end.
 */
export function sliceArray(arr) {
  // TODO: Write your code here.

  let sliced = arr.slice(1, 3)

  arr.push(sliced[0], sliced[1])

  return arr
}



/**
 * Use Array.splice() to extract the 1st to 3rd element from the array.
 * Add the elements to the end of the array and return it. 
 * Hint: Array.splice()
 *
 * @param {Array} arr The array to use.
 * @returns {Array} The array with the 1st to 3rd element in the end.
 */
export function spliceArray(arr) {
  // TODO: Write your code here.

  // Remove the first 3 elements and store them
  let extracted = arr.splice(0, 3)

  // Add them individually to the end
  arr.push(extracted[0], extracted[1], extracted[2])

  return arr
}



/**
 * Return the largest number in the array.
 * Hint: Math.max()
 * 
 * @param {Array} arr The array to use.
 * @returns {number} The largest number in the array.
 */
export function largest(arr) {
  // TODO: Write your code here.

  // Spread the array elements as individual arguments into Math.max
  return Math.max(...arr)
}



/**
 * Return the average number of the array.
 * 
 * @param {Array} arr The array to use.
 * @returns {number} The average.
 */
export function average(arr) {
  // TODO: Write your code here.

  let sum = 0

  // Loop through all elements and accumulate the sum
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]
  }

  // Divide the total sum by the number of elements
  return sum / arr.length
}




/**
 * Return the two arrays as one concatinated (merged) array.
 * 
 * @param {Array} arr1 The first array to use.
 * @param {Array} arr2 The second array to use.
 * 
 * @returns {Array} The resulting array.
 */
export function mergeArrays(arr1, arr2) {
  // TODO: Write your code here.

  // Merge arr1 and arr2 into a new array
  return arr1.concat(arr2)
}




/**
 * Return an array without duplicates.
 * 
 * @param {Array} arr The array to use.
 * @returns {Array} The resulting array without duplicates.
 */
export function removeDuplicates(arr) {
  // TODO: Write your code here.
  const uniqueItems = []

  // Iterate over each element in the input array
  for (let i = 0; i < arr.length; i++) {
    const currentItem = arr[i]

    // Check if the item is not already present in the result array
    if (!uniqueItems.includes(currentItem)) {
      uniqueItems.push(currentItem)
    }
  }

  return uniqueItems
}



/**
 * Return a string containing the first and the last items in the array "arr". Separate the items with a hyphen (-).
 * 
 * @param {Array} arr The array to use.
 * @returns {string} The resulting string.
 */
export function firstLast(arr) {
  // TODO: Write your code here.
  const first = arr[0]
  const last = arr[arr.length - 1]

  // Combine first and last with a hyphen
  return `${first}-${last}`
}



/**
 * Return the index of the passed item. If the item do not exist, return -1.
 * Hint: Array.indexOf()
 * 
 * @param {Array} arr The array to use.
 * @param {*} item The item so use.
 * 
 * @returns {number} The index.
 */
export function findindex(arr, item) {
  // TODO: Write your code here.

  
  for (let i = 0; i < arr.length; i++) {
    // Return the current index as soon as a strict match is found
    if (arr[i] === item) {
      return i
    }
  }

  // If the loop finishes without finding the item, return -1
  return -1
}
