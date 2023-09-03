import AccountsSheet from 'sheets/accounts'
import ApplicationContext, { ApplicationContextType } from 'context/application'
import ArticlesSheet from 'sheets/articles'
import AuthorsSheet from 'sheets/authors'
import BooksSheet from 'sheets/books'
import CapabilitiesSheet from 'sheets/capabilities'
import CollectionsSheet from 'sheets/collections'
import ChangesByDaySheet from 'sheets/changes-by-day-sheet'
import ChangesByDaySummarySheet from 'sheets/changes-by-day-summary-sheet'
import { ConfigurationType } from 'configuration'
import CoursesSheet from 'sheets/courses'
import DocumentsSheet from 'sheets/documents'
import FacetsSheet from 'sheets/facets'
import FeedsSheet from 'sheets/feeds'
import type { FetcherType } from 'fetcher'
import GroupsSheet from 'sheets/groups'
import HomeSheet from 'sheets/home-sheet'
import { IsBusyContext } from 'context/is-busy'
import LibrariesSheet from 'sheets/libraries'
import Logger, { LoggerType } from 'logger'
import NotesSheet from 'sheets/notes'
import PapersSheet from 'sheets/papers'
import PicturesSheet from 'sheets/pictures'
import PodcastsSheet from 'sheets/podcasts'
import ProjectsSheet from 'sheets/collections/projects'
import PropertySheet from 'sheets/property'
import RolesSheet from 'sheets/roles'
import TagsSheet from 'sheets/tags'
import TalksSheet from 'sheets/talks'
import { Thing } from 'utils/types'
import TypesSheet from 'sheets/types'
import { useContext, useEffect, useState } from 'react'
import UsersSheet from 'sheets/users'
import VideosSheet from 'sheets/videos'
import ViewsSheet from 'sheets/views'
import WebPagesSheet from 'sheets/web-pages'
import * as React from 'react'
import 'properties/properties.css'

let logger: LoggerType

export interface SheetState {
  animationState: string
  configuration: ConfigurationType
  context: ApplicationContextType

  /** The library of things the user is currently viewing. */
  currentLibraryName: string

  fetcher: FetcherType
  hasLastSignedInDateTime: boolean
  isBusy: boolean
  isShowingProperty: boolean
  isUserSignedIn: boolean
  logger: LoggerType

  /** The name of a thing's property whose values are being displayed to users. */
  property: string

  recentUrl: string

  /** A selected things within this sheet to display as a sub-sheet. */
  selection: Thing[]

  setAnimationState: Function

  setIsShowingProperty: Function

  setProperty: Function

  /** Sets this sheet's selection--an object to display properties for. */
  setSelection: Function

  setThing: Function

  showProperties: Function

  thing: Thing | null

  userLastSignedInDateTime: string

  userName: string
}

export interface SheetProps {
  state: SheetState
}

export interface Props {
  configuration: ConfigurationType
  currentLibraryName: string
  fetcher: FetcherType
  hasLastSignedInDateTime: boolean
  isUserSignedIn: boolean
  setThing: Function

  /** Call to fetch and show a thing's properties. */
  showProperties: Function

  thing: Thing | null
  userLastSignedInDateTime: string
  userName: string
}

// Maps the unique ids of types of things to the property sheet user interfaces that display those properties.
const typesToPropertySheets: Map<string, (props: Props, state: SheetState) => any> = new Map([
  ['/', (props: Props, state: SheetState) => {
    return (<HomeSheet state={state} />)
  }],
  ['/types', (props: Props, state: SheetState) => {
    return (<TypesSheet state={state} />)
  }],
  ['/types/accounts', (props: Props, state: SheetState) => {
    return (<AccountsSheet state={state} />)
  }],
  ['/types/articles', (props: Props, state: SheetState) => {
    return (<ArticlesSheet state={state} />)
  }],
  ['/types/authors', (props: Props, state: SheetState) => {
    return (<AuthorsSheet state={state} />)
  }],
  ['/types/books', (props: Props, state: SheetState) => {
    return (<BooksSheet state={state} />)
  }],
  ['/types/changes', (props: Props, state: SheetState) => {
    return (<ChangesByDaySheet state={state} />)
  }],
  ['/types/changes/summary', (props: Props, state: SheetState) => {
    return (<ChangesByDaySummarySheet state={state} />)
  }],
  ['/types/capabilities', (props: Props, state: SheetState) => {
    return (<CapabilitiesSheet state={state} />)
  }],
  ['/types/collections', (props: Props, state: SheetState) => {
    return (<CollectionsSheet state={state} />)
  }],
  ['/types/collections/Projects', (props: Props, state: SheetState) => {
    return (<ProjectsSheet state={state} />)
  }],
  ['/types/courses', (props: Props, state: SheetState) => {
    return (<CoursesSheet state={state} />)
  }],
  ['/types/documents', (props: Props, state: SheetState) => {
    return (<DocumentsSheet state={state} />)
  }],
  ['/types/facets', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/authored', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/collectable', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/depictable', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/linkable', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/notable', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/readable', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/recommendable', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/tagged', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/titled', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/facets/viewable', (props: Props, state: SheetState) => {
    return (<FacetsSheet state={state} />)
  }],
  ['/types/feeds', (props: Props, state: SheetState) => {
    return (<FeedsSheet state={state} />)
  }],
  ['/types/groups', (props: Props, state: SheetState) => {
    return (<GroupsSheet state={state} />)
  }],
  ['/types/libraries', (props: Props, state: SheetState) => {
    return (<LibrariesSheet state={state} />)
  }],
  ['/types/notes', (props: Props, state: SheetState) => {
    return (<NotesSheet state={state} />)
  }],
  ['/types/papers', (props: Props, state: SheetState) => {
    return (<PapersSheet state={state} />)
  }],
  ['/types/pictures', (props: Props, state: SheetState) => {
    return (<PicturesSheet state={state} />)
  }],
  ['/types/podcasts', (props: Props, state: SheetState) => {
    return (<PodcastsSheet state={state} />)
  }],
  ['/types/roles', (props: Props, state: SheetState) => {
    return (<RolesSheet state={state} />)
  }],
  ['/types/tags', (props: Props, state: SheetState) => {
    return (<TagsSheet state={state} />)
  }],
  ['/types/talks', (props: Props, state: SheetState) => {
    return (<TalksSheet state={state} />)
  }],
  ['/types/users', (props: Props, state: SheetState) => {
    return (<UsersSheet state={state} />)
  }],
  ['/types/videos', (props: Props, state: SheetState) => {
    return (<VideosSheet state={state} />)
  }],
  ['/types/views', (props: Props, state: SheetState) => {
    return (<ViewsSheet state={state} />)
  }],
  ['/types/webPages', (props: Props, state: SheetState) => {
    return (<WebPagesSheet state={state} />)
  }]
])

/**
 * Property editor user interface components. User interface components that display a thing's properties (attributes),
 * and possibly allow users to edit properties.
 * @param props
 */
const Properties = (props: Props): React.JSX.Element => {
  logger = Logger(Properties, Properties)
  const [animationState, setAnimationState] = useState('')
  const context = useContext(ApplicationContext)
  const isBusy = useContext(IsBusyContext)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isShowingProperty, setIsShowingProperty] = useState(false)
  const [property, setProperty] = useState('')
  const [recentUrl, setRecentUrl] = useState('')
  const [selection, setSelection] = useState<Thing[]>([])
  const {
    configuration,
    currentLibraryName,
    fetcher,
    hasLastSignedInDateTime,
    isUserSignedIn,
    setThing,
    showProperties,
    thing,
    userLastSignedInDateTime,
    userName
  } = props
  const state: SheetState = {
    animationState,
    configuration,
    context,
    currentLibraryName,
    fetcher,
    hasLastSignedInDateTime,
    isBusy,
    isShowingProperty,
    isUserSignedIn,
    logger,
    property,
    recentUrl,
    selection,
    setAnimationState,
    setIsShowingProperty,
    setProperty,
    setSelection,
    setThing,
    showProperties,
    thing,
    userLastSignedInDateTime,
    userName
  }
  if (!isRegistered) {
    context.propertiesRetrievedEvents.register(
      (data: { id: string, properties: { type: string } }, setThing: Function) =>
        onPropertiesRetrieved(data, setThing, setAnimationState), setThing)
    setIsRegistered(true)
  }
  useEffect(() => {
    const navigateToProperty = (newPath: string, newHash: string, newProperty: string): void =>
      onNavigateToProperty(
        newPath,
        newHash,
        newProperty,
        fetcher,
        logger,
        setAnimationState,
        setIsShowingProperty,
        setProperty,
        setThing
      )
    context.navigateToPropertyEvents.register(navigateToProperty)
    return () => context.navigateToPropertyEvents.unregister(navigateToProperty)
  }, [context.navigateToPropertyEvents, fetcher, setThing])
  useEffect(() => {
    const navigateToThingCallback = (): void => onNavigateToThing(state)
    context.navigateToThingEvents.register(navigateToThingCallback)
    return (): void => context.navigateToThingEvents.unregister(navigateToThingCallback)
  })
  useEffect(() => {
    const onUrlChanged = (newUrl: string, lastUrl: string): void => setRecentUrl(lastUrl)
    context.urlChangedEvents.register(onUrlChanged)
    return () => context.urlChangedEvents.unregister(onUrlChanged)
  }, [context.urlChangedEvents])
  useEffect(() => {
    context.selectThingEvents.register((path: string, hash: string) =>
      onSelectedThingChanged(hash, setAnimationState))
    return () => context.selectThingEvents.unregister()
  }, [context.selectThingEvents])
  let propertySheet: ((props: Props, state: SheetState) => any) | undefined
  if (thing != null) {
    const { type } = thing
    if (isShowingProperty) {
      propertySheet = (props: Props, state: SheetState) =>
        (<PropertySheet state={state} />)
    } else {
      propertySheet = typesToPropertySheets.get(thing.isType ? '/types' : type)
    }
  }
  if (propertySheet != null) {
    return (
      <section className={`sqwerl-properties ${animationState}`}>
        <div className='sqwerl-properties-container'>{propertySheet(props, state)}</div>
      </section>
    )
  }
  return (
    <section className='sqwerl-properties'>
      <div className='sqwerl-properties-container'><HomeSheet state={state} /></div>
    </section>
  )
}

const onNavigateToThing = (state: SheetState): void => {
  const { setIsShowingProperty } = state
  setIsShowingProperty(false)
}

const onNavigateToProperty = (
  newPath: string,
  newHash: string,
  newProperty: string,
  fetcher: FetcherType,
  logger: LoggerType,
  setAnimationState: Function,
  setIsShowingProperty: Function,
  setProperty: Function,
  setThing: Function): void => {
  logger.setContext(onNavigateToProperty)
  setProperty(newProperty)
  fetcher.requestData({ url: `${newHash}/summary?properties=${newProperty}&offset=0` }).then((response: any) => {
    if (response.status === 200) {
      response.json().then((data: any) => {
        const thingName = data.path.split('/').slice(-1)[0]
        setIsShowingProperty(true)
        onPropertiesRetrieved(
          {
            id: data.id,
            properties: {
              count: 0,
              id: data.id,
              name: thingName,
              property: newProperty,
              thingCount: 0,
              type: data.type,
              ...data[newProperty]
            }
          },
          setThing,
          setAnimationState)
      }).catch((error: any) => {
        logger.error(
          `Failed to parse information about the property named "${newProperty}"` +
            ` of the thing with the id "${newHash}"\n` +
            `Error: ${JSON.stringify(error)}`
        )
      })
    } else {
      logger.warn(`Failed to retrieve value of property named "${newProperty}" of thing at "${newPath}".`)
      // TODO - Notify the user that navigating to a thing's property failed.
    }
  }).catch((error) => {
    logger.error(
      `Failed to retrieve information about the property named "${newProperty}"` +
        ` of the object with the id: "${newProperty}"\n` +
        `Error: ${JSON.stringify(error)}`
    )
  })
}

/**
 * Called after a thing's properties have been retrieved so this component can then render those properties.
 * @param data A thing's properties.
 * @param setThing Function that sets the thing whose properties this component renders.
 * @param setAnimationState Function that sets the relevant CSS animation to perform.
 */
const onPropertiesRetrieved = (
  data: { id: string, properties: { type: string } }, setThing: Function, setAnimationState: Function): void => {
  setThing(data.properties)
  setAnimationState('')
}

const onSelectedThingChanged = (hash: string, setAnimationState: Function): void => {
  setAnimationState('slide-right')
}

export default Properties
