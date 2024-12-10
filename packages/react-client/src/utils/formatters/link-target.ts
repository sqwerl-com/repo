import { ConfigurationType } from '@/configuration'
import { ApplicationContextType } from '@/context/application'

/**
 * Returns the value of an href attribute of an anchor tag that refers to a collection of things.
 * @param id Unique identifier of a collection of things.
 * @param configuration Application configuration information.
 * @param context Application context.
 * @param currentRepositoryName The name of the repository of things this applications is currently displaying.
 */
export const linkTargetToCollection = (
  id: string, configuration: ConfigurationType, context: ApplicationContextType, currentRepositoryName: string) => {
  return context.encodeUriReplaceStringsWithHyphens(`/${currentRepositoryName}${id}`) +
    `#/${configuration.applicationName}/${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(id)}`
}

/**
 * Returns the value of a href attribute of an anchor tag that refers to a thing.
 * @param id Unique identifier of a collection of things.
 * @param configuration Application configuration information.
 * @param context Application context.
 * @param currentRepositoryName The name of the repository of things this applications is currently displaying.
 */
export const linkTargetToLeaf = (
  id: string, configuration: ConfigurationType, context: ApplicationContextType, currentRepositoryName: string) => {
  const components = id.split('/')
  const path = components.slice(0, components.length - 1).join('/')
   return context.encodeUriReplaceStringsWithHyphens(`/${currentRepositoryName}${path}`) +
    `#/${configuration.applicationName}/${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(id)}`
}
