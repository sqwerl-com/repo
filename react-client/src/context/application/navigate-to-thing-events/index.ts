import Events, { EventGenerator } from 'context/application/events'

/**
 * Registers listeners and notifies them when the user has navigated to a thing.
 * @constructor
 */
const NavigateToThingEvents = (): EventGenerator => {
  const { callbacks, register, unregister } = Events([])
  return {
    fire: (newPath: string, newHash: string) => fire(callbacks, newPath, newHash),
    register,
    unregister
  }
}

/**
 * Notifies listeners that a user has navigated to a thing.
 * @param callbacks Functions to call.
 * @param newPath The path part of the URL that identifies a thing.
 * @param newHash The hash part of a URL that identifies a thing.
 */
const fire = (
  callbacks: Array<(newPath: string, newHash: string, newProperty?: string) => void>,
  newPath: string,
  newHash: string) => {
  callbacks.forEach(callback => callback(newPath, newHash))
}

export default NavigateToThingEvents
