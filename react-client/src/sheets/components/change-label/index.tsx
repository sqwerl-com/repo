import { ChevronRight } from 'react-feather'
import { LibraryChangeDescription } from 'utils/types'
import { Link } from 'react-router-dom'
import * as React from 'react'

interface Props {
  change: LibraryChangeDescription
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
        <td className='sqwerl-library-changes-by-day-table-name-column multiline'>
          <span key={index}>
            {linkTarget &&
              <Link className='sqwerl-library-changes-by-day-table-name-title' to={linkTarget}>
                <span className='sqwerl-properties-table-name-text'>{change.name}</span>
              </Link>}
            {!linkTarget &&
              <div className='sqwerl-library-changes-by-day-table-name-title'>
                <span className='sqwerl-properties-table-name-text'>{change.name}</span>
              </div>}
            <div className='sqwerl-changes-by-day-collection-path'>{pathContent(change)}</div>
          </span>
        </td>
      )
    }
    return (
      <td className={`sqwerl-library-changes-by-day-table-name-column ${showPath ? 'multiline' : ''}`}>
        <span key={index}>
          {linkTarget &&
            <Link className='sqwerl-library-changes-by-day-table-name-title' to={linkTarget}>
              <span className='sqwerl-library-changes-by-day-details-name-text'>{change.name}</span>
            </Link>}
          {!linkTarget &&
            <div className='sqwerl-library-changes-by-day-table-name-title'>
              <span className='sqwerl-library-changes-by-day-details-name-text'>{change.name}</span>
            </div>}
        </span>
      </td>
    )
  }
}

/**
 * Renders a path to a thing that has been changed.
 * @param change
 */
const pathContent = (change: LibraryChangeDescription) => {
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
      <td className='sqwerl-properties-table-name-column multiline'>
        <span key={index}>
          <div className='sqwerl-library-changes-by-day-table-name-title'>
            <span className='sqwerl-library-changes-by-day-details-name-text'>{change.name}</span>
          </div>
          <div className='sqwerl-changes-by-day-collection-path'>{pathContent(change)}</div>
        </span>
      </td>
    )
  }
  return (
    <td className={`sqwerl-properties-table-name-column ${showPath ? 'multiline' : ''}`}>
      <span key={index}>
        <div className='sqwerl-library-changes-by-day-table-name-title sqwerl-navigation-item-title-text'>
          <span className='sqwerl-library-changes-by-day-details-name-text'>{change.name}</span>
        </div>
      </span>
    </td>
  )
}

export default Index
