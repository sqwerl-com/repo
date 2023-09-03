import PropertiesRetrievedEvents, { RecordType, SetThingType } from 'context/application/properties-retrieved-events'

it('Add and remove callbacks', () => {
  const TEST_VALUE = { test: 'value' }
  const TEST_SET_THING = (thing: any) => {
    expect(thing).toEqual(TEST_VALUE)
  }
  const callback = (value: Object, setThing: SetThingType) => {
    expect(value).toEqual(TEST_VALUE)
    expect(setThing).toEqual(TEST_SET_THING)
  }
  const callbacks: RecordType[] = []
  const events = PropertiesRetrievedEvents(callbacks)
  expect(callbacks.length).toEqual(0)
  expect(events.register(callback, TEST_SET_THING)).toEqual(callback)
  expect(events.register(callback, TEST_SET_THING)).toEqual(null)
  expect(callbacks.length).toEqual(1)
  events.fire(TEST_VALUE)
  events.unregister(callback)
  events.unregister(callback)
  expect(callbacks.length).toEqual(0)
})
