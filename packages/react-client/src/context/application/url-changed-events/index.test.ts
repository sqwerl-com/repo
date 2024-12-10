import { CallbackType } from '@/context/application/events'
import { expect, it } from 'vitest'
import UrlChangedEvents from '@/context/application/url-changed-events'

it('Firing url changed events', () => {
  const PATH_NAME = 'test_path'
  const HASH = 'test_hash'
  const events = UrlChangedEvents()
  const callback: CallbackType = (newPath: string, newHash?: string) => {
    expect(newPath).toEqual(PATH_NAME)
    expect(newHash).toEqual(HASH)
  }

  events.register(callback)
  events.fire(PATH_NAME, HASH)
})
