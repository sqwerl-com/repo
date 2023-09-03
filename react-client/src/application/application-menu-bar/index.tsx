import ApplicationMenu from 'application/application-menu'
import type { ConfigurationType } from 'configuration'
import type { FetcherType } from 'fetcher'
import Logger, { LoggerType } from 'logger'
import Logo from 'logo'
import MenuButton from 'menu-button'
import MenuItem from 'menu-item'
import { ModalityContext } from 'context/modality'
import { MouseEventHandler, ReactNode, useContext } from 'react'
import type { SearcherType } from 'searcher'
import SearchField from 'search-field'
import SearchMenu from 'search-menu'
import { SearchResults } from 'application'
import * as React from 'react'

let logger: LoggerType

interface Props {
  /** This component's child components. */
  children?: ReactNode

  /** Call to get the CSS class name for search results. */
  classNameForSearchResults: (results: SearchResults | null) => string

  configuration: ConfigurationType

  currentLibraryName: string

  currentSearchText: string

  /** Fetches data from remote servers. */
  fetcher: FetcherType

  /** Call to hide all of this menu bar's drop-down menus. */
  hideMenu: () => void,

  /** Is the application this menu bar is part of busy fetching search results? */
  isFetchingSearchResults: boolean

  /** Is the More... menu visible? */
  isMoreMenuVisible: boolean

  /** Is the Search menu visible? */
  isSearchMenuVisible: boolean

  /** Name of the collection of what can be searched from the search menu. */
  searchDomainName: string

  /** Searches for data stored on remote servers. */
  searcher: SearcherType

  /** Things that were found to contain text that was searched for. */
  searchResults: SearchResults | null

  /** Text to search for. */
  searchText: string

  setCurrentSearchText: (searchText: string) => void

  /** Sets a flag indicating whether the application this menu bar is a part of is busy fetching search results. */
  setIsFetchingSearchResults: (isFetching: boolean) => void

  /** Call to set the things that were found to contain text to search for. */
  setSearchResults: (results: SearchResults | null) => void

  /** Call to set the text to search for. */
  setSearchText: (text: string) => void

  /** Call to display the More... menu. */
  showMoreMenu: MouseEventHandler<HTMLButtonElement>

  /** Call to display the Search menu. */
  showSearchMenu: MouseEventHandler<HTMLButtonElement>

  /** Call to toggle the UI theme between light and dark themes. */
  toggleTheme: Function
}

/**
 * Sqwerl client application's menu bar component.
 * @param props
 */
const ApplicationMenuBar = (props: Props): React.JSX.Element => {
  logger = Logger(ApplicationMenuBar, ApplicationMenuBar)
  logger.info('Rendering application menu bar')
  const isEnabled = !useContext(ModalityContext)
  const {
    children,
    classNameForSearchResults,
    configuration,
    currentLibraryName,
    currentSearchText,
    fetcher,
    hideMenu,
    isFetchingSearchResults,
    isMoreMenuVisible,
    isSearchMenuVisible,
    searcher,
    searchDomainName,
    searchResults,
    searchText,
    setCurrentSearchText,
    setIsFetchingSearchResults,
    setSearchResults,
    setSearchText,
    showMoreMenu,
    showSearchMenu,
    toggleTheme
  } = props
  return (
    <nav className='sqwerl-application-menu-bar'>
      <Logo basePath={configuration.basePath} children={children} isEnabled={isEnabled} />
      <div id='sqwerl-application-bar-spacer' />
      <SearchField
        className='sqwerl-menu-bar-search-field'
        currentSearchText={currentSearchText}
        fetcher={fetcher}
        isEnabled={isEnabled}
        isMenuVisible={isSearchMenuVisible}
        promptTextId={null}
        searchDomainName={searchDomainName}
        searcher={searcher}
        searchFieldTooltipTextId='searchField.tooltipText'
        searchText={searchText}
        setCurrentSearchText={setCurrentSearchText}
        setIsFetchingSearchResults={setIsFetchingSearchResults}
        setSearchResults={setSearchResults}
        setSearchText={setSearchText}
        showMenu={showSearchMenu}
        tooltipTextId='searchMenu.tooltipText'
      >
        <ApplicationMenu
          isVisible={isSearchMenuVisible}
          name={`sqwerl-search-menu ${classNameForSearchResults(searchResults)}`}
        >
          <SearchMenu
            children={children}
            configuration={configuration}
            currentLibraryName={currentLibraryName}
            currentSearchText={currentSearchText}
            fetcher={fetcher}
            hideMenu={hideMenu}
            isFetchingSearchResults={isFetchingSearchResults}
            isVisible={isSearchMenuVisible}
            searcher={searcher}
            searchResults={searchResults}
            setIsFetchingSearchResults={setIsFetchingSearchResults}
            setSearchResults={setSearchResults}
          />
        </ApplicationMenu>
      </SearchField>
      <MenuButton
        className='sqwerl-more-menu-button'
        isEnabled={isEnabled}
        onClick={showMoreMenu}
        titleId='moreMenu.title'
        tooltipTextId='moreMenu.tooltipText'
      >
        <ApplicationMenu
          isVisible={isMoreMenuVisible}
          name='sqwerl-more-menu'
        >
          <MenuItem
            children={children}
            hideMenu={hideMenu}
            onClick={toggleTheme}
            subtitleId='toggleThemeMenuItem.subtitle'
            titleId='toggleThemeMenuItem.title'
          />
        </ApplicationMenu>
      </MenuButton>
    </nav>
  )
}

export default ApplicationMenuBar
