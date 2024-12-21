import ApplicationContext from '@/context/application'
import ChangesByDaySheet from '@/sheets/changes-by-day-sheet'
import { ConfigurationType } from '@/configuration'
import type { FetcherType } from '@/fetcher'
import HorizontalDivider from '@/horizontal-divider'
import { IsBusyContext } from '@/context/is-busy'
import Logger, { LoggerType } from '@/logger'
import Navigation from '@/navigation'
import Properties, { SheetState } from '@/properties'
import React, { useContext, useState } from 'react'
import { State as ApplicationState } from '@/application'
import { Thing } from '@/utils/types'
import { useNavigate } from 'react-router-dom'

let logger: LoggerType

interface Props {
  /** Application configuration information. */
  configuration: ConfigurationType

  /** The time and date when an application's contributor last signed in to an application server. */
  contributorLastSignedInDateTime: string

  /** The name of the user running the application this component is part of. */
  contributorName: string

  /** Name of the repository of things this application is currently showing. */
  currentRepositoryName: string

  /**
   * Location of the divider between this content area's two parts expressed as a percentage of this
   * component's width.
   */
  dividerPercentage: number

  /** Width (in pixels) of the divider between this content area's two parts. */
  dividerWidthInPixels: number

  /** Fetches information from a remote server. */
  fetcher: FetcherType

  /** Do we have the timestamp when an application's contributor last signed in to an application server? */
  hasLastSignedInDateTime: boolean

  /** Has the application's contributor's identity been verified? */
  isContributorSignedIn: boolean

  /** Is this application showing the Home (default, root) view of things? */
  isHome: boolean

  /** Call to navigate back to a previously visited thing. */
  popPath: (state: ApplicationState) => void

  /** Call set the current path to a thing whose properties are being displayed within an application. */
  setPath: (path: [{ id: string, name: string }]) => void

  /** Call to fetch and show a thing's properties. */
  showProperties: (path: string) => void
}

/**
 * Sqwerl client application's content area. A content area contains two types of components.
 * The first type allows contributors to navigate within a graph of related things. The second type allows contributors
 * to view and change things' properties.
 * @param props
 */
const ApplicationContentArea = (props: Props): React.JSX.Element => {
  logger = Logger(ApplicationContentArea, ApplicationContentArea)
  const navigate = useNavigate()
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
    currentRepositoryName,
    dividerPercentage,
    dividerWidthInPixels,
    fetcher,
    hasLastSignedInDateTime,
    isContributorSignedIn,
    isHome,
    popPath,
    setPath,
    showProperties,
    contributorLastSignedInDateTime,
    contributorName
  } = props
  const sheetState: SheetState = {
    animationState,
    configuration,
    context,
    contributorLastSignedInDateTime,
    contributorName,
    currentRepositoryName,
    fetcher,
    hasLastSignedInDateTime,
    isBusy,
    isHome,
    isShowingProperty,
    isContributorSignedIn,
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

  return (
    <section className='sqwerl-application-content-area'>
      <HorizontalDivider percentage={dividerPercentage} width={dividerWidthInPixels}>
        <Navigation
          configuration={configuration}
          currentRepositoryName={currentRepositoryName}
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
          currentRepositoryName={currentRepositoryName}
          fetcher={fetcher}
          hasLastSignedInDateTime={hasLastSignedInDateTime}
          isContributorSignedIn={isContributorSignedIn}
          isHome={isHome}
          navigate={navigate}
          setThing={setThing}
          showProperties={showProperties}
          thing={thing}
          contributorLastSignedInDateTime={contributorLastSignedInDateTime}
          contributorName={contributorName}
        />
        <ChangesByDaySheet state={sheetState} />
      </HorizontalDivider>
    </section>
  )
}

export default ApplicationContentArea
