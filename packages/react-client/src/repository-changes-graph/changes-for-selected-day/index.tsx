import { AggregatedChange } from '@/utilities/change-aggregator.ts'
import { ChangesShape } from '@/utilities/types'
import { format } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import React, { JSX, ReactNode } from 'react'
import LoggerFactory from '@/logger'
import { SheetState } from '@/properties'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import ScrollableContent from '@/sheets/components/scrollable-content'

type Props = {
  changes: AggregatedChange[],
  selectedChangesByDay: ChangesShape[] | null,
  state: SheetState,
}

/**
 * Renders changes made to a repository of things during a selected day.
 * @param props
 * @constructor
 */
const ChangesForSelectedDay = (props: Props): JSX.Element => {
  const intl = useIntl()
  const { changes, selectedChangesByDay, state } = props
  const { animationState } = state
  const sumAuthors = (total: number, change: AggregatedChange) => total + (change.by ? change.by.length : 0)
  const sumChanges = (total: number, changes: ChangesShape) => total + changes.changesCount
  const authorCount = changes.reduce(sumAuthors, 0)
  const totalNumberOfChanges = (selectedChangesByDay === null) ? 0 : selectedChangesByDay.reduce(sumChanges, 0)
  const logger = loggerFactory.create(ChangesForSelectedDay)
  logger.info('Rendering changes for selected day')

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
 * Renders a title for a single change made to a repository of things.
 * @param intl Internationalization support.
 * @param totalNumberOfChanges Number of things within a repository of things that were changed.
 * @param date A day expressed as a string.
 * @param by The name of the contributor who made changes to a repository of things.
 */
const singleAuthorAndTime = (
  intl: IntlShape, totalNumberOfChanges: number, date: string, by: string[]
): ReactNode => {
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
 * Renders a title for multiple changes made to a repository of things.
 * @param intl Internationalization support.
 * @param totalNumberOfChanges Number of changes made to a repository of things.
 * @param date A day expressed as a string.
 * @param by The name of the contributor who made changes to a repository of things.
 */
const singleAuthorMultipleTimes = (
  intl: IntlShape, totalNumberOfChanges: number, date: string, by: string[]
): ReactNode => {
  return (
    intl.formatMessage({ id: 'homeSheet.changesDetailsTitleSingleAuthorMultipleTimes' }, {
      changeCount: totalNumberOfChanges,
      date: format(new Date(date), 'MMMM do'),
      who: by
    })
  )
}

const loggerFactory = LoggerFactory(ChangesForSelectedDay)

export default ChangesForSelectedDay
