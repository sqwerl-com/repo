export type CallbackType = (newPath: string, newHash: string, newProperty?: string) => void

export interface EventGenerator {
  fire: Function
  register: Function
  unregister: Function
}

export interface EventsType {
  callbacks: CallbackType[]
  register: (callback: CallbackType) => CallbackType | null
  unregister: (callback: CallbackType) => void
}

/**
 * Returns an event notifier.
 * @constructor
 */
const Events = (callbacks: CallbackType[]): EventsType => {
  return {
    callbacks,
    register: (callback: CallbackType): CallbackType | null => register(callbacks, callback),
    unregister: (callback: CallbackType): void => unregister(callbacks, callback)
  }
}

/**
 * Registers a function to call when an event occurs.
 * @param callbacks Array of functions to call.
 * @param callback  Function to call.
 * @returns The given callback function, or null if no callback function was provided.
 * @see #unregister
 */
const register = (callbacks: CallbackType[], callback: CallbackType): CallbackType | null => {
  if (!callbacks.includes(callback)) {
    callbacks.push(callback)
    return callback
  }
  return null
}

/**
 * Removes a given function from the list of functions to call when an event occurs.
 * @param callbacks Array of functions to call.
 * @param callback A function to remove from the list of callbacks.
 * @see #register
 */
const unregister = (callbacks: CallbackType[], callback: CallbackType): void => {
  const index = callbacks.indexOf(callback)
  if (index >= 0) {
    callbacks.splice(index, 1)
  }
}

export default Events
