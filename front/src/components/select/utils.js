/**
 * Generates the random string.
 *
 * @param {number} length - Length of the generated string
 *
 * @returns {string}
 */
export const generateRandomString = (length = 12) => {
  let result = []
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  for (let i = 1; i <= length; i++) {
    result = [...result, chars.charAt(Math.floor(Math.random() * chars.length))]
  }

  return result.join('')
}