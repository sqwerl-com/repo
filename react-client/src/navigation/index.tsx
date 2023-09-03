import ApplicationContext, { ApplicationContextType } from 'context/application'
import { ConfigurationType } from 'configuration'
import type { FetcherType } from 'fetcher'
import { Item } from 'navigation/item'
import ListView from 'navigation/list-view'
import Logger, { LoggerType } from 'logger'
import NavigationBar from 'navigation/navigation-bar'
import { Thing } from 'utils/types'
import { useContext, useEffect, useState } from 'react'
import * as React from 'react'

interface Children {
  count: number
  members: Object[]
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
  currentLibraryName: string
  fetcher: FetcherType
  homeId: string
  items: Item[]
  listItemHeightInPixels: number
  loadingOffsets: Map<string, string>
  logger: LoggerType
  path: string
  setAnimationClassName: (name: string) => void
  setCurrentName: (name: string) => void
  setGoBackUrl: (name: string) => void
  setIsBusy: (isBusy: boolean) => void
  setIsHome: (isHome: boolean) => void
  setItems: Function
  setListItemHeightInPixels: (height: number) => void
  setParentId: (id: string) => void
  setParentName: (name: string) => void
  setThing: Function
  showProperties: (path: string) => void
}

interface Props {
  /** Application configuration information. */
  configuration: ConfigurationType

  /** The name of the library of things that this application is displaying. */
  currentLibraryName: string

  /** The unique identifier for a home (initial) location within a collection of things. */
  homeId: string

  /** Fetches information from a remote server. */
  fetcher: FetcherType

  /** Call to go back to a previously visited thing. */
  popPath: Function

  /** Call set the current path to a thing whose properties are being displayed within an application. */
  setPath: (path: any) => void

  setThing: Function

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

  /** The name of the library of things that this application is displaying. */
  currentLibraryName: string

  /** The name of the thing we are currently navigating from. */
  currentName: string

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

  /** Items representing the things we can navigate to from the the thing we are currently navigating from. */
  items: Item[]

  /**
   * Keys are URLs to load items into the navigation list. These keys are kept while a request to load items into
   * the navigation list is made in order to not make duplicate requests for list items.
   */
  loadingOffsets: Map<string, string>

  logger: LoggerType

  /** Unique identifier for the thing that is the parent of the thing we are currently navigating from. */
  parentId: string

  /** Name of the thing that is the parent of the thing we are currently navigating from. */
  parentName: string

  selectedItemId: string

  setAnimationClassName: (name: string) => void

  setCurrentName: (name: string) => void

  setCurrentPath: (path: string) => void

  setGoBackUrl: (url: string) => void

  setIsBusy: (isBusy: boolean) => void

  setIsHome: (isHome: boolean) => void

  setIsLoadingChildren: (isLoading: boolean) => void

  setItems: Function

  setParentId: (id: string) => void

  setParentName: (name: string) => void

  setPath: (path: any) => void

  setSelectedItemId: (id: string) => void

  setThing: Function

  showProperties: (path: string) => void

  thing: any
}

/**
 * User interface components that allow users to navigate information arranged in a hierarchy (parent-child
 * relationships).
 * @param props
 */
const Navigation = (props: Props): React.JSX.Element => {
  logger = Logger(Navigation, Navigation)
  const {
    configuration,
    currentLibraryName,
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
  const [currentName, setCurrentName] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [goBackUrl, setGoBackUrl] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [isHome, setIsHome] = useState(true)
  const [isLoadingChildren, setIsLoadingChildren] = useState<boolean>(false)
  const [items, setItems] = useState([])
  const [listItemHeightInPixels, setListItemHeightInPixels] = useState<number>(context.rowHeightInPixels)
  const [loadingOffsets] = useState<Map<string, string>>(new Map<string, string>())
  const [parentId, setParentId] = useState<string>('')
  const [parentName, setParentName] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const state: State = {
    animationClassName,
    configuration,
    context,
    currentLibraryName,
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
    setThing,
    showProperties,
    thing
  }
  useEffect(() => {
    const onNavigateToThing = (path: string, hash: string, animationClassName: string): void => {
      onNavigateTo({
        path,
        configuration,
        currentLibraryName,
        fetcher,
        homeId,
        items,
        listItemHeightInPixels: context.rowHeightInPixels,
        loadingOffsets,
        logger,
        setAnimationClassName,
        setCurrentName,
        setGoBackUrl,
        setIsBusy,
        setIsHome,
        setItems,
        setListItemHeightInPixels,
        setParentId,
        setParentName,
        setThing,
        showProperties
      })
    }
    const onSelectThing = (path: string, hash: string): void =>
      onSelectedThingChanged(hash, logger, setSelectedItemId)
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
    currentLibraryName,
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
    <section className={`sqwerl-navigation ${animationClassName}`}>
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
      <ListView
        averageItemHeight={51}
        configuration={configuration}
        currentLibraryName={currentLibraryName}
        hasChildren={hasChildren}
        items={items}
        listItemHeightInPixels={listItemHeightInPixels}
        loadChildren={(startIndex: number, stopIndex: number): Promise<void> | void =>
          loadMoreChildren(startIndex, stopIndex, state)}
        setAnimationClassName={setAnimationClassName}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
        setGoBackUrl={setGoBackUrl}
        showProperties={showProperties}
      />
      <div className='sqwerl-button-bar'>
        <button>Home</button>
        <button>...</button>
      </div>
    </section>
  )
}

/**
 * Does the given item represent something that has child things?
 * @param item An item that represents a thing.
 */
const hasChildren = (item: Item): boolean => {
  return !!{}.hasOwnProperty.call(item, 'childrenCount') && (item.childrenCount > 0)
}

let pending: number

const loadMoreChildren = (startIndex: number, stopIndex: number, state: State): void => {
  const {
    configuration, fetcher, items, loadingOffsets, logger, parentId, setIsLoadingChildren, setItems, thing
  } = state
  logger.setContext(loadMoreChildren)
  // End the pending request, and create a new pending request.
  clearTimeout(pending)
  pending = window.setTimeout(() => {
    setIsLoadingChildren(true)
    const url =
      `${configuration.baseUrl}/${parentId.slice(1)}/summary?limit=${stopIndex - startIndex}&offset=${startIndex}` +
        '&properties=children'
    loadingOffsets.set(url, '')
    fetcher.requestData({
      dontSetBusy: true,
      url
    }).then((response: any) => {
      setIsLoadingChildren(false)
      loadingOffsets.delete(url)
      if (response.status === 200) {
        response.json().then((data: { children?: { members?: Thing[] } }) => {
          if (data?.children?.members !== undefined) {
            const newItems = items.map(item => { return { ...item } })
            data.children.members.forEach((member: any, index: number) => {
              const newItem = { isLoading: false, ...member }
              if (!!thing) {
                newItem.showTypeName = !({}.hasOwnProperty.call(thing, 'isType') && thing.isType)
              }
              newItems[startIndex + index] = newItem
            })
            setItems(newItems)
          }
        })
      } else {
        loadingOffsets.delete(url)
        onFetchingChildrenFailed(response, state)
      }
    }).catch((reason: any) => {
      loadingOffsets.delete(url)
      onFetchingChildrenFailed(reason, state)
    })
  }, 500)
}

/**
 * Navigates to the thing located at the end of the given path.
 * @param path Path through a hierarchy of things.
 * @param configuration
 * @param currentLibraryName
 * @param fetcher
 * @param homeId
 * @param items
 * @param loadingOffsets
 * @param logger
 * @param setAnimationClassName
 * @param setCurrentName
 * @param setGoBackUrl
 * @param setIsBusy
 * @param setIsHome
 * @param setItems
 * @param setParentId
 * @param setParentName
 * @param setThing
 * @param showProperties
 * @private
 */
const navigateTo = (context: NavigationContext): void => {
  const {
    path,
    configuration,
    currentLibraryName,
    fetcher,
    homeId,
    items,
    listItemHeightInPixels,
    loadingOffsets,
    logger,
    setGoBackUrl,
    setIsBusy,
    setItems,
    setThing,
    showProperties
  } = context
  const { basePath, baseUrl } = configuration
  const url =
    `${baseUrl}${(path === basePath)
      ? homeId
      : ('/' + path.slice(basePath.length))}/summary?limit=25&offset=0&properties=children`
  loadingOffsets.clear()
  if (path === basePath) {
    setThing(null)
  } else {
    const pathComponents = path.split('/')
    const id = '/' + pathComponents.slice(2, pathComponents.length - 1).join('/')
    if (id === '/') {
      // TODO - Set the id to point to the current library's changes.
      setGoBackUrl(configuration.basePath)
    } else {
      // Set the go back url to take users back and to select the previously selected item.
      setGoBackUrl(`${basePath}${id.slice(1)}#/${configuration.applicationName}/${currentLibraryName}${id}`)
    }
  }
  setIsBusy(true)
  fetcher.requestData({
    url
  }).then((response: any) => {
    if (response.status === 200) {
      response.json().then((data: any) => {
        onDataRetrieved(url, data, context)
      })
    } else {
      onFetchingThingFailed(response, context)
    }
    setIsBusy(false)
  }, (response: any) => {
    logger.error(`Failed to fetch data for the thing at the path "${path}", response="${JSON.stringify(response)}"`)
    onFetchingThingFailed(response, context)
    setIsBusy(false)
  })
}

/**
 * Called when an error occurs while trying to fetch information about a thing's children from a server.
 * @param response A response from an HTTP request.
 * @param state
 * @private
 */
const onFetchingChildrenFailed = (response: any, state: State): void => {
  const { setIsBusy } = state
  setIsBusy(false)
}

/**
 * Called when an error occurs while trying to fetch information about a thing from a server.
 * @param response
 * @param context
 * @private
 */
const onFetchingThingFailed = (response: any, context: NavigationContext): void => {
  const {
    configuration,
    currentLibraryName,
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
    setItems,
    setListItemHeightInPixels,
    setParentId,
    setParentName,
    setThing,
    showProperties
  } = context
  logger.setContext(onFetchingThingFailed)
  setIsBusy(false)
  if (response.status === 440) {
    logger.error('Invalid user token. User is not signed in')
    document.cookie = 'sqwerl-session=0;expires=Thu 01 Jan 1970 00:00:00 GMT'
    // TODO - Update the user's sign in status
    setAnimationClassName('')
    navigateTo({ ...context, path: '/' })
  }
}

/**
 * Called when the data that describes navigation items has successfully been retrieved from a server.
 * @param url The Uniform Resource Locator (web address) where data was retrieved from.
 * @param data Results returned from a server.
 * @param homeId
 * @param items
 * @param logger
 * @param setAnimationClassName
 * @param setCurrentName
 * @param setIsHome
 * @param setItems
 * @param setParentId
 * @param setParentName
 * @param showProperties
 * @private
 */
const onDataRetrieved = (url: string, data: DataType, context: NavigationContext): void => {
  const {
    homeId,
    listItemHeightInPixels,
    setAnimationClassName,
    setCurrentName,
    setItems,
    setIsHome,
    setListItemHeightInPixels,
    setParentId,
    setParentName,
    showProperties
  } = context
  logger.setContext(onDataRetrieved)
  logger.info(`Successfully loaded navigation items from "${url}"`)
  const isHome = data.id === homeId
  const newItems = []
  if ({}.hasOwnProperty.call(data, 'children')) {
    onInternalNodeDataRetrieved(
      data,
      homeId,
      logger,
      setCurrentName,
      setParentId,
      setParentName
    )
    const { members, offset, totalCount } = data.children
    const showTypeName = !({}.hasOwnProperty.call(data, 'isType') && data.isType)
    setListItemHeightInPixels(showTypeName ? listItemHeightInPixels * 1.5 : listItemHeightInPixels)
    for (let i = 0; i < totalCount; i++) {
      let item: any
      if ((i < offset) || (i >= offset + members.length)) {
        item = {
          childIndex: -1,
          children: { count: 0 },
          childrenCount: 0,
          description: '',
          id: '',
          isLoading: true,
          name: '',
          path: '',
          shortDescription: '',
          showTypeName,
          startOffset: Math.round(i / 25) * 25,
          typeName: ''
        }
      } else {
        item = members[i - offset]
        item.showTypeName = showTypeName
        item.isLoading = false
      }
      newItems.push(item)
    }
    setItems(newItems)
    const location = window.location
    const hash = location.hash
    if (hash.length > 0) {
      showProperties(hash.slice(1))
    } else if ((hash !== undefined) && (hash.length === 0)) {
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
 * @param data Results returned from a server.
 * @param homeId
 * @param logger
 * @param setCurrentName
 * @param setParentId
 * @param setParentName
 * @private
 */
const onInternalNodeDataRetrieved = (
  data: DataType,
  homeId: string,
  logger: LoggerType,
  setCurrentName: Function,
  setParentId: Function,
  setParentName: Function): void => {
  logger.setContext(onInternalNodeDataRetrieved)
  let currentName
  let parentId = null
  let parentName = ''
  if (data.id === homeId) {
    currentName = 'Home'
  } else {
    const idComponents = data.id.split('/')
    const idLength = idComponents.length
    const pathComponents = data.path.split('/')
    const pathLength = pathComponents.length
    // If the path is longer than '/types'...
    if (pathLength >= 3) {
      currentName = pathComponents.slice(pathLength - 1)
      parentId = data.id
      parentName = pathComponents[pathLength - 2]
    } else if (pathLength === 3) {
      parentId = '/types'
      // TODO - Internationalize parent name.
      parentName = 'Types of things'
      currentName = pathComponents.slice(idLength - 1)
    } else {
      parentId = '/'
      // TODO - Internationalize name.
      parentName = 'Home'
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
 * @param path Path through a hierarchy of things.
 * @param configuration
 * @param currentLibraryName
 * @param fetcher
 * @param homeId
 * @param items
 * @param loadingOffsets
 * @param logger
 * @param setAnimationClassName
 * @param setCurrentName
 * @param setGoBackUrl
 * @param setIsBusy
 * @param setIsHome
 * @param setItems
 * @param setParentId
 * @param setParentName
 * @param setThing
 * @param showProperties
 */
const onNavigateTo = (context: NavigationContext): void => {
  const { path } = context
  logger.setContext(onNavigateTo).info(`Navigating to the thing at the path: "${path}"`)
  navigateTo(context)
}

/**
 * Called when the user selects a thing.
 * @param hash
 * @param logger
 * @param setSelectedItemId
 */
const onSelectedThingChanged = (hash: string, logger: LoggerType, setSelectedItemId: Function): void => {
  logger.setContext(onSelectedThingChanged).info(`Selecting the thing with the id "${hash}"`)
  setSelectedItemId(hash)
}

export default Navigation
