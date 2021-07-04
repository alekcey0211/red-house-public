/**
 * Получаем текст сообщения с генерированным цветом.
 * 
 * @param {string} string
 * @returns {string}
 */
export const getMessageText = string => {
  let hexCount = 0;

  for (let i = 0; i < string.length; i++) {
    if (i + 1 !== string.length && string[i] === "#" && string[i + 1] === "{") {
      const hex = string.substring(i + 2, i + 8)

      hexCount++
      string =
        string.substring(0, i) +
        `<span style="color: #${hex};">` +
        string.substring(i + 9, string.length)
    }
  }

  for (let i = 0; i < hexCount; i++) {
    string += "</span>"
  }

  return string
}

/**
 * Определяет, является ли строка HTML иньекцией.
 * 
 * @param {string} string 
 * @returns {bool}
 */
export const isHTML = string => {
  const doc = new DOMParser().parseFromString(string, "text/html")

  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1)
}