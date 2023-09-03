/**
 * Checks if a resource ID contains invalid characters.
 */

const logger = require('sqwerl-logger').newInstance('Resource')

/**
 * Is a given resource ID valid?
 * @param {String} [resourceId]   A persistent object's unique identifier or null.
 * @return {Boolean} false if the given resource identifier contains illegal characters.
 */
const isValidResourceId = (resourceId) => {
  let isValid = true
  const methodName = 'isValidResourceId'
  logger.debug(methodName, 'Checking validity of resource ID "' + resourceId + '"')
  if (resourceId) {
    let idLength = resourceId.length
    for (let i = 0; isValid && (i < idLength); i += 1) {
      let c = resourceId[i]
      switch (c) {
        case '.':
          isValid = !moreThanOnePeriodInSequence(resourceId, i, idLength)
          break
        case '$':
        case '~':
        case '#':
        case ':':
        case ';':
        case '\\':
        case '%':
        case '|':
        case '{':
        case '}':
        case '`':
        case '\'':
        case '"':
        case '+':
        case '!':
        case '@':
        case '^':
        case '&':
        case '*':
        case '=':
        case '[':
        case ']':
        case ',':
        case '?':
        case '<':
        case '>':
        case '-':
          isValid = false
          break
      }
    }
  } else {
    isValid = false
  }
  logger.debug(methodName, 'The resource "' + resourceId + '" ' + (isValid ? 'is' : 'isn\'t') + ' valid')
  return isValid
}

/**
 * Does a given resource id contain more than one period in sequence?
 * @param {string} resourceId   A thing's unique identifier.
 * @param {number} index  Index within the given resource to start looking for periods at.
 * @param {number} idLength Length, in characters, of the given resource id.
 * @return {boolean} true If the given resource contains two or more consecutive periods.
 */
const moreThanOnePeriodInSequence = (resourceId, index, idLength) => {
  return ((index < idLength - 1) && (resourceId[index + 1] === '.'))
}

exports.isValidResourceId = isValidResourceId
