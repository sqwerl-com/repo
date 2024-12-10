import { AggregatedRepositoryChange, aggregateToChangesByDay } from '@/utils/repository-change-aggregator'
import ChangesByDay from '@/sheets/repositories/changes-by-day'
import { ChevronLeft } from 'react-feather'
import { format, parseISO } from 'date-fns'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from '@/logger'
import lowerCaseFirstLetter from '@/utils/formatters/lower-case-first-letter'
import React, { ReactNode, useState } from 'react'
import RepositoryChangesGraph from '@/repository-changes-graph'
import { RepositoryChangesShape, Thing } from '@/utils/types'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'

let logger: LoggerType

interface Props {
  repository: Thing
  state: SheetState
}

/**
 * Renders a read-only form that summarizes the changes made to a repository of things.
 * @param props
 * @constructor
 */
const RepositoryChanges = (props: Props): React.JSX.Element => {
  logger = Logger(RepositoryChanges, RepositoryChanges)
  const intl = useIntl()
  const { repository, state } = props
  logger.setContext(RepositoryChanges.name)
  logger.info('Render Repository properties')
  const [selectedChangesByDay] = useState(null)
  if (selectedChangesByDay) {
    return renderChangesForSelectedDay(
      intl, state, aggregateToChangesByDay(repository.recentChanges), selectedChangesByDay)
  } else {
    return renderGraphAndChangesByDayLinks(intl, props, state, aggregateToChangesByDay(repository.recentChanges))
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
    <div className='sqwerl-repository-changes-sheet'>
      <div className='sqwerl-property-sheet-text'>
        <FormattedMessage id='homeSheet.busyMessage' />
      </div>
      <div className='sqwerl-repository-changes-graph-container'>
        <div className='sqwerl-repository-changes-graph-y-axis-title-container'>
          <div className='sqwerl-repository-changes-graph-y-title loading'>
            <FormattedMessage id='repository.changes.y-axis.title' />
          </div>
        </div>
        <div className='sqwerl-repository-changes-graph-loading' style={{ width: '100%', height: '13rem' }} />
      </div>
      {changes}
    </div>
  )
}

/**
 * Renders a list of changes people have recently made to a repository of things.
 * @param intl
 * @param props
 * @param state
 * @param changes
 */
const renderChanges = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedRepositoryChange[]) => {
  const { repository } = props
  const changesByDays: React.ReactNode[] = []
  if (changes) {
    changes.forEach((recentChange, index) => {
      const authorCount = recentChange.by ? recentChange.by.length : 0
      const key = `change-${index}-${recentChange.id}`
      const timestamp = parseISO(recentChange.date)
      changesByDays.push(
        <ChangesByDay
          authorCount={authorCount}
          change={recentChange}
          index={index}
          key={key}
          repositoryName={repository.name}
          state={state}
          timestamp={timestamp}
        />
      )
    })
  }
  return (
    <>
      <div
        className='sqwerl-property-sheet-text sqwerl-repository-changes-details-title'
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
                defaultMessage: 'Details',
                id: 'repositorySheet.repositoryChangesListTitle'
              }) +
                intl.formatMessage({
                  defaultMessage: '',
                  id: 'repositorySheet.repositoryChangesListSubtitle'
                }, {
                  count: changesByDays.length
                })
        }}
      />
      <div className='sqwerl-repository-changes-details-container'>
        {changesByDays}
      </div>
    </>
  )
}

/**
 *
 * @param intl
 * @param state
 * @param changes
 * @param selectedChangesByDay
 */
const renderChangesForSelectedDay = (
  intl: IntlShape,
  state: SheetState,
  changes: AggregatedRepositoryChange[],
  selectedChangesByDay: RepositoryChangesShape[] | null): React.JSX.Element => {
  const { animationState } = state
  const sumAuthors = (total: number, change: AggregatedRepositoryChange) => total + (change.by ? change.by.length : 0)
  const sumChanges = (total: number, changes: RepositoryChangesShape) => total + changes.changesCount
  const authorCount = changes.reduce(sumAuthors, 0)
  const totalNumberOfChanges = (selectedChangesByDay === null) ? 0 : selectedChangesByDay.reduce(sumChanges, 0)
  return (
    <div className={`sqwerl-repository-changes-for-day ${animationState}`}>
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
 * Renders a graph that shows the amount of changes people have made to a repository of things over time.
 * @param intl
 * @param props
 * @param changes
 */
const renderChangesGraph = (intl: IntlShape, props: Props, changes: AggregatedRepositoryChange[]) => {
  const { repository } = props
  const { description, name } = repository
  return (
    <>
      <div
        className='sqwerl-property-sheet-text'
        dangerouslySetInnerHTML={{
            __html: intl.formatMessage({
              id: 'changesByDaySummarySheet.changesGraphIntroduction'
            }, {
              repositoryName: name || lowerCaseFirstLetter(description)
            })
          }
        }
      />
      <div className='sqwerl-repository-changes-graph-container'>
      <div className='sqwerl-repository-changes-graph-y-axis-title-container'>
      <div className='sqwerl-repository-changes-graph-y-title'>
      {intl.formatMessage({
          defaultMessage: 'Number of Changes per Day',
          id: 'changes-per-day-graph-axis-label-text'
        })}
    </div>
  </div>
        <RepositoryChangesGraph
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
 * Renders a list of links to changes made to a repository. Each link refers to changes made on the same day.
 * @param intl
 * @param props
 * @param state
 * @param changes
 */
const renderGraphAndChangesByDayLinks = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedRepositoryChange[]): React.JSX.Element => {
  const { repository } = props
  return (<>{repository ? renderWithData(intl, props, state, changes) : renderBusy()}</>)
}

/**
 * Renders a contributor's home page once this client application has received data to display within the page.
 * @param intl
 * @param props
 * @param state
 * @param changes
 */
const renderWithData = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedRepositoryChange[]) => {
  return (
    <>
      {renderChangesGraph(intl, props, changes)}
      {renderChanges(intl, props, state, changes)}
    </>
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

export default RepositoryChanges
