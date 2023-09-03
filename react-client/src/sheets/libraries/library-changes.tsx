import { AggregatedLibraryChange, aggregateToChangesByDay } from 'utils/library-change-aggregator'
import ChangesByDay from 'sheets/libraries/changes-by-day'
import { ChevronLeft } from 'react-feather'
import { CollectionType, Thing } from 'utils/types'
import { format, parseISO } from 'date-fns'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import LibraryChangesGraph from 'library-changes-graph'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from 'logger'
import lowerCaseFirstLetter from '../../utils/formatters/lower-case-first-letter'
import React, { ReactNode, useState } from 'react'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'

let logger: LoggerType

interface Props {
  library: Thing
  state: SheetState
}

/**
 * Renders a read-only form that summarizes the changes made to a library of things.
 * @param props
 * @constructor
 */
const LibraryChanges = (props: Props): React.JSX.Element => {
  logger = Logger(LibraryChanges, LibraryChanges)
  const intl = useIntl()
  const { library, state } = props
  logger.setContext(LibraryChanges.name)
  logger.info('Render Library properties')
  const [selectedChangesByDay, setSelectedChangesByDay] = useState(null)
  if (selectedChangesByDay) {
    return renderChangesForSelectedDay(
      intl, props, state, aggregateToChangesByDay(library.recentChanges), selectedChangesByDay)
  } else {
    return renderGraphAndChangesByDayLinks(
      intl, props, state, aggregateToChangesByDay(library.recentChanges), selectedChangesByDay)
  }
}

/**
 * Renders this home sheet's contents when this application is waiting to receive the data to display within
 * this home sheet.
 */
const renderBusy = () => {
  const changes = []
  for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
    changes.push(
      <a className='sqwerl-home-view-changes loading'>
        <svg className='sqwerl-home-view-changes-thumbnail loading' height='30px' width='60px' />
        <span className='sqwerl-home-view-changes-title loading' />
      </a>
    )
  }
  return (
    <div className='sqwerl-home-sheet'>
      <div className='sqwerl-property-sheet-text'>
        <FormattedMessage id='homeSheet.busyMessage' />
      </div>
      <div className='sqwerl-library-changes-graph-container'>
        <div className='sqwerl-library-changes-graph-y-axis-title-container'>
          <div className='sqwerl-library-changes-graph-y-title loading'>
            <FormattedMessage id='library.changes.y-axis.title' />
          </div>
        </div>
        <div className='sqwerl-library-changes-graph-loading' style={{ width: '100%', height: '13rem' }} />
      </div>
      {changes}
    </div>
  )
}

/**
 * Renders a list of changes people have recently made to a library of things.
 * @param intl
 * @param props
 * @param state
 * @param changes
 * @param selectedChangesByDay
 */
const renderChanges = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedLibraryChange[],
  selectedChangesByDay: any[] | null) => {
  const { library } = props
  const changesByDays: React.ReactNode[] = []
  if (changes) {
    changes.forEach((recentChange, index) => {
      const timestamp = parseISO(recentChange.date)
      const authorCount = recentChange.by ? recentChange.by.length : 0
      changesByDays.push(
        <ChangesByDay
          authorCount={authorCount}
          change={recentChange}
          index={index}
          key={`library-change-${index}`}
          libraryName={library.name}
          state={state}
          timestamp={timestamp}
        />
      )
    })
  }
  return (
    <>
      <div className='sqwerl-property-sheet-text'>Details</div>
      {changesByDays}
    </>
  )
}

/**
 *
 * @param intl
 * @param props
 * @param state
 * @param changes
 * @param selectedChangesByDay
 */
const renderChangesForSelectedDay = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedLibraryChange[],
  selectedChangesByDay: any[] | null): JSX.Element => {
  const { animationState, selection, showProperties } = state
  const sumAuthors = (total: number, change: AggregatedLibraryChange) => total + (change.by ? change.by.length : 0)
  const sumChanges = (total: number, changes: CollectionType<Thing>) => total + changes.totalCount
  const authorCount = changes.reduce(sumAuthors, 0)
  const totalNumberOfChanges = (selectedChangesByDay != null) ? selectedChangesByDay.reduce(sumChanges, 0) : 0
  return (
    <div className={`sqwerl-library-changes-for-day ${animationState}`}>
      <div className='sqwerl-properties-title-bar'>
        <Link
          className='sqwerl-property-sheet-title-bar-back-button'
          to='/'
        >
          <span className='sqwerl-home-details-title-bar-back-icon'>
            <ChevronLeft />
          </span>
          <svg className='sqwerl-home-view-changes-thumbnail' height='30px' width='60px'>
            {/* <ChangesThumbnailGraph change={selection[0]} width='60px' /> */}
          </svg>
          {(authorCount === 1) && (selectedChangesByDay != null) && (selectedChangesByDay.length < 2) &&
            <span className='sqwerl-home-details-title-bar-title'>
              {singleAuthorAndTime(intl, totalNumberOfChanges, selectedChangesByDay[0].date, changes[0].by)}
            </span>}
          {(authorCount === 1) && (selectedChangesByDay != null) && (selectedChangesByDay.length > 1) &&
            <span className='sqwerl-home-details-title-bar-title'>
              {singleAuthorMultipleTimes(intl, totalNumberOfChanges, selectedChangesByDay[0].date, changes[0].by)}
            </span>}
        </Link>
      </div>
      <ScrollableContent>
        {/* <ChangesByDayDetails changes={changes} state={state} /> */}
      </ScrollableContent>
    </div>
  )
}

/**
 * Renders a graph that shows the amount of changes people have made to a library of things over time.
 * @param intl
 * @param props
 * @param state
 * @param changes
 * @param selectedChangesByDay
 */
const renderChangesGraph = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedLibraryChange[],
  selectedChangesByDay: any[] | null) => {
  const { library } = props
  const { description, name, recentChanges } = library
  const defaultLibraryName = description || name
  return (
    <>
      <div className='sqwerl-property-sheet-text'>
        <FormattedMessage
          defaultMessage='Changes made to {libraryName} in the past 30 days:'
          id='homeSheet.changesGraphIntroduction'
          values={{ libraryName: lowerCaseFirstLetter(defaultLibraryName) }}
        />
      </div>
      <div className='sqwerl-library-changes-graph-container'>
        <div className='sqwerl-library-changes-graph-y-axis-title-container'>
          <div className='sqwerl-library-changes-graph-y-title'>
            {intl.formatMessage({
              defaultMessage: 'Number of Changes per Day',
              id: 'changes-per-day-graph-axis-label-text'
            })}
          </div>
        </div>
        <LibraryChangesGraph
          data={changes}
          height={230}
          margins={{ bottom: 50, left: 50, right: 30, top: 10 }}
          width={600}
        />
      </div>
    </>
  )
}

/**
 * Renders a list of links to changes made to a library. Each link refers to changes made on the same day.
 * @param intl
 * @param props
 * @param state
 * @param changes
 * @param selectedChangesByDay
 */
const renderGraphAndChangesByDayLinks = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedLibraryChange[],
  selectedChangesByDay: any[] | null): JSX.Element => {
  const { library } = props
  return (<>{library ? renderWithData(intl, props, state, changes, selectedChangesByDay) : renderBusy()}</>)
}

/**
 * Renders a user's home page once this client application has received data to display within the page.
 * @param intl
 * @param props
 * @param state
 * @param changes
 * @param selectedChangesByDay
 */
const renderWithData = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedLibraryChange[],
  selectedChangesByDay: any[] | null) => {
  return (
    <div className='sqwerl-home-sheet'>
      {renderChangesGraph(intl, props, state, changes, selectedChangesByDay)}
      {renderChanges(intl, props, state, changes, selectedChangesByDay)}
    </div>
  )
}

/**
 * @param intl
 * @param totalNumberOfChanges
 * @param date
 * @param by
 */
const singleAuthorAndTime = (intl: IntlShape, totalNumberOfChanges: number, date: string, by: string[]): ReactNode => {
  return (
    intl.formatMessage({
      id: 'homeSheet.changesDetailsTitleSingleAuthorAndTime'
    }, {
      changeCount: totalNumberOfChanges,
      date: format(new Date(date), 'MMMM do'),
      time: format(new Date(date), 'h:mm aa'),
      who: by
    })
  )
}

/**
 *
 * @param intl
 * @param totalNumberOfChanges
 * @param date
 * @param by
 */
const singleAuthorMultipleTimes = (intl: IntlShape, totalNumberOfChanges: number, date: string, by: string[]): ReactNode => {
  return (
    intl.formatMessage({ id: 'homeSheet.changesDetailsTitleSingleAuthorMultipleTimes' }, {
      changeCount: totalNumberOfChanges,
      date: format(new Date(date), 'MMMM do'),
      who: by
    })
  )
}

export default LibraryChanges
