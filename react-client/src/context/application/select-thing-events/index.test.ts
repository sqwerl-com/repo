import SelectThingEvents from 'context/application/select-thing-events'

it('Firing thing selected events', () => {
  const PATH_NAME = 'test_path'
  const HASH = 'test_hash'
  const events = SelectThingEvents()
  const callback = (newPath: string, newHash: string) => {
    expect(newPath).toEqual(PATH_NAME)
    expect(newHash).toEqual(HASH)
  }
  events.register(callback)
  events.fire(PATH_NAME, HASH)
})
