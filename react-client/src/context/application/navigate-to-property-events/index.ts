import Events, { EventGenerator } from 'context/application/events'

/**
 * Registers listeners and notifies them when the user has navigated to one of a thing's properties.
 * @constructor
 */
const NavigateToPropertyEvents = (): EventGenerator => {
  const { callbacks, register, unregister } = Events([])
  return {
    fire: (newPath: string, newHash: string, newProperty: string) => fire(callbacks, newPath, newHash, newProperty),
    register,
    unregister
  }
}

/**
 * Notifies listeners that the user has navigated to a thing's property.
 * @param callbacks Functions to call.
 * @param newPath The path part of the URL that identifies a thing.
 * @param newHash The hash part of a URL that identifies a thing.
 * @param newProperty The name of the property of a thing.
 */
const fire = (
  callbacks: Array<(newPath: string, newHash: string, newProperty: string) => void>,
  newPath: string,
  newHash: string,
  newProperty: string) => {
  callbacks.forEach(callback => callback(newPath, newHash, newProperty))
}

export default NavigateToPropertyEvents
