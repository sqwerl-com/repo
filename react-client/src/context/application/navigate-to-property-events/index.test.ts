import NavigateToPropertyEvents from 'context/application/navigate-to-property-events'

it('Firing navigate to property events', () => {
  const PATH_NAME = 'test_path'
  const HASH = 'test_hash'
  const PROPERTY = 'test'
  const events = NavigateToPropertyEvents()
  const callback = (newPath: string, newHash: string, property: String) => {
    expect(newPath).toEqual(PATH_NAME)
    expect(newHash).toEqual(HASH)
    expect(property).toEqual(PROPERTY)
  }
  events.register(callback)
  events.fire(PATH_NAME, HASH, PROPERTY)
})
