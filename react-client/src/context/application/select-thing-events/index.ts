import Events, { EventGenerator } from 'context/application/events'

/**
 * Registers listeners and notifies them when the user selects a thing.
 * @constructor
 */
const SelectThingEvents = (): EventGenerator => {
  const { callbacks, register, unregister } = Events([])
  return {
    fire: (newPath: string, newHash: string) => fire(callbacks, newPath, newHash),
    register,
    unregister
  }
}

/**
 * Notifies listeners that the user has selected a thing.
 * @param callbacks Functions to call.
 * @param newPath The path part of the URL that identifies a thing.
 * @param newHash The hash part of a URL that identifies a thing.
 */
const fire = (callbacks: Array<(newPath: string, newHash: string) => void>, newPath: string, newHash: string) => {
  if (callbacks && (callbacks.length > 0)) {
    callbacks.forEach(callback => {
      callback(newPath, newHash)
    })
  }
}

export default SelectThingEvents
