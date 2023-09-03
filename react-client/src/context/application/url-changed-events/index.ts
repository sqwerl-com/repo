import Events, { EventGenerator } from 'context/application/events'

/**
 * Registers listeners and notifies them when the URL in the browser's address bar changes.
 * @constructor
 */
const UrlChangedEvents = (): EventGenerator => {
  const { callbacks, register, unregister } = Events([])
  return {
    fire: (lastUrl: string, newUrl: string) => fire(callbacks, lastUrl, newUrl),
    register,
    unregister
  }
}

/**
 * Notifies listeners that the URL in the browser's address bar has changed.
 * @param callbacks Functions to call.
 * @param lastUrl The URL before it was changed.
 * @param newUrl The current URL after it was changed.
 */
const fire = (callbacks: Array<(lastUrl: string, newUrl: string) => void>, lastUrl: string, newUrl: string) => {
  callbacks.forEach(callback => callback(lastUrl, newUrl))
}

export default UrlChangedEvents
