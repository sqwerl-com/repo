import { CallbackType } from '@/context/application/events'
import { Thing } from '@/utils/types'

export type PropertiesRetrievedCallbackType =
  (value: { id: string, properties: { type: string }}, setThing: SetThingType) => void

export type PropertiesRetrievedEventGenerator = {
  fire: (values: { id: string, properties: { type: string }}) => void,
  register: (callback: CallbackType | PropertiesRetrievedCallbackType, setThing: SetThingType) =>
    CallbackType | PropertiesRetrievedCallbackType | null,
  unregister: (callback: PropertiesRetrievedCallbackType) => void
}

/** The type for functions that set the current thing. */
export type SetThingType = (thing: Thing | null) => void

/**
 * Data type used to keep track, and to be able to call, registered callbacks once a thing's properties have
 * been retrieved.
 */
export interface RecordType {
  callback: CallbackType | PropertiesRetrievedCallbackType,
  setThing: SetThingType
}

/**
 * Registers listeners and notifies them when a thing's properties have been retrieved from a server.
 * @constructor
 */
export const PropertiesRetrievedEvents = (callbacks: RecordType[]): PropertiesRetrievedEventGenerator => {
  return {
    fire: (values: { id: string, properties: { type: string }}) => fire(callbacks, values),
    register: (callback: CallbackType | PropertiesRetrievedCallbackType, setThing: SetThingType) =>
      register(callbacks, callback, setThing),
    unregister: (callback: PropertiesRetrievedCallbackType) => unregister(callbacks, callback)
  }
}

/**
 * Notifies listeners that an object's properties have been retrieved
 * @param callbacks Information about the registered listeners.
 * @param values An object's properties.
 */
const fire = (callbacks: RecordType[], values: { id: string, properties: { type: string }}) => {
  callbacks.forEach(record => {
    const callback = record.callback as PropertiesRetrievedCallbackType
    callback(values, record.setThing)
  })
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
const register = (
  callbacks: RecordType[],
  callback: CallbackType | PropertiesRetrievedCallbackType,
  setThing: SetThingType): CallbackType | PropertiesRetrievedCallbackType | null => {
  const isRegistered = !!callbacks.find(r => r.callback === callback)
  if (!isRegistered) {
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
const unregister = (callbacks: RecordType[], callback: PropertiesRetrievedCallbackType): void => {
  const recordIndex = callbacks.findIndex(record => record.callback === callback)
  if (recordIndex > -1) {
    callbacks.splice(recordIndex, 1)
  }
}
