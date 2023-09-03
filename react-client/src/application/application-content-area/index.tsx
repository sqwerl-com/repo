import ApplicationContext from 'context/application'
import ChangesByDaySheet from 'sheets/changes-by-day-sheet'
import { ConfigurationType } from 'configuration'
import type { FetcherType } from 'fetcher'
import HorizontalDivider from 'horizontal-divider'
import { IsBusyContext } from 'context/is-busy'
import Logger, { LoggerType } from 'logger'
import Navigation from 'navigation'
import Properties, { SheetState } from 'properties'
import { Thing } from 'utils/types'
import { useContext, useState } from 'react'

let logger: LoggerType

interface Props {
  /** Application configuration information. */
  configuration: ConfigurationType

  /** Name of the library of things this application is currently showing. */
  currentLibraryName: string

  /**
   * Location of the divider between this content area's two parts expressed as a percentage of this
   * component's width.
   */
  dividerPercentage: number

  /** Width (in pixels) of the divider between this content area's two parts. */
  dividerWidthInPixels: number

  /** Fetches information from a remote server. */
  fetcher: FetcherType

  /** Do we have the timestamp when an application's user last signed in to an application server? */
  hasLastSignedInDateTime: boolean

  /** Has the application's user's identify been verified? */
  isUserSignedIn: boolean

  /** Call to navigate back to a previously visited thing. */
  popPath: Function

  /** Call set the current path to a thing whose properties are being displayed within an application. */
  setPath: (path: any) => void,

  /** Call to fetch and show a thing's properties. */
  showProperties: (path: string) => void,

  /** The time and date when an application's user last signed in to an application server. */
  userLastSignedInDateTime: string

  /** The name of the user running the application this component is part of. */
  userName: string
}

/**
 * Sqwerl client application's content area. A content area contains two types of components.
 * The first type allows users to navigate within a graph of related things. The second type allows users
 * to view and change things' properties.
 * @param props
 */
const ApplicationContentArea = (props: Props) => {
  logger = Logger(ApplicationContentArea, ApplicationContentArea)
  const [thing, setThing] = useState<Thing | null>(null)
  logger.info('Rendering an application content area')
  const [animationState, setAnimationState] = useState('')
  const context = useContext(ApplicationContext)
  const isBusy = useContext(IsBusyContext)
  const [isShowingProperty, setIsShowingProperty] = useState(false)
  const [property, setProperty] = useState('')
  const [recentUrl] = useState('')
  const [selection, setSelection] = useState<Thing[]>([])
  const {
    configuration,
    currentLibraryName,
    dividerPercentage,
    dividerWidthInPixels,
    fetcher,
    hasLastSignedInDateTime,
    isUserSignedIn,
    popPath,
    setPath,
    showProperties,
    userLastSignedInDateTime,
    userName
  } = props
  const sheetState: SheetState = {
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
  return (
    <section className='sqwerl-application-content-area'>
      <HorizontalDivider percentage={dividerPercentage} width={dividerWidthInPixels}>
        <Navigation
          configuration={configuration}
          currentLibraryName={currentLibraryName}
          homeId={configuration.homeId || '/types/views/initial'}
          fetcher={fetcher}
          popPath={popPath}
          setPath={setPath}
          setThing={setThing}
          showProperties={showProperties}
          thing={thing}
        />
        <Properties
          configuration={configuration}
          currentLibraryName={currentLibraryName}
          fetcher={fetcher}
          hasLastSignedInDateTime={hasLastSignedInDateTime}
          isUserSignedIn={isUserSignedIn}
          setThing={setThing}
          showProperties={showProperties}
          thing={thing}
          userLastSignedInDateTime={userLastSignedInDateTime}
          userName={userName}
        />
        <ChangesByDaySheet state={sheetState} />
      </HorizontalDivider>
    </section>
  )
}

export default ApplicationContentArea
