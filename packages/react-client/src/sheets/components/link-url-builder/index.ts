import { ApplicationContextType } from '@/context/application'

/**
 * Returns a URL that refers to a thing.
 * @param context An application's contextual information.
 * @param applicationName The name of the application that manages the referenced thing.
 * @param repositoryName The name of the repository of things that the referenced thing is contained within.
 * @param id A thing's unique identifier (unique within a repository of things).
 * @param type The unique identifier of the referenced thing's type.
 * @constructor
 */
const LinkUrlBuilder = (
  context: ApplicationContextType,
  applicationName: string,
  repositoryName: string,
  id: string,
  type: string): string => {
  return `${context.parentThingIdToHref(repositoryName, type)}#/${applicationName}/${repositoryName}` +
    `${context.encodeUriReplaceStringsWithHyphens(id)}`
}

export default LinkUrlBuilder
