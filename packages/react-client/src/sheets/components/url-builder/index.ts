export interface PathComponent {
  id: string
  name: string
}

/**
 * Builds a URL from a path to a thing within a repository.
 * @param path A path to where a thing is located within a repository.
 * @param setPath Sets a thing's path as a list of the path's components (positions within a repository).
 */
const UrlBuilder = (path: string, setPath: (components: Array<PathComponent>) => void): void => {
  // TODO - Traverse to the given path.
  let id = ''
  const pathComponents: Array<PathComponent> = []
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
