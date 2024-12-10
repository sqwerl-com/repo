/**
 * Converts information into different formats.
 */

/**
 * This class' logger.
 * @type {Logger}
 */
const logger = require('sqwerl-logger').newInstance('Converter')

const valueConverter = require('./value_converter')

/**
 * Returns a JSON (JavaScript Object Notation) string that corresponds to the given object with the given unique
 * identifier.
 * @param {*} object   A resource object.
 * @return {string}    The given object as a JSON-encoded string.
 */
const asJson = (object) => {
  const methodName = 'asJson'
  const json = JSON.stringify(object)
  logger.info(methodName, `object = ${json}`)
  return json
}

/**
 * Returns an object equivalent to the given data.
 * @param {Library} library     Library of persistent things.
 * @param {String} resourceId   Unique identifier for the persistent thing that given the data represents.
 * @param {String} data         Data that defines a persistent thing.
 * @param {Object} [user]       The user requesting to retrieve an object.
 * @param {String} [userId]     Unique identifier of the user requesting to retrieve an object.
 * @return {*} An object that corresponds to the given data.
 */
const asObject = (library, resourceId, data, user, userId) => {
  const methodName = 'asObject'
  if (!library) {
    throw new Error('A non-null library is required.')
  }
  if (!library.applicationName) {
    throw new Error('The library must have a non-null, non-empty application name.')
  }
  if (!library.name) {
    throw new Error('The library must have a non-null, non-empty name.')
  }
  try {
    const result = JSON.parse(data)
    Object.keys(result).forEach(property => {
      if (user && (property === 'readBy')) {
        result.userHasRead = result[property].hasOwnProperty('<' + user.id + '>')
      }
      if (property === 'representations') {
        const representations = result.representations
        Object.keys(representations).forEach(representation => {
          if (user && userId && (!library.canRead(library, `${resourceId}/${representation}`, user, userId))) {
            delete result.representations[representation]
          }
        })
      } else {
        result[property] = convertValue(library, null, resourceId, result[property])
      }
    })
    logger.debug(methodName, result)
    return result
  } catch (error) {
    throw new Error('Syntax error detected in library "' +
      library.name +
      '", resource ID "' +
      resourceId +
      '",\ndata: "' +
      data +
      '"\nError: ' +
      error)
  }
}

/**
 * Returns an equivalent object property value.
 * @param {Library} library     Library of things that contains the given data.
 * @param [context]             Default value to return.
 * @param {String} resourceId   A resource's unique identifier.
 * @param value                 A value to convert.
 * @return {*} An equivalent value.
 */
const convertValue = (library, context, resourceId, value) => {
  if (typeof value === 'string') {
    return valueConverter.convertString(library, resourceId, value)
  } else {
    if (typeof value === 'boolean') {
      return valueConverter.convertBoolean(value)
    } else if (value instanceof Array) {
      return valueConverter.convertArray(convertValue, library, context, resourceId, value)
    } else if (value instanceof Object) {
      return valueConverter.convertObject(convertValue, library, context, resourceId, value)
    }
  }
  return context
}

/**
 * Returns a resource identifier minus its application and library paths.
 * @param {string} resourceId  A string that uniquely identifies a thing.
 * @returns {string}           A string that uniquely identifies a thing within an application and library of things.
 */
const stripApplicationAndLibrary = (resourceId) => {
  return `</${resourceId.split('/').slice(3).join('/')}`
}

/**
 * Returns the path part of a resource reference.
 * @param {String} resourceId   Reference to a resource.
 * @return {String} The path part of the given resource reference.
 */
const stripReferenceMarks = (resourceId) => {
  let endIndex = resourceId.length
  let startIndex = 0
  const trimmed = resourceId.trim()
  if (trimmed.charAt(0) === '<') {
    startIndex = 1
  }
  let i = resourceId.lastIndexOf('>')
  if (i > -1) {
    endIndex = i
  }
  return resourceId.slice(startIndex, endIndex)
}

exports.asJson = asJson
exports.asObject = asObject
exports.stripApplicationAndLibrary = stripApplicationAndLibrary
exports.stripReferenceMarks = stripReferenceMarks
