/**
 * Maps unique identifiers for types of things to the names to display to represent those types.
 * TODO - The set of types of things needs to be queried from the server. Mappings from type of thing to the
 * text used to represent that type should come from an application's configuration, and need to handle
 * internationalization and localization.
 */
const typeIdsToNames: Map<string, string> = new Map([
  ['/types', 'Type'],
  ['/types/accounts', 'Account'],
  ['/types/articles', 'Article'],
  ['/types/authors', 'Author'],
  ['/types/books', 'Book'],
  ['/types/capabilities', 'Capability'],
  ['/types/collections/projects', 'Project'],
  ['/types/collections', 'Collection'],
  ['/types/content', 'Content'],
  ['/types/contributors', 'Contributor'],
  ['/types/courses', 'Course'],
  ['/types/documents', 'Document'],
  ['/types/facets', 'Facet'],
  ['/types/facets/authored', 'Authored'],
  ['/types/facets/collectable', 'Collectable'],
  ['/types/facets/depictable', 'Depictable'],
  ['/types/facets/linkable', 'Linkable'],
  ['/types/facets/notable', 'Notable'],
  ['/types/facets/readable', 'Readable'],
  ['/types/facets/recommendable', 'Recommendable'],
  ['/types/facets/tagged', 'Tagged'],
  ['/types/facets/titled', 'Titled'],
  ['/types/facets/viewable', 'Viewable'],
  ['/types/feeds', 'Feed'],
  ['/types/notes', 'Notes'],
  ['/types/pictures', 'Picture'],
  ['/types/podcasts', 'Podcast'],
  ['/types/repositories', 'Repository'],
  ['/types/roles', 'Role'],
  ['/types/tags', 'Tag'],
  ['/types/talks', 'Talk'],
  ['/types/teams', 'Team'],
  ['/types/videos', 'Video'],
  ['/types/views', 'View'],
  ['/types/webPages', 'Web page']
])

export const encodeUriReplaceStringsWithHyphens = (path: string): string => {
  return encodeURI(path).replace(/%20/g, '-').replace(/\./g, '')
}

/**
 * Returns a string that is a Universal Resource Locator (URL) that refers to a thing that has children.
 * @param repositoryName The name of the repository of things that contains the thing with the given id.
 * @param thingId  Unique identifier for a thing that has children.
 * @returns A URL of a thing that has child things.
 */
export const parentThingIdToHref = (repositoryName: string, thingId: string): string => {
  const components = thingId.split('/')
  // TODO - get the app value from configuration.
  const path = components.slice(0, components.length).join('/')
  return `${encodeUriReplaceStringsWithHyphens(repositoryName)}${encodeUriReplaceStringsWithHyphens(path)}`
}

/**
 * Returns a string that is a Universal Resource Locator (URL) that refers to a thing that doesn't have any children.
 * @param thingId  A thing's unique identifier.
 * @returns The given thing's URL.
 */
export const thingIdToHref = (thingId: string): string => {
  const components = thingId.split('/')
  const path = components.slice(0, components.length - 1).join('/')
  return encodeUriReplaceStringsWithHyphens(`${path}#${components[components.length - 1]}`)
}

export const typeIdToTypeName = (typeId: string): string => {
  /* TODO - Internationalize */
  const name = typeIdsToNames.get(typeId)
  return name || 'Thing'
}
