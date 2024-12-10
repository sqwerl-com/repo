import Bun from 'bun'
import Logger from '@sqwerl-repo/logger'

/**
 * Defines an application configuration value.
 */
interface PropertyType {
  /** An application configuration property's default value, expressed as a string. */
  defaultValue?: string

  /**
   * Is an application configuration property required? If required then an error is raised when an
   * application configuration doesn't assign a value to a required property.
   */
  isRequired?: boolean

  /** A message to output when a required application configuration property has not been assigned a value. */
  missingError?: string

  /** An application configuration property's name. Each name within an application configuration must be unique. */
  name: string
}

const _logger = Logger('configuration', 'info')

/**
 * Initializes an object's properties with an application's configuration values.
 * @param configuration Object whose properties contain values for an application's configuration.
 * @param properties Definitions for object properties that hold an application's configuration.
 */
const ApplicationConfiguration = (configuration: any, properties?: PropertyType[]): any => {
  const targetConfiguration = {}
  if (properties !== undefined) {
    _initialize(configuration, targetConfiguration, properties)
  }
  return targetConfiguration
}

/**
 * Throws an exception if the given file name is empty.
 * @param filename The name of a JSON file that contains an application's configuration.
 */
const checkFilename = (filename: string): void => {
  if (filename.length === 0) {
    throw new Error(`Missing configuration file name. The name of a valid JSON file is required.`)
  }
}

/**
 * Initializes an application's configuration.
 * @param sourceConfiguration An object whose properties are an application's configuration.
 * @param targetConfiguration An application's configuration information.
 * @param properties Define the properties of the source configuration that define an application' configuration.
 */
const _initialize = (sourceConfiguration: any, targetConfiguration: any, properties?: PropertyType[]) => {
  _logger.info(_initialize, 'Initializing application configuration')
  if (properties !== undefined) {
    properties.forEach(property => {
      targetConfiguration[property.name] =
        (property.isRequired === true)
          ? _initializeRequiredConfigurationValue(sourceConfiguration, property.name, property.missingError)
          : (sourceConfiguration[property.name] || property.defaultValue)
    })
  }
}

/**
 * Initializes a required application configuration value. Throws an error if the given configuration doesn't
 * assign the property with the given name a value.
 * @param configuration JavaScript object whose properties contains values for configuring an application.
 * @param propertyName The name of a required application configuration property.
 * @param missingError Error message to output if property with the given name has not been assigned a value in the
 * given configuration.
 * @return The value of the given configuration object's property with the given name.
 */
const _initializeRequiredConfigurationValue = (configuration: any, propertyName: string, missingError?: string) => {
  const value = configuration[propertyName]
  if ((value !== undefined) && (value.length === 0)) {
    throw new Error(
      missingError === undefined ? `Application configuration value "${propertyName}" is required` : missingError)
  }
  return value
}

/**
 * Loads an application's configuration from a JSON file.
 * @param filename The name of a JSON file.
 * @param properties Definitions for object properties that hold an application's configuration.
 * @return An object that contains an application's configuration.
 */
export const loadFromFile = async (filename: string, properties: PropertyType[]): Promise<any> => {
  checkFilename(filename)
  _logger.info(
    loadFromFile, `Reading configuration file "${filename}" from current working directory "${process.cwd}"...`)
  const configurationFile = Bun.file(filename)
  return new Promise(() => {
    return configurationFile.text().then((text) => ApplicationConfiguration(text, properties))
  })
}

/**
 * Loads an application's configuration information from a given object.
 * @param object An object that provides an application's configuration information.
 * @param properties Definitions for object properties that hold an application's configuration.
 * @return An object that contains an application's configuration.
 */
export const loadFromObject = (object: any, properties: PropertyType[]) => {
  return ApplicationConfiguration(object, properties)
}
