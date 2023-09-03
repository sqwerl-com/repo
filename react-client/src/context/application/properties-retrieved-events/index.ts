import { EventGenerator } from 'context/application/events'

/** The type for functions that set the current thing. */
export type SetThingType = (thing: any) => void

/** The type for functions called when a thing's properties are retrieved from a server. */
export type CallbackType = (value: Object, setThing: SetThingType) => void

/**
 * Data type used to keep track, and to be able to call, registered callbacks once a thing's properties have
 * been retrieved.
 */
export interface RecordType {
  callback: (value: Object, setThing: (thing: any) => void) => void
  setThing: (thing: any) => void
}

/**
 * Registers listeners and notifies them when a thing's properties have been retrieved from a server.
 * @constructor
 */
const PropertiesRetrievedEvents = (callbacks: RecordType[]): EventGenerator => {
  return {
    fire: (values: Object) => fire(callbacks, values),
    register: (callback: CallbackType, setThing: SetThingType) => register(callbacks, callback, setThing),
    unregister: (callback: CallbackType) => unregister(callbacks, callback)
  }
}

/**
 * Notifies listeners that an object's properties have been retrieved
 * @param callbacks Information about the registered listeners.
 * @param values An object's properties.
 */
const fire = (callbacks: RecordType[], values: Object) => {
  callbacks.forEach(record => record.callback(values, record.setThing))
}

/**
 * Registers a function to call when this application has retrieved a thing's properties.
 * param {RecordType[]} callbacks
 * @param callbacks Registered listener information.
 * @param callback  Function to call.
 * @param setThing Function to set the currently selected thing.
 * @returns The given callback function, or null if no callback function was provided.
 * @see #unregister
 */
const register = (callbacks: RecordType[], callback: CallbackType, setThing: SetThingType) => {
  if (callbacks.find(r => r.callback === callback) == null) {
    if (typeof callback === 'function') {
      callbacks.push({ callback, setThing })
    }
    return callback
  }
  return null
}

/**
 * Removes a given function from this application's list of functions to call when a thing's properties have been
 * retrieved.
 * @param callbacks
 * @param callback  A function to remove from the list of callbacks.
 * @see #register
 */
const unregister = (callbacks: RecordType[], callback: CallbackType) => {
  const recordIndex = callbacks.findIndex(record => record.callback === callback)
  if (recordIndex > -1) {
    callbacks.splice(recordIndex, 1)
  }
}

export default PropertiesRetrievedEvents
