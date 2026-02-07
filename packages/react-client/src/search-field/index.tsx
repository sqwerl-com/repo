/* global HTMLInputElement, Response */

import { EMPTY_SEARCH_RESULTS, SearchResults } from '@/application'
import type { FetcherType } from '@/fetcher'
import { IntlShape, useIntl } from 'react-intl'
import LoggerFactory from '@/logger'
import type { SearcherType } from '@/searcher'
import { Search, X } from 'react-feather'
import SearchContext from '@/search-context'
import { Transition } from 'react-transition-group'
import { useEffect, useState } from 'react'
import * as React from 'react'

export interface Props {
  /** Name of the server-side application. */
  applicationName: string

  /** This search field's child components. */
  children: React.ReactNode | null

  /** The CSS class names for this component's corresponding HTML element. */
  className: string

  /** The text a user wants to search for, updated when the user requests to perform a search. */
  currentSearchText: string

  /** Fetches data from remote servers. */
  fetcher: FetcherType

  /** Can the user edit this search field's search pattern text? */
  isEditable: boolean

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

  /** Unique ID for the text displayed within this search field's tool tip. */
  searchFieldTooltipTextId: string

  /** Text to search for. */
  searchText: string

  setCurrentSearchText: (text: string) => void

  /** Sets whether the user can edit this search field's search text pattern. */
  setIsEditable: (isEditable: boolean) => void

  /** Sets a flag that indicates we are busy fetching search results. */
  setIsFetchingSearchResults: (isFetching: boolean) => void

  /** Called to set the results of a search request. */
  setSearchResults: (results: SearchResults) => void

  /** Sets the text to search for. */
  setSearchText: (searchText: string) => void

  /** Called to show this search field's corresponding search menu that shows a search request's results. */
  showMenu: () => void

  /** Call to stop searching */
  stopSearch: () => void

  tooltipTextId: string
}

interface State {
  applicationName: string

  /**
   * The text that a user has requested to search for. This gets updated on each search request, but not as
   * the user is editing the search text.
   */
  currentSearchText: string

  fetcher: FetcherType
  input: HTMLInputElement | null
  intl: IntlShape
  isEditable: boolean
  searcher: SearcherType

  /**
   * The text the user is entering to search for. This is updated as the user edits the search text.
   */
  searchText: string

  setCurrentSearchText: (text: string) => void
  setInput: (inputElement: HTMLInputElement) => void
  setIsEditable: (isEditable: boolean) => void
  setIsFetchingSearchResults: (isSearching: boolean) => void
  setIsFinishedSearching: (isFinished: boolean) => void
  setIsSearching: (isSearching: boolean) => void
  setSearchResults: (results: SearchResults) => void
  setSearchText: (text: string) => void
  showMenu: () => void
  stopSearch: () => void
}

/**
 * Search field user interface components. User interface components that allow users to enter text to search for.
 * @param props
 */
const SearchField = (props: Props): React.JSX.Element => {
  const {
    applicationName,
    className,
    currentSearchText,
    fetcher,
    isEditable,
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
    setIsEditable,
    setIsFetchingSearchResults,
    setSearchText,
    showMenu,
    stopSearch
  } = props
  const [input, setInput] = useState<HTMLInputElement | null>(null)
  const intl = useIntl()
  const [isFinishedSearching, setIsFinishedSearching] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  /// TODO - Put back in or remove.
  /// const stopEditingCallback = React.useCallback(() => onStopEditing(state), [])
  useEffect(() => {
    if (input !== null) {
      input.focus()
    }
  }, [])
  const isDefault = !(isEditable || isSearching || isMenuVisible)
  const isDisabledClassName = isEnabled ? '' : 'disabled'
  const searchFieldTooltipText = tooltipText(intl, searchFieldTooltipTextId, searchDomainName)
  const tooltipTitle = tooltipText(intl, tooltipTextId, searchDomainName)
  const classes = `sqwerl-search-field ${className} ` + searchFieldClassName(isEditable, isSearching, isMenuVisible)
  // TODO - The following animation duration in milliseconds should come from an application-specific configuration
  //  value.
  const milliseconds = 300
  const state: State = {
    applicationName,
    currentSearchText,
    fetcher,
    input,
    intl,
    isEditable,
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
    showMenu,
    stopSearch
  }
  const onClickCloseCallback = React.useCallback(() => {
    setIsEditable(false)
    stopSearch()
  }, [])
  return (
    <div className={classes} role='search'>
      <Transition in={isDefault || isEditable || isFinishedSearching} timeout={milliseconds} unmountOnExit>
        {status => (
          <>
            <div
              className={`sqwerl-search-field-form ${status}`}
              onSubmit={() => search(state)} role='search'
            >
              <Search className='sqwerl-search-icon' />
              {isEditable &&
                <>
                  <input
                    aria-label={tooltipTitle}
                    autoComplete='off'
                    autoFocus
                    className='sqwerl-search-field-text'
                    name='search'
                    onChange={event => onSearchTextChanged(state, event)}
                    onKeyDown={event => onSearchFieldKeyDown(state, event)}
                    onFocus={event => onFocusGained(event)}
                    placeholder={tooltipTitle}
                    ref={(c: any | undefined) => {
                      setInput(c)
                      return c
                    }}
                    tabIndex={isEditable ? 0 : -1}
                    title={searchFieldTooltipText}
                    type='text'
                    value={searchText}
                  />
                  <X className='sqwerl-search-close-icon' onClick={onClickCloseCallback} />
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
      {/* TODO - The following is commented out because it it causing a runtime error.
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
              </div>
            }
          </>
        )}
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
      */}
      {props.children}
    </div>
  )
}

/**
 * Allow users to edit the text to search for.
 * @param state
 */
const allowEdit = (state: State): void => {
  const { setIsEditable, showMenu } = state
  setIsEditable(true)
  showMenu()
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
const onSearchFailure = (state: State, error: Error, response?: Response): void => {
  const logger = loggerFactory.create(onSearchFailure)
  const { searchText, setIsFinishedSearching, setIsSearching, setSearchResults, showMenu } = state
  logger.error(`Search failed. ${JSON.stringify(error)}`)

  if ((response !== undefined) && (response.status >= 400)) {
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
  const { searchText, stopSearch } = state
  const key = event.key
  const logger = loggerFactory.create(onSearchFieldKeyDown)
  logger.debug(`key="${key}"`)
  const { isEditable } = state
  if ((key === 'Escape') && isEditable) {
    stopSearch()
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
    setIsFetchingSearchResults,
    setIsFinishedSearching,
    setIsSearching,
    setSearchResults,
    showMenu
  } = state
  const logger = loggerFactory.create(onSearchSuccess)
  logger.info('Search completed successfully')
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
  const logger = loggerFactory.create(onSearchTextChanged)
  const { setSearchText } = state
  const searchText = event.target.value
  logger.debug(`Search text: "${searchText}"`)

  if (typeof setSearchText === 'function') {
    setSearchText(searchText)
  }
}

/**
 * TODO - Put back in, or remove.
 *
 * Called to top stops allowing the user to edit this search field's search text.
 * @param state
 *
const onStopEditing = (state: State): void => {
  const { setIsEditable } = state
  const logger = loggerFactory.create(onStopEditing)
  logger.debug('Stop editing')
  setIsEditable(false)
}
 */

/**
 * Search for the text the user has entered into this search field.
 * @param state
 * @param offset The index of the first search item to return.
 * @param limit The maximum number of search items to return.
 */
const search = (state: State, offset = 0, limit = 20): void => {
  const {
    applicationName,
    fetcher,
    searcher,
    searchText,
    setCurrentSearchText,
    setIsFinishedSearching,
    setIsSearching,
    setSearchResults
  } = state
  const logger = loggerFactory.create(search)
  logger.debug(`Searching for text: "${searchText}"`)
  setIsFinishedSearching(false)
  setIsSearching(true)

  if (typeof setSearchResults === 'function') {
    setSearchResults(EMPTY_SEARCH_RESULTS)
  }

  setCurrentSearchText(searchText)
  searcher.search(
    SearchContext(
      applicationName,
      fetcher,
      limit,
      offset,
      (error: Error, response?: Response) => onSearchFailure(state, error, response),
      (url: string, searchResults: SearchResults) => onSearchSuccess(state, url, searchResults),
      searchText,
      undefined
    )
  )
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

const loggerFactory = LoggerFactory(SearchField)

export default SearchField
