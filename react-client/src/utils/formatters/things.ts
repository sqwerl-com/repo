/**
 * When displaying a thing with the given id, should we show a path to the thing? We often want to show the path
 * to a thing when the thing is contained within a collection of things that is itself contained within a collection
 * of things.
 * @param id  A thing's unique identifier.
 */
const shouldShowPath = (id: string) => {
  return id ? id.split('/').length > 4 : false
}

export default shouldShowPath
