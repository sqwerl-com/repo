const logger = require('sqwerl-logger').newInstance('ValueConverter')

/**
 * Converts primitive values to equivalent values that describe persistent things.
 */

/**
 * Converts the given array values to equivalent values.
 *
 * @param {function} converter  Converts an array's values.
 * @param {Library} library     Library that contains the given values.
 * @param [context]             Default value to return.
 * @param {String} resourceId   A resource's unique identifier.
 * @param values                Values to convert.
 * @returns {array}             An array that contains the converted values.
 */
convertArray = (converter, library, context, resourceId, values) => {
  const methodName = 'convertArray'
  logger.debug(methodName, 'Converted array values.')
  return values.map(value => converter(library, context, resourceId, value))
}

/**
 * Converts the given boolean (true/false) value to an equivalent value.
 * @param flag        A boolean value.
 * @returns {Boolean} A value equivalent to the given boolean value.
 */
const convertBoolean = (flag) => {
  const methodName = 'convertBoolean'
  let result = Boolean(flag)
  logger.debug(methodName, 'boolean value "' + flag + '" converted to "' + result + '"')
  return result
}

/**
 * Converts a given object's properties to equivalent values.
 * @param {function} converter  Converts an object's properties.
 * @param {Library} library     Library of things that contains the given object.
 * @param [context]             Default value to return.
 * @param {string} resourceId   A resource's unique identifier.
 * @param {object} value        An object whose properties should be converted.
 * @returns {object}            An object whose properties have been converted to equivalent values.
 */
const convertObject = (converter, library, context, resourceId, value) => {
  const methodName = 'convertObject'
  const object = {}
  logger.debug(methodName, 'Converting object value...')
  Object.keys(value).forEach(function (property) {
    const propertyName = converter(library, context, resourceId, property)
    object[propertyName] = value[property]
    logger.debug(methodName, 'property: "' + propertyName + '" = "' + value[property] + '"')
  })
  return object
}

/**
 * Converts a given string value to an equivalent value.
 * @param {Library} library     Library of things that contains the given string.
 * @param {string} resourceId   A resource's unique identifier.
 * @param {string} value        A string value to convert.
 * @returns {string}            A string equivalent to the given string.
 */
const convertString = (library, resourceId, value) => {
  const methodName = 'convertString'
  if (value && (value.length > 0)) {
    let buffer
    const trimmedValue = value ? value.trim() : ''
    if (trimmedValue.charAt(0) === '<') {
      buffer = `</'${library.applicationName}/${library.name}`
      if (trimmedValue.charAt(1) === '/') {
        // Absolute path.
        buffer += encodeURI(value.substring(1, trimmedValue.length - 1))
      } else {
        // Relative path.
        buffer += encodeURI(resourceId + '/' + trimmedValue.substring(1, trimmedValue.length - 1))
      }
      buffer += '>'
      logger.debug(methodName, 'string value "' + value + '", converted to "' + buffer + '"')
      return buffer
    }
  }
  logger.debug(methodName, 'string value "' + value + '", converted to "' + value + '"')
  return value
}

exports.convertArray = convertArray
exports.convertBoolean = convertBoolean
exports.convertObject = convertObject
exports.convertString = convertString
