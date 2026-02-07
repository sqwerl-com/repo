import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { ChevronRight } from 'react-feather'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { RepositoryChangeDescription } from '@/utilities/types'
import ThumbnailImage, { SIZES } from '@/utilities/components/thumbnail-image.tsx'
import { useContext } from 'react'

export interface Props {
  /**
   * Defines how a thing within a repository of things has been changed.
   * For example: the thing was either modified, or added or removed from a repository of things.
   */
  change: RepositoryChangeDescription

  /** The index of this thing within the list of changes made to a repository of things. */
  index: number,

  /** URL to go to when the user selects information about changes made to a thing. */
  linkTarget?: string

  /** Display a path to the thing because the thing is nested within collections of collections. */
  showPath: boolean
}

/**
 * Renders content that identifies thing that has been changed.
 * @param props
 */
const Index = (props: Props): React.JSX.Element => {
  const { change, index, linkTarget, showPath } = props
  const context = useContext(ApplicationContext)
  const intl = useIntl()
  const wasRemoved = change.typeOfChange === 'removed'

  if (wasRemoved) {
    return renderRemoved(change, index, showPath)
  } else {
    if (showPath) {
      return renderWithPath(change, index, linkTarget)
    }

    return renderChange(context, intl, change, index, linkTarget, showPath)
  }
}

/**
 * Renders a path to a thing that has been changed.
 * @param change Defines how a thing within a repository of things was changed.
 */
const pathContent = (change: RepositoryChangeDescription): React.JSX.Element[] => {
  const components = change.path.split('/')
  const startPathIndex = 3 // Skip over root -> types -> categories in the path.
  const path = components.slice(startPathIndex, components.length - 1)

  return path.map((pathItem, index) => {
    return (
      <span key={`repository-change-${change.date}-${index}`}>
        {pathItem}
        {index < (path.length - 1) ? <ChevronRight className='sqwerl-path-separator' /> : ''}
      </span>
    )
  })
}

/**
 * Renders a thing that has been removed (deleted) from a repository of things.
 * @param change Defines how a thing within a repository of things was changed.
 * @param index The index of this thing within the list of changes made to a repository of things.
 * @param showPath Display a path to the thing because the thing is nested within collections of collections.
 */
const renderRemoved = (change: RepositoryChangeDescription, index: number, showPath: boolean): React.JSX.Element => {
  if (showPath) {
    return renderRemovedWithPath(change, index)
  }

  return (
    <td className={`sqwerl-repository-changes-by-day-table-name-column ${showPath ? 'multiline' : ''}`}>
      <span key={index}>
        <div className='sqwerl-repository-changes-by-day-table-name-title-removed sqwerl-navigation-item-title-text'>
          <s><span className='sqwerl-repository-changes-by-day-details-name-text'>{change.name}</span></s>
        </div>
      </span>
    </td>
  )
}

/**
 * Renders information that identifies a thing that has been removed from a repository where the thing was
 * a member of a collection of things.
 * @param change Defines how a thing within a repository of things was changed.
 * @param index The index of this thing within the list of changes made to a repository of things.
 */
const renderRemovedWithPath = (change: RepositoryChangeDescription, index: number) => {
  return (
    <td className='sqwerl-repository-changes-by-day-table-name-column'>
        <span key={index}>
          <div className='sqwerl-repository-changes-by-day-table-name-title-removed'>
            <s><span className='sqwerl-repository-changes-by-day-details-name-text'>{change.name}</span></s>
          </div>
          <div className='sqwerl-changes-by-day-collection-path'>{pathContent(change)}</div>
        </span>
    </td>
  )
}

/**
 * Renders information that identifies a thing that has been changed (altered).
 * @param context This application's context
 * @param intl Internationalization settings.
 * @param change Defines how a thing within a repository of things was changed.
 * @param index The index of this thing within the list of changes made to a repository of things.
 * @param linkTarget URL to go to when the user selects information about changes made to a thing.
 * @param showPath Display a path to the thing because the thing is nested within collections of collections.
 */
const renderChange = (
  context: ApplicationContextType,
  intl: IntlShape,
  change: RepositoryChangeDescription,
  index: number,
  linkTarget: string | undefined,
  showPath: boolean
) => {
  return (
    <>
    {/*
    <td className={`sqwerl-repository-changes-by-day-table-name-column ${showPath ? 'multiline' : ''}`}>
      <div className="sqwerl-repository-changes-by-day-table-name-text">
        <span className="sqwerl-repository-changes-by-day-table-name-link" key={index}>
            {(linkTarget !== undefined) &&
              <Link className="sqwerl-repository-changes-by-day-table-name-title" to={linkTarget}>
                <span className="sqwerl-repository-changes-by-day-details-name-text">{change.name}</span>
              </Link>}
          {(linkTarget === undefined) &&
            <div className="sqwerl-repository-changes-by-day-table-name-title">
              <span className="sqwerl-repository-changes-by-day-details-name-text">{change.name}</span>
            </div>}
        </span>
        <span><div className='sqwerl-navigation-item-type-name'>{typeDescription(context, intl, change.typeId)}</div></span>
        <div className='sqwerl-navigation-item-icon'>
          <ThumbnailImage depictable={change} size={SIZES.medium} />
        </div>
      </div>
    </td>
    */}
    </>
  )
}

/**
 * Renders information that names a thing that has been changed and includes the thing's path (id).
 * @param change Defines how a thing within a repository of things was changed.
 * @param index The index of this thing within the list of changes made to a repository of things.
 * @param linkTarget URL to go to when the user selects information about changes made to a thing.
 */
const renderWithPath = (change: RepositoryChangeDescription, index: number, linkTarget: string | undefined) => {
  return(
    <td className='sqwerl-repository-changes-by-day-table-name-column multiline'>
      <span key={index}>
        {(linkTarget !== undefined) &&
          <Link className='sqwerl-repository-changes-by-day-table-name-title' to={linkTarget}>
            <span className='sqwerl-properties-table-name-text'>{change.name}</span>
          </Link>}
        {(linkTarget === undefined) &&
          <div className='sqwerl-repository-changes-by-day-table-name-title'>
            <span className='sqwerl-properties-table-name-text'>{change.name}</span>
          </div>}
        <div className='sqwerl-changes-by-day-collection-path'>{pathContent(change)}</div>
      </span>
    </td>
  )
}

const typeDescription = (context: ApplicationContextType, intl: IntlShape, typeId: string) => {
  return context.typeNameToTypeDescription(intl, context.typeIdToTypeName(typeId))
}

export default Index
