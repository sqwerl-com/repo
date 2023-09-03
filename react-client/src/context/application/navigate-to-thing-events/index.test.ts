import NavigateToThingEvents from 'context/application/navigate-to-thing-events'

it('Firing navigate to thing events', () => {
  const PATH_NAME = 'test_path'
  const HASH = 'test_hash'
  const events = NavigateToThingEvents()
  const callback = (newPath: string, newHash: string) => {
    expect(newPath).toEqual(PATH_NAME)
    expect(newHash).toEqual(HASH)
  }
  events.register(callback)
  events.fire(PATH_NAME, HASH)
})
