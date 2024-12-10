import Events, { CallbackType } from '@/context/application/events'
import { expect, it, vi } from 'vitest'

it('Add and remove callbacks', () => {
  const callback = vi.fn()
  const callbacks: CallbackType[] = []
  const events = Events(callbacks)

  expect(callbacks.length).toEqual(0)
  expect(events.register(callback)).toEqual(callback)
  expect(events.register(callback)).toEqual(null)
  expect(callbacks.length).toEqual(1)
  events.unregister(callback)
  events.unregister(callback)
  expect(callbacks.length).toEqual(0)
})
