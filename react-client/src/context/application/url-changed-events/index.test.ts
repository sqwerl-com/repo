import UrlChangedEvents from 'context/application/url-changed-events'

it('Firing url changed events', () => {
  const PATH_NAME = 'test_path'
  const HASH = 'test_hash'
  const events = UrlChangedEvents()
  const callback = (newPath: string, newHash: string) => {
    expect(newPath).toEqual(PATH_NAME)
    expect(newHash).toEqual(HASH)
  }
  events.register(callback)
  events.fire(PATH_NAME, HASH)
})
