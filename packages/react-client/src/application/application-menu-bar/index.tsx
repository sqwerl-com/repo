import ApplicationMenu from '@/application/application-menu'
import type { ConfigurationType } from '@/configuration'
import type { FetcherType } from '@/fetcher'
import Logger, { LoggerType } from '@/logger'
import Logo from '@/logo'
import MenuButton from '@/menu-button'
import MenuItem from '@/menu-item'
import { ModalityContext } from '@/context/modality'
import type { SearcherType } from '@/searcher'
import SearchField from '@/search-field'
import SearchMenu from '@/search-menu'
import { SearchResults } from '@/application'
import SignInMenu from '@/sign-in-menu'
import { useCallback, useContext, useState } from 'react'
import * as React from 'react'

let logger: LoggerType

interface Props {
  /** This component's child components. */
  children?: React.JSX.Element

  /** Call to get the CSS class name for search results. */
  classNameForSearchResults: (results: SearchResults | null) => string

  configuration: ConfigurationType

  currentRepositoryName: string

  currentSearchText: string

  /** Fetches data from remote servers. */
  fetcher: FetcherType

  /** Call to hide all of this menu bar's drop-down menus. */
  hideMenu: () => void

  /** Is the application this menu bar is part of busy fetching search results? */
  isFetchingSearchResults: boolean

  /** Is the More... menu visible? */
  isMoreMenuVisible: boolean

  /** Is the Search menu visible? */
  isSearchMenuVisible: boolean

  /** Is the Sign In menu visible? */
  isSignInMenuVisible: boolean

  /** Name of the collection of what can be searched from the search menu. */
  searchDomainName: string

  /** Searches for data stored on remote servers. */
  searcher: SearcherType

  /** Things that were found to contain text that was searched for. */
  searchResults: SearchResults

  /** Text to search for. */
  searchText: string

  setCurrentSearchText: (searchText: string) => void

  /** Sets a flag indicating whether the application this menu bar is a part of is busy fetching search results. */
  setIsFetchingSearchResults: (isFetching: boolean) => void

  /** Call to set the things that were found to contain text to search for. */
  setSearchResults: (results: SearchResults) => void

  /** Call to set the text to search for. */
  setSearchText: (text: string) => void

  /** Call to display the More... menu. */
  showMoreMenu: () => void

  /** Call to display the Search menu. */
  showSearchMenu: () => void

  /** Call to display the Sign In menu. */
  showSignInMenu: () => void

  /** Call to toggle the UI theme between light and dark themes. */
  toggleTheme: () => void
}

/**
 * Sqwerl client application's menu bar component.
 * @param props
 */
const ApplicationMenuBar = (props: Props): React.JSX.Element => {
  logger = Logger(ApplicationMenuBar, ApplicationMenuBar)
  logger.info('Rendering application menu bar')
  const [isSearchFieldEditable, setIsSearchFieldEditable] = useState(false)
  const isEnabled = !useContext(ModalityContext)
  const {
    children,
    classNameForSearchResults,
    configuration,
    currentRepositoryName,
    currentSearchText,
    fetcher,
    hideMenu,
    isFetchingSearchResults,
    isMoreMenuVisible,
    isSearchMenuVisible,
    isSignInMenuVisible,
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
    showSignInMenu,
    toggleTheme
  } = props
  const stopSearchCallback = useCallback(() => {
    setIsSearchFieldEditable(false)
    hideMenu()
  }, [])
  return (
    <nav className='sqwerl-application-menu-bar'>
      <Logo basePath={configuration.basePath} isEnabled={isEnabled}>{children}</Logo>
      <div id='sqwerl-application-bar-spacer' />
      <SearchField
        applicationName={configuration.applicationName}
        className='sqwerl-menu-bar-search-field'
        currentSearchText={currentSearchText}
        fetcher={fetcher}
        isEditable={isSearchFieldEditable}
        isEnabled={isEnabled}
        isMenuVisible={isSearchMenuVisible}
        promptTextId={null}
        searchDomainName={searchDomainName}
        searcher={searcher}
        searchFieldTooltipTextId='searchField.tooltipText'
        searchText={searchText}
        setCurrentSearchText={setCurrentSearchText}
        setIsEditable={setIsSearchFieldEditable}
        setIsFetchingSearchResults={setIsFetchingSearchResults}
        setSearchResults={setSearchResults}
        setSearchText={setSearchText}
        showMenu={showSearchMenu}
        stopSearch={stopSearchCallback}
        tooltipTextId='searchMenu.tooltipText'
      >
        <ApplicationMenu
          isVisible={isSearchMenuVisible}
          name={`sqwerl-search-menu ${classNameForSearchResults(searchResults)}`}
        >
          <SearchMenu
            configuration={configuration}
            currentRepositoryName={currentRepositoryName}
            currentSearchText={currentSearchText}
            fetcher={fetcher}
            isFetchingSearchResults={isFetchingSearchResults}
            isVisible={isSearchMenuVisible}
            searcher={searcher}
            searchResults={searchResults}
            setIsFetchingSearchResults={setIsFetchingSearchResults}
            setSearchResults={setSearchResults}
            stopSearch={stopSearchCallback}
          >
            {children}
          </SearchMenu>
        </ApplicationMenu>
      </SearchField>
      {/* TODO - If signed in show Account menu, otherwise show Sign In menu */}
      <MenuButton
        className='sqwerl-sign-in-menu-button'
        isEnabled={isEnabled}
        onClick={showSignInMenu}
        titleId='signInMenu.title'
        tooltipTextId='signInMenu.tooltipText'
      >
        <ApplicationMenu
          isVisible={isSignInMenuVisible}
          name='sqwerl-sign-in-menu'
        >
          <SignInMenu isVisible={isSignInMenuVisible} />
        </ApplicationMenu>
      </MenuButton>
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
            hideMenu={hideMenu}
            onClick={toggleTheme}
            subtitleId='toggleThemeMenuItem.subtitle'
            titleId='toggleThemeMenuItem.title'
          >
            {children}
          </MenuItem>
        </ApplicationMenu>
      </MenuButton>
    </nav>
  )
}

export default ApplicationMenuBar
