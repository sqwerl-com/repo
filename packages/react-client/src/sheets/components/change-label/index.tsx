import { ChevronRight } from 'react-feather'
import { Link } from 'react-router-dom'
import { RepositoryChangeDescription } from '@/utils/types'
import SmallThumbnailImage from '@/utils/components/small-thumbnail-image.tsx'
import * as React from 'react'

interface Props {
  change: RepositoryChangeDescription
  index: number
  isLinkToCollection: boolean
  linkTarget?: string

  /** Display a path to the thing because the thing is nested within collections of collections. */
  showPath: boolean
}

/**
 * Renders content that contains the name of a thing that has been changed.
 * @param props
 * @constructor
 */
const Index = (props: Props): React.JSX.Element => {
  const { change, index, linkTarget, showPath } = props
  const wasRemoved = change.typeOfChange === 'removed'

  if (wasRemoved) {
    return renderRemoved(props)
  } else {
    if (showPath) {
      return (
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

    return (
      <td className={`sqwerl-repository-changes-by-day-table-name-column ${showPath ? 'multiline' : ''}`}>
        <div className='sqwerl-repository-changes-by-day-table-name-text'>
          <span className='sqwerl-repository-changes-by-day-table-name-link' key={index}>
            {(linkTarget !== undefined) &&
              <Link className='sqwerl-repository-changes-by-day-table-name-title' to={linkTarget}>
                <span className='sqwerl-repository-changes-by-day-details-name-text'>{change.name}</span>
              </Link>}
            {(linkTarget === undefined) &&
              <div className='sqwerl-repository-changes-by-day-table-name-title'>
                <span className='sqwerl-repository-changes-by-day-details-name-text'>{change.name}</span>
              </div>}
          </span>
          <SmallThumbnailImage depictable={change} />
        </div>
      </td>
    )
  }
}

/**
 * Renders a path to a thing that has been changed.
 * @param change
 */
const pathContent = (change: RepositoryChangeDescription): React.JSX.Element[] => {
  const components = change.path.split('/')
  const startPathIndex = 3 // Skip over root -> types -> categories in the path.
  const path = components.slice(startPathIndex, components.length - 1)

  return path.map((pathItem, index) => {
    return (
      <span key={index}>
        {pathItem}
        {index < (path.length - 1) ? <ChevronRight className='sqwerl-path-separator' /> : ''}
      </span>
    )
  })
}

/**
 * Renders a thing that has been removed (deleted).
 * @param props
 */
const renderRemoved = (props: Props): React.JSX.Element => {
  const { change, index, showPath } = props

  if (showPath) {
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

export default Index
