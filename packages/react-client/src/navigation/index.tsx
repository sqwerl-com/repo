import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { CallbackType } from '@/context/application/events'
import { ConfigurationType } from '@/configuration'
import type { FetcherType } from '@/fetcher'
import { Item } from '@/navigation/item'
import ListView from '@/navigation/list-view'
import Logger, { LoggerType } from '@/logger'
import NavigationBar from '@/navigation/navigation-bar'
import { State as ApplicationState } from '@/application'
import { Thing } from '@/utils/types'
import { useContext, useEffect, useState } from 'react'
import * as React from 'react'

interface Children {
  count: number
  members: Thing[]
  offset: number
  totalCount: number
}

interface DataType {
  children: Children
  id: string
  isType?: boolean
  path: string
}

let logger: LoggerType

interface NavigationContext {
  configuration: ConfigurationType
  currentRepositoryName: string
  fetcher: FetcherType
  homeId: string
  items: Item[]
  listItemHeightInPixels: number
  loadingOffsets: Map<string, string>
  logger: LoggerType
  path: string
  setAnimationClassName: (name: string) => void
  setCurrentName: (name: string | string[]) => void
  setGoBackUrl: (name: string) => void
  setIsBusy: (isBusy: boolean) => void
  setIsHome: (isHome: boolean) => void
  setIsLoadingChildren: (isLoading: boolean) => void
  setItems: (items: Item[]) => void
  setListItemHeightInPixels: (height: number) => void
  setParentId: (id: string | null) => void
  setParentName: (name: string) => void
  setThing: (thing: Thing | null) => void
  showProperties: (path: string) => void
  setShowTypeNames: (showTypeNames: boolean) => void
}

interface Props {
  /** Application configuration information. */
  configuration: ConfigurationType

  /** The name of the repository of things that this application is displaying. */
  currentRepositoryName: string

  /** The unique identifier for a home (initial) location within a collection of things. */
  homeId: string

  /** Fetches information from a remote server. */
  fetcher: FetcherType

  /** Call to go back to a previously visited thing. */
  popPath: (state: ApplicationState) => void

  /** Call set the current path to a thing whose properties are being displayed within an application. */
  setPath: (path: [{ id: string, name: string }]) => void

  setThing: (thing: Thing | null) => void

  /** Call to fetch and show a thing's properties. */
  showProperties: (path: string) => void

  thing: Thing | null
}

interface State {
  /** Class name to add to this navigator's HTML element to animate a transition. */
  animationClassName: string

  /** Application configuration information. */
  configuration: ConfigurationType

  context: ApplicationContextType

  /** The name of the repository of things that this application is displaying. */
  currentRepositoryName: string

  /** The name of the thing we are currently navigating from. */
  currentName: string | string[]

  /** Unique path to the thing we are currently navigating from. */
  currentPath?: string

  /** Fetches information from a remote server. */
  fetcher: FetcherType

  /** URL for the thing that we last navigated from. */
  goBackUrl: string

  /** The unique identifier for a home (initial) location within a collection of things. */
  homeId: string

  /** Is this navigator busy fetching information? */
  isBusy: boolean

  /** Are we at the home (initial) navigation location? */
  isHome: boolean

  isLoadingChildren: boolean

  /** Items representing the things we can navigate to from the thing we are currently navigating from. */
  items: Item[]

  /**
   * Keys are URLs to load items into the navigation list. These keys are kept while a request to load items into
   * the navigation list is made in order to not make duplicate requests for list items.
   */
  loadingOffsets: Map<string, string>

  logger: LoggerType

  /** Unique identifier for the thing that is the parent of the thing we are currently navigating from. */
  parentId: string | null

  /** Name of the thing that is the parent of the thing we are currently navigating from. */
  parentName: string

  selectedItemId: string

  selectingItemId: string

  setAnimationClassName: (name: string) => void

  setCurrentName: (name: string | string[]) => void

  setCurrentPath: (path: string) => void

  setGoBackUrl: (url: string) => void

  setIsBusy: (isBusy: boolean) => void

  setIsHome: (isHome: boolean) => void

  setIsLoadingChildren: (isLoading: boolean) => void

  setItems: (items: Item[]) => void

  setParentId: (id: string | null) => void

  setParentName: (name: string) => void

  setPath: (path: [{ id: string, name: string }]) => void

  setSelectingItemId: (id: string) => void

  setSelectedItemId: (id: string) => void

  setThing: (thing: Thing | null) => void

  showProperties: (path: string) => void

  showTypeNames: boolean

  thing: Thing | null
}

let lastPath: string | null = null

/**
 * User interface components that allow users to navigate information arranged in a hierarchy (parent-child
 * relationships).
 * @param props
 */
const Navigation = (props: Props): React.JSX.Element => {
  logger = Logger(Navigation, Navigation)
  const {
    configuration,
    currentRepositoryName,
    fetcher,
    homeId,
    popPath,
    setPath,
    showProperties,
    setThing,
    thing
  } = props
  const context = useContext(ApplicationContext)
  const [animationClassName, setAnimationClassName] = useState('')
  const [currentName, setCurrentName] = useState<string | string[]>('')
  const [currentPath, setCurrentPath] = useState('')
  const [goBackUrl, setGoBackUrl] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [isHome, setIsHome] = useState(true)
  const [isLoadingChildren, setIsLoadingChildren] = useState<boolean>(false)
  const [items, setItems] = useState<Item[]>([])
  const [listItemHeightInPixels, setListItemHeightInPixels] = useState<number>(context.rowHeightInPixels)
  const [loadingOffsets] = useState<Map<string, string>>(new Map<string, string>())
  const [parentId, setParentId] = useState<string | null>('')
  const [parentName, setParentName] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [selectingItemId, setSelectingItemId] = useState<string>('')
  const [showTypeNames, setShowTypeNames] = useState<boolean>(true)
  const state: State = {
    animationClassName,
    configuration,
    context,
    currentRepositoryName,
    currentName,
    currentPath,
    fetcher,
    goBackUrl,
    homeId,
    isBusy,
    isHome,
    isLoadingChildren,
    items,
    loadingOffsets,
    logger,
    parentId,
    parentName,
    selectedItemId,
    selectingItemId,
    setAnimationClassName,
    setCurrentName,
    setCurrentPath,
    setGoBackUrl,
    setIsBusy,
    setIsHome,
    setIsLoadingChildren,
    setItems,
    setParentId,
    setParentName,
    setPath,
    setSelectedItemId,
    setSelectingItemId,
    setThing,
    showProperties,
    showTypeNames,
    thing
  }
  useEffect(() => {
    const onNavigateToThing = (path: string): void => {
      onNavigateTo({
        path,
        configuration,
        currentRepositoryName,
        fetcher,
        homeId,
        items,
        listItemHeightInPixels,
        loadingOffsets,
        logger,
        setAnimationClassName,
        setCurrentName,
        setGoBackUrl,
        setIsBusy,
        setIsHome,
        setIsLoadingChildren,
        setItems,
        setListItemHeightInPixels,
        setParentId,
        setParentName,
        setThing,
        showProperties,
        setShowTypeNames
      })
    }
    const onSelectThing: CallbackType = (_path: string, hash?: string): void =>
      onSelectedThingChanged(hash ?? '', logger, setSelectedItemId, setSelectingItemId)
    context.navigateToThingEvents.register(onNavigateToThing)
    context.selectThingEvents.register(onSelectThing)
    return () => {
      context.navigateToThingEvents.unregister(onNavigateToThing)
      context.selectThingEvents.unregister(onSelectThing)
    }
  }, [
    configuration,
    context.navigateToThingEvents,
    context.selectThingEvents,
    currentRepositoryName,
    fetcher,
    homeId,
    items,
    loadingOffsets,
    setAnimationClassName,
    setGoBackUrl,
    setIsBusy,
    setIsHome,
    setItems,
    setSelectedItemId,
    setThing,
    showProperties
  ])
  return (
    <section className='sqwerl-navigation-container'>
      <div className='sqwerl-navigation-busy-container'>
        <div className='sqwerl-navigation-bar-busy'>
          <div className='sqwerl-navigation-bar-content-busy' />
        </div>
        {/* TODO - Make this dynamic. Add a loop that creates items to fill the visible space */}
        <div className='sqwerl-list-busy'>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item odd'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item odd'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item odd'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item odd'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item odd'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item odd'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item odd'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
          <div className='sqwerl-navigation-busy-item even'>
            <div className='sqwerl-navigation-busy-item-content' />
          </div>
        </div>
      </div>
      <div className={`sqwerl-navigation ${animationClassName}`}>
        <NavigationBar
          currentName={currentName}
          isHome={isHome}
          itemCount={items.length}
          goBackUrl={goBackUrl}
          parentName={parentName}
          popPath={popPath}
          setAnimationClassName={setAnimationClassName}
          setSelectedItemId={setSelectedItemId}
          showProperties={showProperties}
        />
        {!isBusy && items.length === 0 ? renderNoItemsToShow(selectingItemId) : renderListItems(context, state)}
      </div>
    </section>
  )
}

/**
 * Does the given item represent something that has child things?
 * @param item An item that represents a thing.
 */
const hasChildren = (item: Item): boolean => {
  return !!{}.hasOwnProperty.call(item, 'childrenCount')
}

let pending: number

const loadMoreChildren = (startIndex: number, stopIndex: number, state: State): void => {
  const {
    configuration, fetcher, items, loadingOffsets, logger, parentId, setIsLoadingChildren, setItems
  } = state
  logger.setContext(loadMoreChildren)
  // End the pending request, and create a new pending request.
  clearTimeout(pending)
  pending = window.setTimeout(() => {
    setIsLoadingChildren(true)
    const parent = parentId !== null ? `${parentId.slice(1)}/` : ''
    const url =
      `${configuration.baseUrl}/${parent}summary?limit=${stopIndex - startIndex}&offset=${startIndex}` +
        '&properties=children'
    loadingOffsets.set(url, '')
    fetcher.requestData({
      dontSetBusy: true,
      url
    }).then((response) => {
      setIsLoadingChildren(false)
      loadingOffsets.delete(url)
      if (response.status === 200) {
        response.json().then(
          (data: { children?: { members?: Thing[] } }): void => {
            if (data?.children?.members !== undefined) {
              const newItems: Item[] = items.map(item => { return { ...item } })
              data.children.members.forEach((member: Thing, index: number) => {
                newItems[startIndex + index] = { childIndex: 0, startOffset: 0, isLoading: false, ...member }
              })
              setItems(newItems)
            }
          },
          (reason) => {
            logger.error(`An error occurred while loading children: ${JSON.stringify(reason)}`)
          })
      } else {
        loadingOffsets.delete(url)
        onFetchingChildrenFailed(logger, response, state)
      }
    }).catch((reason) => {
      loadingOffsets.delete(url)
      onFetchingChildrenFailed(logger, reason, state)
    })
  }, 500)
}

/**
 * Navigates to the thing located at the end of the given path.
 * @param context
 * @private
 */
const navigateTo = (context: NavigationContext): void => {
  const {
    path,
    configuration,
    currentRepositoryName,
    fetcher,
    homeId,
    loadingOffsets,
    logger,
    setGoBackUrl,
    setIsBusy,
    setThing
  } = context
  const { applicationName, basePath, baseUrl } = configuration
  loadingOffsets.clear()
  if (path === basePath) {
    setThing(null)
  } else {
    const pathComponents = path.split('/')
    const id = '/' + pathComponents.slice(1, pathComponents.length - 1).join('/')
    // If we are navigating to a repository, then set the go back link to the list of repositories
    if (id === `/${currentRepositoryName}/types/repositories`) {
      setGoBackUrl('')
    } else {
      // If we are navigating to a repository's types (<repository>/types) then set the go back link
      // to the repository itself.
      if (pathComponents.length === 3) {
        const repositoryName = pathComponents[1]
        setGoBackUrl(`/${repositoryName}/types/repositories/${repositoryName}`)
      } else {
        // Set the go back url to take contributors back up a level, and to select the previously selected item.
        const parentPath = pathComponents.slice(0, pathComponents.length - 1).join('/')
        setGoBackUrl(`${parentPath}#/${configuration.applicationName}${id}`)
      }
    }
  }
  setIsBusy(true)
  const url =
    `${(path === basePath)
      ? baseUrl + homeId
      : ('/' + applicationName + '/' + path.slice(basePath.length))}/summary?limit=25&offset=0&properties=children`
  fetcher.requestData({
    url
  }).then((response) => {
    if (response.status === 200) {
      response.json().then(
        (data) => {
          onDataRetrieved(url, data, context, path !== lastPath)
          lastPath = path
        },
        (reason) => {
          logger.error(`An error occurred while loading the url "${url}": ${JSON.stringify(reason)}`)
        })
    } else {
      onFetchingThingFailed(response, context)
    }
    setIsBusy(false)
  }, (response) => {
    logger.error(`Failed to fetch data for the thing at the path "${path}", response="${JSON.stringify(response)}"`)
    onFetchingThingFailed(response, context)
    setIsBusy(false)
  })
}

/**
 * Called when an error occurs while trying to fetch information about a thing's children from a server.
 * @param logger
 * @param response A response from an HTTP request.
 * @param state
 * @private
 */
const onFetchingChildrenFailed = (logger: LoggerType, response: Response, state: State): void => {
  const { setIsBusy } = state
  logger.setContext(onFetchingChildrenFailed)
  logger.warn(`Unable to fetch children: response=${JSON.stringify(response)}`)
  setIsBusy(false)
}

/**
 * Called when an error occurs while trying to fetch information about a thing from a server.
 * @param response
 * @param context
 * @private
 */
const onFetchingThingFailed = (response: Response, context: NavigationContext): void => {
  const { logger, setAnimationClassName, setIsBusy } = context
  logger.setContext(onFetchingThingFailed)
  setIsBusy(false)
  if (response.status === 440) {
    logger.error('Invalid contributor token. Contributor is not signed in')
    document.cookie = 'sqwerl-session=0;expires=Thu 01 Jan 1970 00:00:00 GMT'
    // TODO - Update the contributor's sign in status
    setAnimationClassName('')
    navigateTo({ ...context, path: '/' })
  }
}

/**
 * Called when the data that describes navigation items have successfully been retrieved from a server.
 * @param url The Uniform Resource Locator (web address) where data was retrieved from.
 * @param data Results returned from a server.
 * @param context
 * @param refreshList if true, re-populate the navigation list with items.
 * @private
 */
const onDataRetrieved = (url: string, data: DataType, context: NavigationContext, refreshList: boolean): void => {
  const {
    currentRepositoryName,
    homeId,
    listItemHeightInPixels,
    setAnimationClassName,
    setCurrentName,
    setItems,
    setIsHome,
    setListItemHeightInPixels,
    setParentId,
    setParentName,
    setShowTypeNames,
    showProperties
  } = context
  logger.setContext(onDataRetrieved)
  logger.info(`Successfully loaded navigation items from "${url}"`)
  const isHome = data.id === homeId
  const newItems = []
  if ({}.hasOwnProperty.call(data, 'children')) {
    onInternalNodeDataRetrieved(
      currentRepositoryName,
      data,
      homeId,
      logger,
      setCurrentName,
      setParentId,
      setParentName
    )
    const { members, offset, totalCount } = data.children
    const hasIsType = {}.hasOwnProperty.call(data, 'isType')
    const showTypeNames = !(hasIsType ?? data.isType)
    setShowTypeNames(showTypeNames)
    setListItemHeightInPixels(showTypeNames ? listItemHeightInPixels * 1.5 : listItemHeightInPixels)
    if (totalCount === 0) {
      setItems([])
    }
    if (refreshList) {
      for (let i = 0; i < totalCount; i++) {
        let item: Item
        if ((i < offset) || (i >= offset + members.length)) {
          item = {
            childIndex: -1,
            children: { members: [], offset: 0, totalCount: 0 },
            childrenCount: 0,
            description: '',
            id: '',
            isLoading: true,
            name: '',
            path: '',
            shortDescription: '',
            startOffset: Math.round(i / 25) * 25,
            typeName: ''
          }
        } else {
          item = {
            childIndex: 0,
            isLoading: false,
            ...members[i - offset],
            startOffset: 0
          }
        }
        newItems.push(item)
      }
      setItems(newItems)
    }

    const location = window.location
    const hash = location.hash
    if (hash.length > 0) {
      showProperties(hash.slice(1))
    } else if (hash.length === 0) {
      showProperties('/')
    }
    // TODO - Is this necessary, and if so, are we creating a memory leak?
    setTimeout(() => {
      setAnimationClassName('')
      setIsHome(isHome)
      // TODO - setItems(items)
    }, 300)
  } else {
    setIsHome(isHome)
  }
}

/**
 * Called when data that describes a navigation item that represents a composite thing--a thing that has children
 * --has successfully been retrieved from a server.
 * @param currentRepositoryName The name of the repository of things that this application is displaying.
 * @param data Results returned from a server.
 * @param homeId
 * @param logger
 * @param setCurrentName
 * @param setParentId
 * @param setParentName
 * @private
 */
const onInternalNodeDataRetrieved = (
  currentRepositoryName: string,
  data: DataType,
  homeId: string,
  logger: LoggerType,
  setCurrentName: (name: string | string[]) => void,
  setParentId: (parentId: string | null) => void,
  setParentName: (name: string) => void): void => {
  logger.setContext(onInternalNodeDataRetrieved)
  let currentName: string | string[]
  let parentId: string | null = null
  let parentName = ''
  if (data.id === homeId) {
    currentName = 'Home'
  } else {
    const idComponents = data.id.split('/')
    const idLength = idComponents.length
    const pathComponents = data.path.split('/')
    const pathLength = pathComponents.length
    // If the path is longer than '${currentRepository}/types'...
    if (pathLength >= 3) {
      currentName = pathComponents.slice(pathLength - 1)
      parentId = data.id
      parentName = pathComponents[pathLength - 2]
    } else {
      parentId = `/${currentRepositoryName}`
      parentName = currentRepositoryName
      currentName = pathComponents.slice(idLength - 1)
    }
    // TODO Show the properties with the given data we've retrieved. showProperties(data.id)
  }
  if (document.location.hash !== '') {
    // TODO - Select the item that matches the hash.
  }
  setCurrentName(currentName)
  setParentId(parentId)
  setParentName(parentName)
}

/**
 * Called when the application is requested to navigate to a thing.
 * @param context
 */
const onNavigateTo = (context: NavigationContext): void => {
  const { path } = context
  logger.setContext(onNavigateTo).info(`Navigating to the thing at the path: "${path}"`)
  navigateTo(context)
}

/**
 * Called when the contributor selects a thing.
 * @param hash
 * @param logger
 * @param setSelectedItemId
 * @param setSelectingItemId
 */
const onSelectedThingChanged = (
  hash: string,
  logger: LoggerType,
  setSelectedItemId: (hash: string) => void,
  setSelectingItemId: (hash: string) => void
): void => {
  logger.setContext(onSelectedThingChanged).info(`Selecting the thing with the id "${hash}"`)
  selectThing(hash, setSelectedItemId, setSelectingItemId)
}

/**
 * Renders a list of items that represent things.
 * @param context
 * @param state
 */
const renderListItems = (context: ApplicationContextType, state: State): React.JSX.Element => {
  const {
    rowHeightInPixels
  } = context
  const {
    configuration,
    currentRepositoryName,
    items,
    selectedItemId,
    selectingItemId,
    setAnimationClassName,
    setGoBackUrl,
    setSelectedItemId,
    setSelectingItemId,
    showProperties,
    showTypeNames
  } = state
  return (
    <>
      <ListView
        averageItemHeight={51}
        configuration={configuration}
        currentRepositoryName={currentRepositoryName}
        hasChildren={hasChildren}
        items={items}
        listItemHeightInPixels={rowHeightInPixels}
        loadChildren={(startIndex: number, stopIndex: number): Promise<void> | void =>
          loadMoreChildren(startIndex, stopIndex, state)}
        setAnimationClassName={setAnimationClassName}
        selectedItemId={selectedItemId}
        selectingItemId={selectingItemId}
        setSelectedItemId={setSelectedItemId}
        setSelectingItemId={setSelectingItemId}
        setGoBackUrl={setGoBackUrl}
        showProperties={showProperties}
        showTypeNames={showTypeNames}
      />
      <div className='sqwerl-button-bar'>
        {/* TODO - Internationalize */}
        <button>Home</button>
        <button>...</button>
      </div>
    </>
  )
}

/**
 * Renders an empty list of things.
 * @param parentId
 * @param state
 */
const renderNoItemsToShow = (parentId: string): React.JSX.Element => {
  /* TODO - Design and internationalize */
  return (
    <div>
      <span>Nothing to show.</span>
      <span>{`Either there are no ${parentId} things, or you don't have permission to view them.`}</span>
    </div>
  )
}

/**
 * Selects the list item that represents the thing with the given unique id.
 * @param hash A thing's unique identifier.
 * @param setSelectedItemId Call to set the thing that the contributor is selecting.
 * @param setSelectingItemId Call to set the thing that is selected.
 */
const selectThing = (
  hash: string, setSelectedItemId: (id: string) => void, setSelectingItemId: (id: string) => void
): void => {
  setSelectingItemId(hash)
  setSelectedItemId('')
  setTimeout(() => {
    setSelectingItemId('')
    setSelectedItemId(hash)
  }, 300)
}

export default Navigation
