import { CallbackType, EventGenerator, Events } from '@/context/application/events'

/**
 * Registers listeners and notifies them when the user selects a thing.
 */
export const SelectThingEvents = (): EventGenerator => {
  const { callbacks, register, unregister } = Events([])

  return {
    fire: (newPath: string, newHash?: string) => fire(callbacks, newPath, newHash),
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
const fire = (callbacks: CallbackType[], newPath: string, newHash?: string) => {
  if (callbacks && (callbacks.length > 0)) {
    callbacks.forEach(callback => {
      callback(newPath, newHash)
    })
  }
}
