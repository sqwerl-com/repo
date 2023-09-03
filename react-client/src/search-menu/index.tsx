/* global Event, HTMLImageElement, JSX, KeyboardEvent, location */

import ApplicationContext, { ApplicationContextType } from 'context/application'
import { ChevronDown, ChevronRight, ChevronUp, XCircle } from 'react-feather'
import type { ConfigurationType } from 'configuration'
import type { FetcherType } from 'fetcher'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from 'logger'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SearcherType } from 'searcher'
import { SearchItemType, SearchResults, ThumbnailType } from 'application'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import * as React from 'react'

let logger: LoggerType

interface Props {
  children: React.ReactNode

  configuration: ConfigurationType

  currentLibraryName: string

  /** Text the user has requested to search for. */
  currentSearchText: string

  /** Fetches data from remote servers. */
  fetcher: FetcherType

  /** Call to hide this search menu. */
  hideMenu: Function

  /** Is the application that this menu is a part of busy fetching search results? */
  isFetchingSearchResults: boolean

  isVisible: boolean

  /** Searches for data stored on remote servers. */
  searcher: SearcherType

  searchResults: SearchResults | null

  setIsFetchingSearchResults: Function

  setSearchResults: Function
}

interface State {
  context: ApplicationContextType
  currentLibraryName: string
  intl: IntlShape
  logger: LoggerType
  setSortByPropertyName: Function
  setSortDirection: Function

  /**
   * Name of the property of search results to sort the results by. An empty string or null indicates not to sort
   * the search results by a property.
   */
  sortByPropertyName: string | null

  /** Direction to sort: -1 is descending (z-a), 0 is no sort, 1 is ascending (a-z). */
  sortDirection: number
}

/**
 * An application menu that shows the results of a user's request to search for text.
 * @param props
 */
const SearchMenu = (props: Props): React.JSX.Element => {
  logger = Logger(SearchMenu, SearchMenu)
  const { currentLibraryName, isVisible, searchResults } = props
  const intl = useIntl()
  const [sortByPropertyName, setSortByPropertyName] = useState<(string | null)>(null)
  const [sortDirection, setSortDirection] = useState(0)
  const state: State = {
    context: useContext<ApplicationContextType>(ApplicationContext),
    currentLibraryName,
    intl,
    logger,
    setSortByPropertyName,
    setSortDirection,
    sortByPropertyName,
    sortDirection
  }
  // Close this menu when the user presses the Escape key.
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.code === 'Escape') {
        close(props, state)
      }
    }
    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  })
  // Reset the table column sort order when this menu becomes visible.
  useEffect(() => {
    if (isVisible) {
      setSortByPropertyName('')
      setSortDirection(0)
    }
  }, [isVisible])
  if (searchResults === null) {
    return (<></>)
  }
  const searchTextNotFound = (searchResults.status === 404)
  const tooManyFound = (searchResults.status === 413)
  return (
    <div className='sqwerl-search-menu-content'>
      {isVisible && searchTextNotFound && renderNothingFound(intl, props, state)}
      {isVisible && tooManyFound && renderFoundTooMany(intl, props, state)}
      {isVisible && (searchResults.total > 0) && (!tooManyFound) && renderFoundThings(intl, props, state)}
    </div>
  )
}

/**
 * Closes (hides) this search results menu.
 * @param props
 * @param state
 */
const close = (props: Props, state: State): void => {
  const { hideMenu } = props
  const { logger } = state
  logger.setContext(close).debug('Closing (hiding) search menu')
  if (typeof hideMenu === 'function') {
    hideMenu()
  } else {
    logger.warn('Search menu does not have a hideMenu function')
  }
}

/**
 * Renders this search menu's Close button that the user activates to hide this menu.
 * @param props
 * @param state
 */
const closeButton = (props: Props, state: State): React.JSX.Element => {
  return (
    <button className='sqwerl-search-close-button' onClick={() => close(props, state)}>
      <XCircle className='sqwerl-search-close-button-icon' />
      <span className='sqwerl-search-close-button-text'>
        <FormattedMessage id='searchMenu.searchResults.closeButton.text' />
      </span>
    </button>
  )
}

/**
 * Cycles the direction that search results are sorted between descending, none, or ascending.
 * @param props
 * @param state
 * @return The new sort direction. { -1 = sort descending, 0 = don't sort, 1 = sort ascending }.
 */
const cycleSortDirection = (props: Props, state: State): number => {
  const { setSortDirection, sortDirection } = state
  const direction = sortDirection + 1 > 1 ? -1 : sortDirection + 1
  setSortDirection(direction)
  return direction
}

/**                                                                                                                           re
 * Returns HTML markup where the occurrences of the search text within the given text are styled.
 * @param props
 * @param text Text that may contain the search text.
 */
const highlightSearchTextWithinText = (props: Props, text: string): React.JSX.Element => {
  const { currentSearchText } = props
  if ((currentSearchText !== '') && (text !== '')) {
    const i = text.toLowerCase().indexOf(currentSearchText.toLowerCase())
    if (i !== -1) {
      const endOfSearchTextIndex = i + currentSearchText.length
      return (
        <>
          <span className='sqwerl-search-text'>{text.substring(0, i)}</span>
          <mark className='sqwerl-highlighted-search-text'>{text.substring(i, endOfSearchTextIndex)}</mark>
          {highlightSearchTextWithinText(props, text.substring(endOfSearchTextIndex))}
        </>
      )
    } else {
      return <span className='sqwerl-search-text'>{text}</span>
    }
  }
  return (<></>)
}

/**
 * Renders the contents of a search menu when a request to search for text returns one or more things that match
 * the search text.
 * @param intl
 * @param props
 * @param state
 */
const renderFoundThings = (intl: IntlShape, props: Props, state: State): React.JSX.Element => {
  const { isFetchingSearchResults, searchResults } = props
  if (searchResults === null) {
    return (<></>)
  }
  const { searchItems, total } = searchResults
  const { sortByPropertyName, sortDirection } = state
  const items = []
  let sortOrderIcon
  switch (sortDirection) {
    case -1:
      sortOrderIcon = <ChevronUp />
      break
    case 0:
      sortOrderIcon = ''
      break
    case 1:
      sortOrderIcon = <ChevronDown />
      break
    default:
      sortOrderIcon = ''
      break
  }
  let maxIndex = 0
  searchItems.forEach(item => {
    items[item.index] = renderSearchItemResult(props, item, state)
    maxIndex = item.index > maxIndex ? item.index : maxIndex
  })
  // Let the user know if we're still loading search results.
  items[maxIndex + 1] = isFetchingSearchResults ? renderLoadingSearchItemResult(intl, props, maxIndex) : null
  const nameColumnSortIcon = (sortByPropertyName === 'name') ? sortOrderIcon : ''
  const typeColumnSortIcon = (sortByPropertyName === 'type') ? sortOrderIcon : ''
  return (
    <div className='sqwerl-search-menu-found-things'>
      {(searchItems.length > 1) &&
        <div className='sqwerl-search-results-table-headings'>
          <button
            className='sqwerl-search-results-description-column-header'
            onClick={() => sortByName(props, state)}
            title={intl.formatMessage({ id: 'searchMenu.searchResults.thingColumnTitle.tooltipText' })}
          >
            <span
              className='sqwerl-search-results-column-heading-text'
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: 'searchMenu.searchResults.thingColumnTitle' },
                  { total })
              }}
            />
            {(nameColumnSortIcon !== '') &&
              (sortByPropertyName === 'name') &&
              renderSortDirectionIcon('sqwerl-search-results-description-sort-icon', sortDirection)}
          </button>
          <button
            className='sqwerl-search-results-type-column-header'
            onClick={() => sortByType(props, state)}
            title={intl.formatMessage({ id: 'searchMenu.searchResults.typeColumnTitle.tooltipText' })}
          >
            <span className='sqwerl-search-results-column-heading-text'>
              {intl.formatMessage({ id: 'searchMenu.searchResults.typeColumnTitle' })}
            </span>
            {(typeColumnSortIcon !== '') &&
              (sortByPropertyName === 'type') &&
              renderSortDirectionIcon('sqwerl-search-results-description-sort-icon', sortDirection)}
          </button>
        </div>}
      {(searchItems.length === 1) &&
        <div className='sqwerl-search-results-table-headings-single-item'>
          <div className='sqwerl-search-results-description-column-header-single-item'>
            <span
              className='sqwerl-search-results-column-heading-text-single-item'
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: 'searchMenu.searchResults.thingColumnTitle' },
                  { total })
              }}
            />
          </div>
          <div className='sqwerl-search-results-type-column-header-single-item'>
            <span className='sqwerl-search-results-column-heading-text-single-item'>
              {intl.formatMessage({ id: 'searchMenu.searchResults.typeColumnTitle' })}
            </span>
          </div>
        </div>}
      <div className='sqwerl-search-results-scrollable'>
        <table className='sqwerl-search-results-table'>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
      {closeButton(props, state)}
    </div>
  )
}

/**
 * Renders the contents of a search menu when there are too many matches to display.
 * @param intl
 * @param props
 * @param state
 */
const renderFoundTooMany = (intl: IntlShape, props: Props, state: State): React.JSX.Element => {
  const { currentSearchText } = props
  return (
    <div className='sqwerl-search-nothing-found'>
      <div className='sqwerl-search-nothing-found-title'>
        <span className='sqwerl-nothing-found-svg-icon-box'>
          <svg className='circular red-stroke'>
            <circle className='path' cx='30' cy='30' r='25' fill='none' strokeMiterlimit='10' />
            <line className='alert-sign' x1='30.33' y1='11.5' x2='30.33' y2='40.3' />
            <circle className='dot' cx='30.39' cy='46.01' r='1' />
          </svg>
        </span>
        <span className='sqwerl-search-nothing-found-title-text'>
          <FormattedMessage
            id='searchMenu.searchResults.searchResultsTooManyFound.titleText'
            values={{ searchText: currentSearchText }}
          />
        </span>
      </div>
      <div
        className='sqwerl-search-nothing-found-description'
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
            id: 'searchMenu.searchResults.searchResultsTooManyFound.descriptionText'
          })
        }}
      />
      {closeButton(props, state)}
    </div>
  )
}

/**
 * Renders a placeholder for a search result that we haven't yet received from a server.
 * @param intl Internationalization support.
 * @param props
 * @param index The index of the search result within an array of search results.
 */
const renderLoadingSearchItemResult = (intl: IntlShape, props: Props, index: number): React.JSX.Element => {
  const loadingText = intl.formatMessage({ id: 'loading' })
  return (
    <tr className='sqwerl-search-result-loading-item' key={index}>
      <td className='sqwerl-search-results-loading-cell' colSpan={3}>
        <label className='sqwerl-search-results-loading-item-title' data-key={index}>
          <span className='sqwerl-search-busy-icon' />
          <span className='sqwerl-search-results-loading-text'>{loadingText}</span>
          <span className='sqwerl-search-results-loading-indicator first'>.</span>
          <span className='sqwerl-search-results-loading-indicator second'>.</span>
          <span className='sqwerl-search-results-loading-indicator third'>.</span>
        </label>
      </td>
    </tr>
  )
}

/**
 * Renders the contents of a search menu when a search did not produce any matches.
 * @param intl
 * @param props
 * @param state
 */
const renderNothingFound = (intl: IntlShape, props: Props, state: State): JSX.Element => {
  const { currentSearchText } = props
  return (
    <div className='sqwerl-search-nothing-found'>
      <div className='sqwerl-search-nothing-found-title'>
        <span className='sqwerl-nothing-found-svg-icon-box'>
          <svg className='circular red-stroke'>
            <circle className='path' cx='30' cy='30' r='25' fill='none' strokeMiterlimit='10' />
            <line className='alert-sign' x1='30.33' y1='11.5' x2='30.33' y2='40.3' />
            <circle className='dot' cx='30.39' cy='46.01' r='1' />
          </svg>
        </span>
        <span className='sqwerl-search-nothing-found-title-text'>
          <FormattedMessage
            id='searchMenu.searchResults.searchResultsNothingFound.titleText'
            values={{ searchText: currentSearchText }}
          />
        </span>
      </div>
      <div
        className='sqwerl-search-nothing-found-description'
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
            id: 'searchMenu.searchResults.searchResultsNothingFound.descriptionText'
          })
        }}
      />
      {closeButton(props, state)}
    </div>
  )
}

/**
 * Renders content that describes which of a thing's properties contained the search text.
 * @param props
 * @param item
 */
const renderSearchItemFoundInProperties = (props: Props, item: SearchItemType): React.ReactNode => {
  const result: React.ReactNode[] = []
  if ({}.hasOwnProperty.call(item, 'foundInProperties')) {
    const foundInPropertyCount = Object.keys(item.foundInProperties).length
    if (foundInPropertyCount > 1) {
      const propertyDescriptions: React.ReactNode[] = []
      item.foundInProperties.forEach((foundInProperty: { name: string, value: string }, index: number) => {
        propertyDescriptions.push(
          <li key={index}>
            <span className='sqwerl-found-in-property-name-list-item'>{foundInProperty.name}</span>
            &nbsp;-&nbsp;
            <span className='sqwerl-search-property-value'>
              {highlightSearchTextWithinText(props, foundInProperty.value)}
            </span>
          </li>
        )
      })
      return (
        <>
          <p className='sqwerl-found-in-properties-title'>
            <FormattedMessage
              id='searchMenu.searchResults.foundInMoreThanOneProperty'
              values={{ propertyCount: foundInPropertyCount }}
            />
          </p>
          <ul className='sqwerl-found-in-properties-list'>
            {propertyDescriptions}
          </ul>
        </>
      )
    } else if (foundInPropertyCount === 1) {
      const foundInProperty = item.foundInProperties[0]
      return (
        <div className='sqwerl-search-results-found-in'>
          <FormattedMessage id='searchMenu.searchResults.foundOneMatchingPropertyPrefix' />
          <span className='sqwerl-found-in-property-name'>{foundInProperty.name}</span>
          &nbsp;-&nbsp;
          <span className='sqwerl-search-property-value'>
            {highlightSearchTextWithinText(props, foundInProperty.value)}
          </span>
        </div>
      )
    }
  }
  return result
}

/**
 * Renders content that describes a thing that contains the search text.
 * @param props
 * @param item
 */
const renderSearchItemName = (props: Props, item: SearchItemType): JSX.Element => {
  const { path } = item
  const results = []
  if (path !== '') {
    const pathComponents = path.split('/')
    const length = pathComponents.length
    let index = 0
    const floor = (length <= 3 ? 1 : 3)
    for (let i = floor; i < length; i++) {
      results.push(<>{highlightSearchTextWithinText(props, pathComponents[i])}</>)
      if (i < (length - 1)) {
        results.push(
          <ChevronRight className='sqwerl-search-results-link-path-separator' key={`separator-${index++}`} />)
      }
    }
  }
  return <>{results}</>
}

/**
 * Renders a description of a thing that matched search text that a user requested to search for.
 * @param props
 * @param item Describes a thing that matches text to search for.
 * @param state State information.
 */
const renderSearchItemResult = (props: Props, item: SearchItemType, state: State): JSX.Element => {
  const { configuration } = props
  const { context, currentLibraryName } = state
  const { id, index, thumbnails, typeId, typeName } = item
  const { parentThingIdToHref } = context
  const linkTarget = `${parentThingIdToHref(typeId)}#/` +
    `${configuration.applicationName}/${currentLibraryName}${context.encodeUriReplaceStringsWithHyphens(id)}`
  return (
    <tr className='sqwerl-search-result-item' key={id}>
      <td className='sqwerl-search-results-index-cell' onClick={() => { location.href = linkTarget }}>
        <span className='sqwerl-search-results-description-index'>{index + 1}.</span>
      </td>
      <td className='sqwerl-search-results-description-cell'>
        <div className='sqwerl-search-results-description-text'>
          {renderThumbnail(props, state, thumbnails, item)}
          <Link
            className='sqwerl-search-results-item-link'
            onClick={() => close(props, state)}
            to={linkTarget}
          >
            <span className='sqwerl-search-results-link'>{renderSearchItemName(props, item)}</span>
          </Link>
          {renderSearchItemFoundInProperties(props, item)}
        </div>
      </td>
      {/* TODO - Internationalize the type name - Use the typeId to find a message format, if no format
          exists, then fall back to the type name.
      */}
      <td className='sqwerl-search-results-type-cell' onClick={() => { location.href = linkTarget }}>{typeName}</td>
    </tr>
  )
}

/**
 * Renders an icon that indicates the sort order (ascending, descending, or default) for a column within a table
 * of search results.
 * @param className
 * @param sortDirection  -1 for descending sort, 0 for default order, 1 for ascending sort.
 */
const renderSortDirectionIcon = (className: string, sortDirection: number): JSX.Element => {
  return (
    <>
      {(sortDirection === 1) && <ChevronDown className={className} />}
      {(sortDirection === -1) && <ChevronUp className={className} />}
    </>
  )
}

/**
 * Renders a small thumbnail image that represents a search result.
 * @param props
 * @param state
 * @param thumbnails  Array of thumbnail image descriptions.
 * @param item  A search result item.
 */
const renderThumbnail = (
  props: Props, state: State, thumbnails: ThumbnailType[] | undefined, item: SearchItemType): JSX.Element => {
  const { logger, intl } = state
  // TODO - Looking for an image with small in the name to find the smallest image is a hack. There should
  // be a better, more standard way to find the right size image.
  const thumbnail: ThumbnailType | undefined = thumbnails?.length === 1
    ? thumbnails[0]
    : thumbnails?.find(thumbnail => thumbnail.name.includes('small'))
  const alternateText = intl.formatMessage({
    id: 'searchMenu.searchResults.searchResult.thumbnail.alternateText'
  },
  {
    name: item.name,
    typeName: lowerCaseFirstLetter(item.typeName)
  })
  /* TODO - In the onError handler--called when the browser can't find the image--replace the src with the URL
             to a placeholder image that we know exists. */
  return ((thumbnail !== undefined)
    ? <img
        alt={alternateText}
        className='sqwerl-search-results-thumbnail'
        onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
          e.currentTarget.src = ''
          logger.warn(`Could not find the image file with the URL "${thumbnail.href}"`)
        }}
        src={thumbnail.href}
      />
    : <div />
  )
}

/**
 * Sorts search results by a property of the search result objects.
 * @param props
 * @param propertyName The name of a property of search result objects.
 * @param state
 */
const sortBy = (props: Props, propertyName: string, state: State): void => {
  const { currentSearchText, fetcher, searcher, setSearchResults } = props
  const {
    logger,
    setSortByPropertyName,
    setSortDirection,
    sortByPropertyName
  } = state
  logger.setContext(sortBy)
  let newSortDirection = 0
  if (sortByPropertyName === propertyName) {
    newSortDirection = cycleSortDirection(props, state)
  } else {
    setSortByPropertyName(propertyName)
    newSortDirection = 1
    setSortDirection(newSortDirection)
  }
  // setIsFetchingSearchResults(true)
  setSearchResults([])
  searcher.search(
    fetcher,
    currentSearchText,
    { sortBy: propertyName, sortOrder: newSortDirection },
    (error: any, response: any) => {
      // TODO - Notify user that a sort error occurred, why, and possible remedies.
      logger.error(`Sorting by search results failed. error=${JSON.stringify(error)}`)
      // setIsFetchingSearchResults(false)
    },
    (url: string, searchResults: SearchResults) => {
      logger.info('Sorting by name succeeded.')
      setSearchResults(searchResults)
      // setIsFetchingSearchResults(false)
    },
    0,
    50)
}

/**
 * Sorts search results by the things' names.
 * @param props
 * @param state
 */
const sortByName = (props: Props, state: State): void => {
  const { logger } = state
  logger.setContext(sortByName)
  logger.info('Requested to sort search results by names of things')
  sortBy(props, 'name', state)
}

/**
 * Sorts search results by the names of the types of things.
 * @param props
 * @param state
 */
const sortByType = (props: Props, state: State): void => {
  const { logger } = state
  logger.setContext(sortByType)
  logger.info('Requested to sort search results by names of the types of things')
  sortBy(props, 'type', state)
}

export default SearchMenu
