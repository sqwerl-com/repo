import AccountsSheet from '@/sheets/accounts'
import ApplicationContext, { ApplicationContextType } from '@/context/application'
import ArticlesSheet from '@/sheets/articles'
import AuthorsSheet from '@/sheets/authors'
import BooksSheet from '@/sheets/books'
import CapabilitiesSheet from '@/sheets/capabilities'
import ChangesByDaySheet from '@/sheets/changes-by-day-sheet'
import ChangesByDaySummarySheet from '@/sheets/changes-by-day-summary-sheet'
import CollectionsSheet from '@/sheets/collections'
import { ConfigurationType } from '@/configuration'
import ContentSheet from '@/sheets/content'
import ContributorsSheet from '@/sheets/contributors'
import CoursesSheet from '@/sheets/courses'
import DocumentsSheet from '@/sheets/documents'
import FacetsSheet from '@/sheets/facets'
import FeedsSheet from '@/sheets/feeds'
import type { FetcherType } from '@/fetcher'
import HomeSheet from '@/sheets/home-sheet'
import { IsBusyContext } from '@/context/is-busy'
import Logger, { LoggerType } from '@/logger'
import { NavigateFunction } from 'react-router-dom'
import NotesSheet from '@/sheets/notes'
import PapersSheet from '@/sheets/papers'
import PicturesSheet from '@/sheets/pictures'
import PodcastsSheet from '@/sheets/podcasts'
import ProjectsSheet from '@/sheets/collections/projects'
import PropertySheet from '@/sheets/property'
import RepositoriesSheet from '@/sheets/repositories'
import RolesSheet from '@/sheets/roles'
import { SetThingType } from '@/context/application/properties-retrieved-events'
import TagsSheet from '@/sheets/tags'
import TalksSheet from '@/sheets/talks'
import TeamsSheet from '@/sheets/teams'
import { Thing } from '@/utils/types'
import TypesSheet from '@/sheets/types'
import { useCallback, useContext, useEffect, useState } from 'react'
import VideosSheet from '@/sheets/videos'
import ViewsSheet from '@/sheets/views'
import WebPagesSheet from '@/sheets/web-pages'
import * as React from 'react'
import '@/properties/properties.css'

let logger: LoggerType

export interface SheetState {
  animationState: string
  configuration: ConfigurationType
  context: ApplicationContextType
  contributorLastSignedInDateTime: string
  contributorName: string

  /** The repository of things the user is currently viewing. */
  currentRepositoryName: string

  fetcher: FetcherType
  hasLastSignedInDateTime: boolean
  isBusy: boolean
  isContributorSignedIn: boolean
  isHome: boolean
  isShowingProperty: boolean
  logger: LoggerType
  navigate: NavigateFunction

  /** The name of a thing's property whose values are being displayed to users. */
  property: string

  recentUrl: string

  /** A selected things within this sheet to display as a sub-sheet. */
  selection: Thing[]

  setAnimationState: (animationState: string) => void
  setIsShowingProperty: (isShowingProperty: boolean) => void
  setProperty: (propertyName: string) => void

  /** Sets this sheet's selection--an object to display properties for. */
  setSelection: (selectedThings: Thing[]) => void

  setThing: SetThingType
  showProperties: (path: string) => void
  thing: Thing | null
}

export interface SheetProps {
  state: SheetState
}

export interface Props {
  configuration: ConfigurationType
  contributorLastSignedInDateTime: string
  contributorName: string
  currentRepositoryName: string
  fetcher: FetcherType
  hasLastSignedInDateTime: boolean
  isContributorSignedIn: boolean
  isHome: boolean
  navigate: NavigateFunction
  setThing: SetThingType

  /** Call to fetch and show a thing's properties. */
  showProperties: (hash: string) => void

  thing: Thing | null
}

// Maps the unique ids of types of things to the property sheet user interfaces that display those properties.
const typesToPropertySheets: Map<string, (props: Props, state: SheetState) => React.JSX.Element> = new Map([
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
  ['/types/content', (props: Props, state: SheetState) => {
    return (<ContentSheet state={state} />)
  }],
  ['/types/contributors', (props: Props, state: SheetState) => {
    return (<ContributorsSheet state={state} />)
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
  ['/types/repositories', (props: Props, state: SheetState) => {
    return (<RepositoriesSheet state={state} />)
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
  ['/types/teams', (props: Props, state: SheetState) => {
    return (<TeamsSheet state={state} />)
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
  const [isShowingProperty, setIsShowingProperty] = useState(false)
  const [property, setProperty] = useState('')
  const [recentUrl, setRecentUrl] = useState('')
  const [selection, setSelection] = useState<Thing[]>([])
  const {
    configuration,
    contributorLastSignedInDateTime,
    contributorName,
    currentRepositoryName,
    fetcher,
    hasLastSignedInDateTime,
    isContributorSignedIn,
    isHome,
    navigate,
    setThing,
    showProperties,
    thing
  } = props
  const state: SheetState = {
    animationState,
    configuration,
    context,
    contributorLastSignedInDateTime,
    contributorName,
    currentRepositoryName,
    fetcher,
    hasLastSignedInDateTime,
    isBusy,
    isContributorSignedIn,
    isHome,
    isShowingProperty,
    logger,
    navigate,
    property,
    recentUrl,
    selection,
    setAnimationState,
    setIsShowingProperty,
    setProperty,
    setSelection,
    setThing,
    showProperties,
    thing
  }
  const propertiesRetrievedCallback = useCallback(
    (data: { id: string, properties: { type: string } }, setThing: SetThingType) =>
      onPropertiesRetrieved(data, setThing, setAnimationState),
    []
  )

  context.propertiesRetrievedEvents.register(propertiesRetrievedCallback, setThing)

  useEffect(() => {
    const navigateToProperty = (newPath: string, newHash?: string, newProperty?: string): void =>
      onNavigateToProperty(
        newPath,
        newHash ?? '',
        newProperty ?? '',
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
    const onUrlChanged = (newUrl: string, lastUrl?: string): void => {
      if (lastUrl !== undefined) {
        setRecentUrl(lastUrl)
      }
    }

    context.urlChangedEvents.register(onUrlChanged)

    return () => context.urlChangedEvents.unregister(onUrlChanged)
  }, [context.urlChangedEvents])

  useEffect(() => {
    const selectThingCallback = (path: string, hash?: string): void =>
      onSelectedThingChanged(hash ?? '', setAnimationState)
    context.selectThingEvents.register(selectThingCallback)
    return () => context.selectThingEvents.unregister(selectThingCallback)
  }, [context.selectThingEvents])

  let propertySheet: ((props: Props, state: SheetState) => React.JSX.Element) | undefined

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
      <>
        {renderBusyProperties()}
        <section className={`sqwerl-properties ${animationState}`}>
          <div className='sqwerl-properties-container'>{propertySheet(props, state)}</div>
        </section>
      </>
    )
  }

  return (
    <>
      {renderBusyProperties()}
      {isHome &&
        <section className='sqwerl-properties'>
          <div className='sqwerl-properties-container'><HomeSheet state={state} /></div>
        </section>}
    </>
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
  setAnimationState: (animationState: string) => void,
  setIsShowingProperty: (isShowingProperty: boolean) => void,
  setProperty: (propertyName: string) => void,
  setThing: SetThingType): void => {
  logger.setContext(onNavigateToProperty)
  setProperty(newProperty)
  fetcher.requestData({ url: `${newHash}/summary?properties=${newProperty}&offset=0` }
  ).then((response: Response) => {
    if (response.status === 200) {
      response.json().then((data: { id: string, path: string, type: string }) => {
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
              // @ts-expect-error data is allowed to have any type of property.
              ...data[newProperty]
            }
          },
          setThing,
          setAnimationState)
      }).catch((error: unknown) => {
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
  data: { id: string, properties: { type: string } },
  setThing: (thing: Thing | null) => void,
  setAnimationState: (animationState: string) => void): void => {
  setThing(data.properties as Thing)
  setAnimationState('')
}

const onSelectedThingChanged = (hash: string, setAnimationState: (animationState: string) => void): void => {
  setAnimationState('slide-right')
}

const renderBusyProperties = (): React.JSX.Element => {
  return (
    <div className='sqwerl-properties-busy-container'>
      <div className='sqwerl-properties-title-bar-busy'>
        <div className='sqwerl-properties-title-bar-content-busy' />
      </div>
      {/* TODO - Make this dynamic. Add a loop that creates items to fill the visible space */}
      <div className='sqwerl-properties-busy'>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item odd'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item odd'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item odd'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item odd'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item odd'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item odd'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item odd'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
        <div className='sqwerl-properties-busy-item even'>
          <div className='sqwerl-properties-busy-item-content' />
        </div>
      </div>
    </div>
  )
}

export default Properties
