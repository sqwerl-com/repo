import { ApplicationContextType } from 'context/application'

/**
 * Returns a URL that refers to a thing.
 * @param context An application's contextual information.
 * @param applicationName The name of the application that manages the referenced thing.
 * @param libraryName The name of the library of things that the referenced thing is contained within.
 * @param id A thing's unique identifier (unique within a library of things).
 * @param type The unique identifier of the referenced thing's type.
 * @constructor
 */
const LinkUrlBuilder = (
  context: ApplicationContextType,
  applicationName: string,
  libraryName: string,
  id: string,
  type: string): string => {
  return `${context.parentThingIdToHref(type)}#/${applicationName}/${libraryName}` +
    `${context.encodeUriReplaceStringsWithHyphens(id)}`
}

export default LinkUrlBuilder
