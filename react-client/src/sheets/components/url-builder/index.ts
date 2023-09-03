/**
 *
 * @param path
 * @param setPath
 * @constructor
 */
const UrlBuilder = (path: String, setPath: Function): void => {
  // TODO - Traverse to the given path.
  let id = ''
  const pathComponents: Array<{ id: string, name: string }> = []
  const elements = path.split('/')
  if (elements.length > 1) {
    const components = elements.slice(1, elements.length - 1)
    components.forEach((component) => {
      id += ('/' + component)
      pathComponents.push({ id, name: component })
    })
  }
  setPath(pathComponents)
}

export default UrlBuilder
