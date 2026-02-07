import '@/application/application.css'
import ApplicationContentArea from '@/application/application-content-area'
import ApplicationContext, { ApplicationContextType } from '@/context/application'
import ApplicationMenuBar from '@/application/application-menu-bar'
import BusyPane from '@/busy-pane'
import Configuration from '@/configuration'
import { CurrentThemeProvider } from '@/context/current-theme'
import Fetcher, { FetcherType } from '@/fetcher'
import { HasPictureData } from '@/utilities/types'
import { IsBusyProvider } from '@/context/is-busy'
import LoggerFactory from '@/logger'
import { ModalityProvider } from '@/context/modality'
import ModalPane from '@/modal-pane'
import React, { useContext, useState } from 'react'
import { RouteChangeHandler } from '@/route-change-handler'
import Searcher from '@/searcher'
import useAutoTheme from '@/utilities/hooks/use-auto-theme'
import useDerivedTheme from '@/utilities/hooks/use-derived-theme'

export interface Props {
  /** This application's child components. */
  children?: React.JSX.Element
}

export interface SearchItemType extends HasPictureData {
  foundInProperties?: [{ name: string, value: string }]
  id: string
  index: number
  name: string
  path: string
  typeId: string
  typeName: string
}

export interface SearchResults {
  limit: number
  offset: number
  searchItems: SearchItemType[]
  status: number
  text: string
  total: number
}

export interface State {
  autoTheme: string
  configuration: unknown
  context: ApplicationContextType
  doesClickingOnModalPaneHideModals: boolean
  fetcher: FetcherType
  overrideAutoTheme: (theme: string) => void
  path: Array<{ name: string, id: string }>
  setDoesClickingOnModalPaneHideModals: (value: (((prevState: boolean) => boolean) | boolean)) => void
  setIsMenuModalPaneVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void
  setIsMoreMenuVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void
  setIsSearchMenuVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void
  setIsSignInMenuVisible: (value: (((prevState: boolean) => boolean) | boolean)) => void
  setPath: (value: (((prevState: Array<{ name: string, id: string }>) =>
  Array<{ name: string, id: string }>) | Array<{ name: string, id: string }>)) => void
}

export const EMPTY_SEARCH_RESULTS = {
  limit: 0,
  offset: 0,
  searchItems: [],
  status: 200,
  text: '',
  total: 0
}

/**
 * Sqwerl web application user interface component. The main class of a web application that allows users
 * to interact with an application server that keeps track of the things that make people smart.
 * @param props
 */
const Application = (props: Props): React.JSX.Element => {
  const logger = loggerFactory.create(Application)
  const [autoTheme, overrideAutoTheme] = useAutoTheme()
  const [derivedTheme] = useDerivedTheme(autoTheme, 'light')
  logger.info('Rendering the application')

  // This application's configuration information.
  const [configuration] = useState(Configuration)

  // The time and date when this application's contributor last signed in to an application server.
  const [contributorLastSignedInDateTime] = useState('')

  // The name of the contributor who is running this application.
  const [contributorName] = useState(configuration.anonymousContributorName)

  // The unique identifier for the repository of things that this application is displaying.
  const [currentRepositoryName] = useState(configuration.defaultRepositoryId.split('/').slice(-1)[0])

  // Text to search for, updated when the contributor requests to search for the text.
  const [currentSearchText, setCurrentSearchText] = useState('')

  // When a drop-down menu or modal is displayed are those modals hidden if the contributor clicks on the modal pane?
  const [doesClickingOnModalPaneHideModals, setDoesClickingOnModalPaneHideModals] = useState(false)

  // Is this application busy so that it can't react to contributors' input.
  const [isBusy, setIsBusy] = useState(true)

  const [fetcher] = useState(Fetcher(setIsBusy))

  // Do we have the timestamp when this application's contributor last signed in to an application server?
  const [hasLastSignedInDateTime] = useState(false)

  // Has this application's contributor's identity been verified?
  const [isContributorSignedIn] = useState(false)

  // Is this application busy fetching search results?
  const [isFetchingSearchResults, setIsFetchingSearchResults] = useState(false)

  // Is this application showing the home (default, root) view of things?
  const [isHome, setIsHome] = useState<boolean>(true)

  // Is this application displaying a drop-down menu?
  const [isMenuModalPaneVisible, setIsMenuModalPaneVisible] = useState(false)

  // Is this application's More... menu visible?
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false)

  // Is this application's Search menu visible?
  const [isSearchMenuVisible, setIsSearchMenuVisible] = useState(false)

  // Is this application's Sign In menu visible?
  const [isSignInMenuVisible, setIsSignInMenuVisible] = useState(false)

  // Path of things to navigate to in order to reach the thing whose properties this application is currently
  // displaying.
  const [path, setPath] = useState([{ id: '/', name: 'Home' }])

  // Searches repositories of things.
  const [searcher] = useState(Searcher())

  // Things that matched text that the contributor has searched for.
  const [searchResults, setSearchResults] =
    useState<SearchResults>(EMPTY_SEARCH_RESULTS)

  // Text to search for, updated as the contributor types the text to search for.
  const [searchText, setSearchText] = useState('')

  const context = useContext(ApplicationContext)

  const {
    applicationContentHorizontalSliderPercentage, applicationContentHorizontalSplitterWidthInPixels
  } = context

  const { children } = props

  const handleModalPaneOnClick = (): void => hideModals(state)

  const state: State = {
    autoTheme,
    configuration,
    context,
    doesClickingOnModalPaneHideModals,
    fetcher,
    overrideAutoTheme,
    path,
    setDoesClickingOnModalPaneHideModals,
    setIsMenuModalPaneVisible,
    setIsMoreMenuVisible,
    setIsSearchMenuVisible,
    setIsSignInMenuVisible,
    setPath
  }

  const setSearchResultsWrapper = (searchResults: SearchResults): void => {
    setSearchResults(searchResults)
  }

  return (
    <RouteChangeHandler
      basePath={configuration.basePath}
      handleHrefChange={(newUrl: string, oldUrl: string) => onUrlChanged(newUrl, oldUrl, state)}
      handlePathChange={(path: string, hash: string) => navigateToThing(path, hash, state)}
      handlePropertyChange={(path: string, hash: string, property: string) =>
        navigateToProperty(path, hash, property, state)}
      handleSelectionChange={(path: string, hash: string) => selectThing(path, hash, state)}
    >
      <main
        className={`sqwerl-application ${derivedTheme.toString()}`}
        data-testid='application'
        onKeyDown={e => {
          if (isMenuModalPaneVisible && (e.key === 'Escape')) {
            logger.info('Escape key pressed')
            hideModals(state)
          }
        }}
      >
        <CurrentThemeProvider themeName={autoTheme}>
        <IsBusyProvider>
          <BusyPane isVisible={isBusy} name='busyPane'><div /></BusyPane>
          <ModalPane
            isClickable={doesClickingOnModalPaneHideModals}
            isVisible={isMenuModalPaneVisible}
            name='application-menu-modal-pane'
            onClick={() => {
              if (doesClickingOnModalPaneHideModals) {
                hideModals(state)
              }
            }}
          >
            <div />
          </ModalPane>
          <div className='sqwerl-application-main-pane'>
            <header className='sqwerl-application-header'>
              <ModalityProvider value={isMenuModalPaneVisible}>
                <ApplicationMenuBar
                  classNameForSearchResults={classNameForSearchResults}
                  configuration={configuration}
                  currentRepositoryName={currentRepositoryName}
                  currentSearchText={currentSearchText}
                  fetcher={fetcher}
                  hideMenu={handleModalPaneOnClick}
                  isFetchingSearchResults={isFetchingSearchResults}
                  isMoreMenuVisible={isMoreMenuVisible}
                  isSearchMenuVisible={isSearchMenuVisible}
                  isSignInMenuVisible={isSignInMenuVisible}
                  searchDomainName={currentRepositoryName}
                  searcher={searcher}
                  searchResults={searchResults}
                  searchText={searchText}
                  setCurrentSearchText={setCurrentSearchText}
                  setIsFetchingSearchResults={setIsFetchingSearchResults}
                  setSearchResults={setSearchResultsWrapper}
                  setSearchText={setSearchText}
                  showMoreMenu={() => showMoreMenu(state)}
                  showSearchMenu={() => showSearchMenu(state)}
                  showSignInMenu={() => showSignInMenu(state)}
                  toggleTheme={() => toggleTheme(state)}
                >
                  {children}
                </ApplicationMenuBar>
              </ModalityProvider>
            </header>
            <ApplicationContentArea
              configuration={configuration}
              currentRepositoryName={currentRepositoryName}
              dividerPercentage={applicationContentHorizontalSliderPercentage}
              dividerWidthInPixels={applicationContentHorizontalSplitterWidthInPixels}
              fetcher={fetcher}
              hasLastSignedInDateTime={hasLastSignedInDateTime}
              isContributorSignedIn={isContributorSignedIn}
              isHome={isHome}
              popPath={() => popPath(state)}
              setPath={setPath}
              showProperties={(id: string) => showProperties(id, state)}
              contributorLastSignedInDateTime={contributorLastSignedInDateTime}
              contributorName={contributorName}
            />
          </div>
        </IsBusyProvider>
        </CurrentThemeProvider>
      </main>
    </RouteChangeHandler>
  )
}

/**
 * Returns a CSS class name to add to the user interface that displays the results of a request to search for text,
 * so that the user interface matches request's outcome.
 * @param searchResults Server-returned results for a request to search for text.
 * @returns A CSS class name. The CSS class name to add to the search results user interface to specify what type
 *          of interface to display based on the search results. For example: which interface to display when
 *          nothing was found, or only one thing was found, or more than one thing was found, or when too many
 *          things were found.
 */
const classNameForSearchResults = (searchResults: SearchResults | null): string => {
  let className = ''

  if (searchResults !== null) {
    if (!isNaN(searchResults.status)) {
      switch (searchResults.status) {
        case 404:
          className = 'nothing-found'
          break
        case 413:
          className = 'too-many-found'
          break
      }
    } else if (!isNaN(searchResults.total)) {
      className = searchResults.total > 1 ? 'more-than-one-found' : 'only-one-found'
    }
  }

  return className
}

/**
 * Hides this application's modal components such as drop-down menus and modal dialogs.
 * @param state
 */
const hideModals = (state: State): void => {
  const {
    setIsMenuModalPaneVisible,
    setIsMoreMenuVisible,
    setIsSearchMenuVisible,
    setIsSignInMenuVisible
  } = state

  const logger = loggerFactory.create(hideModals)
  logger.debug('Hiding all of the application\'s modal windows')

  const setVisibilityFunctions = [
    setIsMenuModalPaneVisible,
    setIsMoreMenuVisible,
    setIsSearchMenuVisible,
    setIsSignInMenuVisible
  ]

  setVisibilityFunctions.forEach(f => f(false))
}

/**
 * Notifies listeners that the address in the web browser's address bar has changed.
 * @param newPath  Path part of the new Uniform Resource Locator (URL).
 * @param newHash  Hash part of the new Uniform Resource Locator (URL), the part that follows a hash (#).
 * @param state
 */
const navigateToThing = (newPath: string, newHash: string, state: State): void => {
  const { context } = state

  context.navigateToThingEvents.fire(newPath, newHash)
}

/**
 * Notifies listeners that the property part of the web browser's address bar has changed.
 * @param newPath Path part of the new Uniform Resource Locator (URL).
 * @param newHash Hash part of the new Uniform Resource Locator (URL), the part that follows a hash (#).
 * @param newProperty Name of a thing's property.
 * @param state
 */
const navigateToProperty = (newPath: string, newHash: string, newProperty: string, state: State): void => {
  const { context } = state

  context.navigateToPropertyEvents.fire(newPath, newHash, newProperty)
}

/**
 * Called when the URL in the browser's address bar changes.
 * @param newUrl The new URL.
 * @param oldUrl The previous URL.
 * @param state
 */
const onUrlChanged = (newUrl: string, oldUrl: string, state: State): void => {
  const { context } = state

  context.urlChangedEvents.fire(newUrl, oldUrl)
}

const popPath = (state: State): void => {
  const { path, setPath } = state

  if (path.length > 1) {
    const newPath = path.slice()
    newPath.pop()
    setPath(newPath)
    navigateToThing(newPath[newPath.length - 1].id, '', state)
  } else {
    setPath([{ id: '/', name: 'Home' }])
    navigateToThing('/', '', state)
  }
}

/**
 * Notifies listeners that the selected thing (indicated by the current URL after the # symbol) has changed.
 * @param newPath Path part of the new Uniform Resource Locator (URL).
 * @param newHash Hash part of the new Uniform Resource Locator (URL), the part that follows a hash (#).
 * @param state
 */
const selectThing = (newPath: string, newHash: string, state: State): void => {
  const { context } = state
  const logger = loggerFactory.create(selectThing)
  logger.info(`Notifying listeners that the application is selecting the thing "${newHash}"`)
  context.selectThingEvents.fire(newPath, newHash)
}

/**
 * Displays this application's More menu that contains additional options.
 * @param state
 */
const showMoreMenu = (state: State): void => {
  const {
    setDoesClickingOnModalPaneHideModals,
    setIsMenuModalPaneVisible,
    setIsMoreMenuVisible,
    setIsSearchMenuVisible,
    setIsSignInMenuVisible
  } = state

  const logger = loggerFactory.create(showMoreMenu)
  logger.debug('Requested to show More menu')
  setDoesClickingOnModalPaneHideModals(true)
  setIsMenuModalPaneVisible(true)
  setIsMoreMenuVisible(true)
  setIsSearchMenuVisible(false)
  setIsSignInMenuVisible(false)
}

/**
 * Shows the properties (and their values) of the thing with the given ID within this application's properties view.
 * @param id A thing's unique ID.
 * @param state
 */
const showProperties = (id: string, state: State): void => {
  const { configuration, context, fetcher } = state
  const logger = loggerFactory.create(showProperties)
  logger.info(`Requested to show the properties of the thing with the id "${id}"`)

  if (id.length > 0) {
    if (id === (configuration as { basePath: string }).basePath) {
      // TODO
      logger.info('Requested to go home')
    } else {
      // TODO - Show contributors that we are fetching a thing's properties.
      fetcher.requestData({
        url: id /// TODO - `${configuration.baseUrl}${id}`
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            const values = { id, properties: data }
            context.propertiesRetrievedEvents.fire(values)
          }).catch(result => {
            logger.error('Failed to parse a thing\'s properties. ' +
              `Response: ${JSON.stringify(result)}`
            )
          })
        } else {
          logger.error(`Failed to retrieve the properties of the thing with the url "${response.url}"\n` +
            `Error code: ${response.status}\n` +
            `Error message: "${response.statusText}"`
          )
        }
      }).catch(result => {
        logger.error(
          `An error occurred while fetching the properties of the thing with the id: "${id}".\n` +
          `Response: ${JSON.stringify(result)}`
        )
      })
    }
  }
}

/**
 * Displays this application's menu that shows search results.
 * @param state
 */
const showSearchMenu = (state: State): void => {
  const {
    setDoesClickingOnModalPaneHideModals,
    setIsMenuModalPaneVisible,
    setIsMoreMenuVisible,
    setIsSearchMenuVisible,
    setIsSignInMenuVisible
  } = state

  const logger = loggerFactory.create(showSearchMenu)
  logger.debug('Requested to show Search menu')
  setDoesClickingOnModalPaneHideModals(false)
  setIsMenuModalPaneVisible(true)
  setIsMoreMenuVisible(false)
  setIsSearchMenuVisible(true)
  setIsSignInMenuVisible(false)
}

/**
 * Displays this application's menu that allows contributors to sign in to their accounts.
 * @param state
 */
const showSignInMenu = (state: State): void => {
  const {
    setDoesClickingOnModalPaneHideModals,
    setIsMenuModalPaneVisible,
    setIsMoreMenuVisible,
    setIsSearchMenuVisible,
    setIsSignInMenuVisible
  } = state

  const logger = loggerFactory.create(showSignInMenu)
  logger.debug('Requested to show Sign In menu')
  setDoesClickingOnModalPaneHideModals(true)
  setIsMenuModalPaneVisible(true)
  setIsMoreMenuVisible(false)
  setIsSearchMenuVisible(false)
  setIsSignInMenuVisible(true)
}

/**
 * Toggles this application's color theme between light and dark.
 * @param state
 */
const toggleTheme = (state: State): void => {
  const { autoTheme, overrideAutoTheme, setIsMenuModalPaneVisible, setIsMoreMenuVisible } = state
  const logger = loggerFactory.create(toggleTheme)

  logger.info('Toggling the user interface theme between light and dark')
  setIsMenuModalPaneVisible(false)
  setIsMoreMenuVisible(false)
  overrideAutoTheme(autoTheme === 'dark' ? 'light' : 'dark')
}

const loggerFactory = LoggerFactory(Application)

export default Application
