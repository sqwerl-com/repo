/* global KeyboardEvent, location */

import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { ChevronDown, ChevronUp, XCircle } from 'react-feather'
import type { ConfigurationType } from '@/configuration'
import { EMPTY_SEARCH_RESULTS, SearchItemType, SearchResults } from '@/application'
import type { FetcherType } from '@/fetcher'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from '@/logger'
import SearchContext from '@/search-context'
import SmallThumbnailImage from '@/utils/components/small-thumbnail-image'
import type { SearcherType } from '@/searcher'
import { useContext, useEffect, useState } from 'react'
import * as React from 'react'

let logger: LoggerType

interface Props {
  children: React.ReactNode

  configuration: ConfigurationType

  currentRepositoryName: string

  /** Text the contributor has requested to search for. */
  currentSearchText: string

  /** Fetches data from remote servers. */
  fetcher: FetcherType

  /** Is the application that this menu is a part of busy fetching search results? */
  isFetchingSearchResults: boolean

  isVisible: boolean

  /** Searches for data stored on remote servers. */
  searcher: SearcherType

  searchResults: SearchResults

  setIsFetchingSearchResults: (isFetching: boolean) => void

  setSearchResults: (results: SearchResults) => void

  stopSearch: () => void
}

interface State {
  context: ApplicationContextType
  currentRepositoryName: string
  intl: IntlShape
  logger: LoggerType
  setSortByPropertyName: (propertyName: string | null) => void
  setSortDirection: (direction: number) => void

  /**
   * Name of the property of search results to sort the results by. An empty string or null indicates not to sort
   * the search results by a property.
   */
  sortByPropertyName: string | null

  /** Direction to sort: -1 is descending (z-a), 0 is no sort, 1 is ascending (a-z). */
  sortDirection: number

  stopSearch: () => void
}

/**
 * An application menu that shows the results of a user's request to search for text.
 * @param props
 */
const SearchMenu = (props: Props): React.JSX.Element => {
  logger = Logger(SearchMenu, SearchMenu)
  const intl = useIntl()
  const [sortByPropertyName, setSortByPropertyName] = useState<(string | null)>(null)
  const [sortDirection, setSortDirection] = useState<number>(0)
  /* TODO - Do we need this? Can we delete it?
  const closeCallback = React.useCallback(() => close(state), [])
  */
  const { currentRepositoryName, isVisible, searchResults, stopSearch } = props
  const state: State = {
    context: useContext<ApplicationContextType>(ApplicationContext),
    currentRepositoryName,
    intl,
    logger,
    setSortByPropertyName,
    setSortDirection,
    sortByPropertyName,
    sortDirection,
    stopSearch
  }
  // Close this menu when the user presses the Escape key.
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.code === 'Escape') {
        stopSearch()
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
  const searchTextNotFound = (searchResults.status === 404)
  const tooManyFound = (searchResults.status === 413)
  return (
    <div className='sqwerl-search-menu-content'>
      {isVisible && searchTextNotFound && renderNothingFound(intl, props, state)}
      {isVisible && tooManyFound && renderFoundTooMany(intl, props, state)}
      {isVisible && (!searchTextNotFound) /* && (searchResults.total > 0) */ && (!tooManyFound) && renderFoundThings(intl, props, state)}
    </div>
  )
}

/**
 * Closes (hides) this search results menu.
 * @param state
 */
const close = (state: State): void => {
  const { logger, stopSearch } = state
  logger.setContext(close).debug('Closing (hiding) search menu')
  stopSearch()
}

/**
 * Renders this search menu's Close button that the user activates to hide this menu.
 * @param props
 * @param state
 */
const closeButton = (props: Props, state: State): React.JSX.Element => {
  return (
    <button className='sqwerl-search-close-button' onClick={() => close(state)}>
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
          <span className='sqwerl-search-text'>
            {text.substring(0, i)}
            <mark className='sqwerl-highlighted-search-text'>{text.substring(i, endOfSearchTextIndex)}</mark>
            {highlightSearchTextWithinText(props, text.substring(endOfSearchTextIndex))}
          </span>
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
      </div>

      {/* (searchItems.length === 1) &&
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
        </div>
      */}
      <div className='sqwerl-search-results-scrollable'>
        <div className='sqwerl-search-results-table'>
          {items}
        </div>
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
const renderNothingFound = (intl: IntlShape, props: Props, state: State): React.JSX.Element => {
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
  const result: React.JSX.Element[] = []
  if ({}.hasOwnProperty.call(item, 'foundInProperties')) {
    const foundInPropertyCount = item.foundInProperties !== undefined ? item.foundInProperties.length : 0
    if (foundInPropertyCount > 1) {
      const propertyDescriptions: React.ReactNode[] = []
      if (item.foundInProperties !== undefined) {
        item.foundInProperties.forEach((foundInProperty, index) => {
          const { name, value } = foundInProperty
          propertyDescriptions.push(
            <li key={index++}>
              <span className='sqwerl-found-in-property-name-list-item'>{name}</span>
              &nbsp;-&nbsp;
              <span className='sqwerl-search-property-value'>
                {highlightSearchTextWithinText(props, value)}
              </span>
            </li>
          )
        })
      }
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
    } else if ((foundInPropertyCount === 1) && (item.foundInProperties !== undefined)) {
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
 * Renders a description of a thing that matched search text that a user requested to search for.
 * @param props
 * @param item Describes a thing that matches text to search for.
 * @param state State information.
 */
const renderSearchItemResult = (props: Props, item: SearchItemType, state: State): React.JSX.Element => {
  const { configuration } = props
  const { applicationName } = configuration
  const { context, currentRepositoryName } = state
  const { id, index, typeName } = item
  const { parentThingIdToHref } = context
  const linkTarget = `${parentThingIdToHref(currentRepositoryName, id)}#/` +
    `${applicationName}/${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(id)}`
  return (
    <Link
      className={`sqwerl-search-results-item-link ${index % 2 === 0 ? 'even' : 'odd'}`}
      onClick={() => close(state)}
      key={id}
      to={linkTarget}
    >
      <div className='sqwerl-search-results-index-cell' onClick={() => { location.href = linkTarget }}>
        <span className='sqwerl-search-results-description-index'>{index + 1}.</span>
      </div>
      <div className='sqwerl-search-results-description-cell'>
        <div className='sqwerl-search-results-description-cell-content'>
          <div className='sqwerl-search-results-description-cell-content-text'>
            <span className='sqwerl-search-results-link'>{highlightSearchTextWithinText(props, item.name)}</span>
            {renderSearchItemFoundInProperties(props, item)}
          </div>
          <SmallThumbnailImage depictable={item} />
        </div>
      </div>
      {/* TODO - Internationalize the type name - Use the typeId to find a message format, if no format
          exists, then fall back to the type name.
      */}
      <div className='sqwerl-search-results-type-cell'>{typeName}</div>
    </Link>
  )
}

/**
 * Renders an icon that indicates the sort order (ascending, descending, or default) for a column within a table
 * of search results.
 * @param className
 * @param sortDirection  -1 for descending sort, 0 for default order, 1 for ascending sort.
 */
const renderSortDirectionIcon = (className: string, sortDirection: number): React.JSX.Element => {
  return (
    <>
      {(sortDirection === 1) && <ChevronDown className={className} />}
      {(sortDirection === -1) && <ChevronUp className={className} />}
    </>
  )
}

/**
 * Sorts search results by a property of the search result objects.
 * @param props
 * @param propertyName The name of a property of search result objects.
 * @param state
 */
const sortBy = (props: Props, propertyName: string, state: State): void => {
  const { configuration, currentSearchText, fetcher, searcher, setSearchResults } = props
  const { applicationName } = configuration
  const {
    logger,
    setSortByPropertyName,
    setSortDirection,
    sortByPropertyName
  } = state
  logger.setContext(sortBy)
  let newSortDirection
  if (sortByPropertyName === propertyName) {
    newSortDirection = cycleSortDirection(props, state)
  } else {
    setSortByPropertyName(propertyName)
    newSortDirection = 1
    setSortDirection(newSortDirection)
  }
  // setIsFetchingSearchResults(true)
  setSearchResults(EMPTY_SEARCH_RESULTS)
  searcher.search(
    SearchContext(
      applicationName,
      fetcher,
      50,
      0,
      (error: Error) => {
        // TODO - Notify user that a sort error occurred, why, and possible remedies.
        logger.error(`Sorting by search results failed. error=${JSON.stringify(error)}`)
        // setIsFetchingSearchResults(false)
      },
      (url: string, searchResults: SearchResults) => {
        logger.info('Sorting by name succeeded.')
        setSearchResults(searchResults)
        // setIsFetchingSearchResults(false)
      },
      currentSearchText,
      { sortBy: propertyName, sortOrder: newSortDirection }
    )
  )
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
