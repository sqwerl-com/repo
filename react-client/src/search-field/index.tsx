/* global HTMLInputElement, Response */

import type { FetcherType } from 'fetcher'
import { IntlShape, useIntl } from 'react-intl'
import Logger, { LoggerType } from 'logger'
import type { SearcherType } from 'searcher'
import { Search, X } from 'react-feather'
import { SearchResults } from 'application'
import { Transition } from 'react-transition-group'
import { useEffect, useState } from 'react'
import * as React from 'react'

let logger: LoggerType

interface Props {
  /** This search field's child components. */
  children: React.ReactNode | null

  /** The CSS class names for this component's corresponding HTML element. */
  className: string

  /** The text a user wants to search for, updated when the user requests to perform a search. */
  currentSearchText: Object

  /** Fetches data from remote servers. */
  fetcher: FetcherType

  /** If false, then this component should not respond to users' actions. */
  isEnabled: boolean

  /** Is this search field's corresponding search menu visible? */
  isMenuVisible: boolean

  /** Unique identifier for prompt text displayed in this search field when it is empty. */
  promptTextId: string | null

  /** The name of the information space to be searched. For example: all the things, only my things. */
  searchDomainName: string

  /** Searches for information stored on remote servers. */
  searcher: SearcherType

  /** Unique ID for the the text displayed within this search field's tool tip. */
  searchFieldTooltipTextId: string

  /** Text to search for. */
  searchText: string

  setCurrentSearchText: (text: string) => void

  /** Sets a flag that indicates we are busy fetching search results. */
  setIsFetchingSearchResults: (isFetching: boolean) => void

  /** Called to set the results of a search request. */
  setSearchResults: (results: SearchResults | null) => void

  /** Sets the text to search for. */
  setSearchText: (searchText: string) => void

  /** Called to show this search field's corresponding search menu that shows a search request's results. */
  showMenu: Function

  tooltipTextId: string
}

interface State {
  /**
   * The text that a user has requested to search for. This gets updated on each search request, but not as
   * the user is editing the search text.
   */
  currentSearchText: Object

  fetcher: FetcherType
  input: HTMLInputElement | null
  intl: IntlShape
  isEditable: boolean
  logger: LoggerType
  searcher: SearcherType

  /**
   * The text the user is entering to search for. This is updated as the user edits the search text.
   */
  searchText: string

  setCurrentSearchText: Function
  setInput: Function
  setIsEditable: Function
  setIsFetchingSearchResults: (isSearching: boolean) => void
  setIsFinishedSearching: Function
  setIsSearching: Function
  setSearchResults: (results: SearchResults | null) => void
  setSearchText: (text: string) => void
  showMenu: Function
}

/**
 * Search field user interface components. User interface components that allow users to enter text to search for.
 * @param props
 */
const SearchField = (props: Props): React.JSX.Element => {
  logger = Logger(SearchField, SearchField)
  const {
    className,
    currentSearchText,
    fetcher,
    isEnabled,
    isMenuVisible,
    promptTextId,
    searchDomainName,
    searcher,
    searchFieldTooltipTextId,
    searchText,
    setSearchResults,
    tooltipTextId,
    setCurrentSearchText,
    setIsFetchingSearchResults,
    setSearchText,
    showMenu
  } = props
  const [input, setInput] = useState<HTMLInputElement | null>(null)
  const intl = useIntl()
  const [isEditable, setIsEditable] = useState(false)
  const [isFinishedSearching, setIsFinishedSearching] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  useEffect(() => {
    if (input !== null) {
      input.focus()
    }
  })
  const isDefault = !(isEditable || isSearching || isMenuVisible)
  const isDisabledClassName = isEnabled ? '' : 'disabled'
  const searchFieldTooltipText = tooltipText(intl, searchFieldTooltipTextId, searchDomainName)
  const tooltipTitle = tooltipText(intl, tooltipTextId, searchDomainName)
  const classes = `sqwerl-search-field ${className} ` + searchFieldClassName(isEditable, isSearching, isMenuVisible)
  // TODO - The following animation duration in milliseconds should come from an application-specific configuration
  //  value.
  const milliseconds = 300
  const state: State = {
    currentSearchText,
    fetcher,
    input,
    intl,
    isEditable,
    logger,
    searcher,
    searchText,
    setCurrentSearchText,
    setInput,
    setIsEditable,
    setIsFetchingSearchResults,
    setIsFinishedSearching,
    setIsSearching,
    setSearchResults,
    setSearchText,
    showMenu
  }
  return (
    <div className={classes} role='search'>
      <Transition in={isDefault || isEditable || isFinishedSearching} timeout={milliseconds} unmountOnExit>
        {status => (
          <>
            <div
              className={`sqwerl-search-field-form ${status}`}
              onSubmit={() => search(state)} role='search'
              tabIndex={-1}
            >
              <Search className='sqwerl-search-icon' />
              {isEditable &&
                <>
                  <input
                    aria-label={tooltipTitle}
                    autoComplete='off'
                    autoFocus
                    className={`sqwerl-search-field-text ${isDisabledClassName}`}
                    name='search'
                    onChange={event => onSearchTextChanged(state, event)}
                    onKeyDown={event => onSearchFieldKeyDown(state, event)}
                    onFocus={event => onFocusGained(event)}
                    placeholder={tooltipTitle}
                    ref={(c: HTMLInputElement | null) => {
                      setInput(c)
                      return c
                    }}
                    tabIndex={isEditable ? 0 : -1}
                    title={searchFieldTooltipText}
                    type='text'
                    value={searchText}
                  />
                  <X className='sqwerl-search-close-icon' onClick={() => stopEditing(state)} />
                </>}
            </div>
            {isDefault &&
              <button
                className={`sqwerl-search-field-default ${status} ${isDisabledClassName}`}
                onClick={() => allowEdit(state)}
                role='menu'
                tabIndex={isEnabled ? 0 : -1}
                title={tooltipTitle}
              >
                <Search className='sqwerl-search-icon' />
                <span className='sqwerl-search-default-text'>{defaultText(state, promptTextId)}</span>
              </button>}
          </>
        )}
      </Transition>
      <Transition in={isSearching} timeout={milliseconds} unmountOnExit>
        {status => (
          <>
            {isSearching &&
              <div className={`sqwerl-search-field-searching ${status}`}>
                {isSearching && (!isMenuVisible) &&
                  <>
                    <span className='sqwerl-searching-icon' />
                    <span className='sqwerl-searching-message'>{searchingText(state)}</span>
                  </>}
                {isMenuVisible &&
                  <>
                    <Search className='sqwerl-search-results-visible-icon' />
                    <span className='sqwerl-searching-message'>{searchText}</span>
                  </>}
              </div>}
          </>)}
      </Transition>
      <Transition in={isFinishedSearching} timeout={milliseconds} unmountOnExit>
        {status => (
          <>
            {isFinishedSearching && (!isEditable) &&
              <div className={`sqwerl-search-field-finished-searching ${status}`}>
                <Search className='sqwerl-search-results-visible-icon' />
                <span className='sqwerl-searching-message'>{searchText}</span>
              </div>}
          </>)}
      </Transition>
      {props.children}
    </div>
  )
}

/**
 * Allow users to edit the text to search for.
 * @param state
 */
const allowEdit = (state: State): void => {
  const { setIsEditable } = state
  setIsEditable(true)
}

/**
 * Returns localized text that this search field displays by default.
 * @param state
 * @param promptTextId Unique identifier for a locale-dependent text to display as this search field's default
 *                      prompt text.
 * @returns Text that this search field displays in default mode (before a user interacts with it).
 */
const defaultText = (state: State, promptTextId: string | null): string => {
  const { intl } = state
  // TODO - Add default message
  return intl.formatMessage({ id: promptTextId ?? 'searchField.defaultText' })
}

/**
 * Is the given search text valid?
 * @param searchText Text to search for.
 * @returns True if the given text contains one or more characters (isn't null or empty).
 */
const isValidSearchText = (searchText: string): boolean => {
  return (searchText.length > 0)
}

/**
 * Called when this search field gets the keyboard input focus and selects the text within this search field.
 * @param event The event that caused this function to be called.
 */
const onFocusGained = (event: React.FocusEvent<HTMLInputElement>): void => {
  event.target.select()
}

/**
 * Called when a request to the server to search for text fails.
 * @param state
 * @param error The error that caused a search request to fail.
 * @param response A response to an HTTP request sent to a server.
 */
const onSearchFailure = (state: State, error: Object, response: Response): void => {
  const { logger, searchText, setIsFinishedSearching, setIsSearching, setSearchResults, showMenu } = state
  logger.setContext(onSearchFailure).error(`Search failed. ${JSON.stringify(error)}`)
  if (response.status > 400) {
    if (typeof setSearchResults === 'function') {
      setSearchResults({
        limit: 0,
        offset: 0,
        searchItems: [],
        status: response.status,
        text: searchText,
        total: 0
      })
    }
    if (typeof showMenu === 'function') {
      showMenu()
    }
    setIsFinishedSearching(true)
    setIsSearching(false)
  }
}

/**
 * Called when the user presses a key when the search text field has the keyboard input focus.
 * @param state
 * @param event The event that caused this function to be called.
 */
const onSearchFieldKeyDown = (state: State, event: React.KeyboardEvent<HTMLInputElement>): void => {
  const { logger, searchText } = state
  const key = event.key
  logger.setContext('onSearchFieldKeyDown').debug(`key="${key}"`)
  const { isEditable } = state
  if ((key === 'Escape') && isEditable) {
    stopEditing(state)
  } else if (key === 'Enter') {
    if (isValidSearchText(searchText)) {
      search(state)
    }
  }
}

/**
 * Called when we receive a successful response to a search request.
 * @param state
 * @param url The URL that was used to send a search request to.
 * @param searchResults A search request's results  (what did the search find?)
 */
const onSearchSuccess = (state: State, url: string, searchResults: SearchResults): void => {
  const {
    logger,
    setIsFetchingSearchResults,
    setIsFinishedSearching,
    setIsSearching,
    setSearchResults,
    showMenu
  } = state
  logger.setContext('onSearchSuccess').info('Search completed successfully')
  let isFetching = false
  if (typeof setSearchResults === 'function') {
    setSearchResults(searchResults)
    // If we haven't retrieved all available search results, retrieve next batch of search results.
    const { limit, offset, total } = searchResults
    // If there are more search results to display, then retrieve more search results.
    isFetching = (offset + limit) < total
    setIsFetchingSearchResults(isFetching)
  }
  if (typeof showMenu === 'function') {
    showMenu()
  }
  setIsFinishedSearching(true)
  setIsSearching(false)
}

/**
 * Called when the text to search for changes.
 * @param state
 * @param event The event that caused this function to be called.
 */
const onSearchTextChanged = (state: State, event: React.ChangeEvent<HTMLInputElement>): void => {
  const { logger, setSearchText } = state
  const searchText = event.target.value
  logger.setContext('onSearchTextChanged').debug(`Search text: "${searchText}"`)
  if (typeof setSearchText === 'function') {
    setSearchText(searchText)
  }
}

/**
 * Search for the text the user has entered into this search field.
 * @param state
 * @param offset The index of the first search item to return.
 * @param limit The maximum number of search items to return.
 */
const search = (state: State, offset = 0, limit = 20): void => {
  const {
    fetcher,
    logger,
    searcher,
    searchText,
    setCurrentSearchText,
    setIsEditable,
    setIsFinishedSearching,
    setIsSearching,
    setSearchResults
  } = state
  logger.setContext('search').debug(`Searching for text: "${searchText}"`)
  setIsEditable(false)
  setIsFinishedSearching(false)
  setIsSearching(true)
  if (typeof setSearchResults === 'function') {
    setSearchResults(null)
  }
  setCurrentSearchText(searchText)
  searcher.search(
    fetcher,
    searchText,
    {},
    (error: any, response: Response) => onSearchFailure(state, error, response),
    (url: string, searchResults: SearchResults) => onSearchSuccess(state, url, searchResults),
    offset,
    limit)
}

/**
 * Stops allowing the user to edit this search field's search text.
 * @param state
 */
const stopEditing = (state: State): void => {
  const { logger, setIsEditable } = state
  logger.setContext(stopEditing).debug('Stop editing')
  setIsEditable(false)
}

/**
 * Returns a CSS class name to add to this search field to indicate this search field's state.
 * @param isEditable Can the user edit the search text?
 * @param isSearching Is the application searching for the search text?
 * @param isFinishedSearching Has the application finished searching for the search text?
 */
const searchFieldClassName = (isEditable: boolean, isSearching: boolean, isFinishedSearching: boolean): string => {
  let className = 'default'
  if (isEditable) {
    className = 'editable'
  } else if (isSearching) {
    className = 'searching'
  } else if (isFinishedSearching) {
    className = 'finished-searching'
  }
  return className
}

/**
 * Returns localized text to display in this search field while the application is busy searching for text.
 * @param state
 * @returns Text that notifies users that an application is searching for text.
 */
const searchingText = (state: State): string => {
  const { intl } = state
  return intl.formatMessage({ id: 'searchField.searchingMessage' })
}

/**
 * Returns localized text to display within a tool tip to describe this search field.
 * @param intl Internationalization support.
 * @param tooltipTextId Unique identifier for this search field's tool tip text.
 * @param searchDomainName Text that describes what to search.
 * @returns Text that describes this search field.
 */
const tooltipText = (intl: IntlShape, tooltipTextId: string, searchDomainName: string): string => {
  // TODO - Add default message.
  return intl.formatMessage({ id: tooltipTextId }, { searchDomainName })
}

export default SearchField
