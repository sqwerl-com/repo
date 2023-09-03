import { ChevronRight } from 'react-feather'
import { format, parseISO } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import { LibraryChangeType } from 'utils/types'
import Logger, { LoggerType } from 'logger'
import { renderTitleWithMultipleAuthors, renderTitleWithSingleAuthor } from 'sheets/components/changes-by-day-title'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetProps } from 'properties'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom'
import * as React from 'react'

let logger: LoggerType

/**
 * Renders a read-only form that displays summarized information that describes changes made to a library of things at
 * multiple times on the same day. Renders a read-only property sheet with links to multiple commits made to a library
 * of things.
 * @param props
 * @constructor
 */
const ChangesByDaySummarySheet: React.FC<SheetProps> = (props: SheetProps): React.JSX.Element => {
  logger = Logger(ChangesByDaySummarySheet, ChangesByDaySummarySheet)
  const intl = useIntl()
  logger.info('Render Changes by Day Summary properties sheet')
  const { state } = props
  const { context, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const { changes } = thing
  const changedBy = new Set()
  let changeCount = 0
  if (thing && changes && (changes.length > 0)) {
    changes.forEach((change: LibraryChangeType) => {
      changedBy.add(change.by)
      changeCount += change.totalCount
    })
  }
  const authorCount = changedBy.size
  const date = new Date(changes[0].date)
  const shouldShowRelativeTime = context.shouldShowRelativeTime(date)
  const distanceInTimeText = shouldShowRelativeTime ? context.distanceInTimeText(date) : ''
  return (
    <>
      <header className='sqwerl-properties-title-bar'>
        <div className='sqwerl-properties-title-bar-title'>
          {/*
          <button
            className='sqwerl-property-sheet-title-bar-back-button'
            onClick={() => goBack(navigate, props)}
          >
            <ChevronLeft className='sqwerl-back-or-forward-icon' />
          </button>
          */}
          {(authorCount === 1) &&
            renderTitleWithSingleAuthor(
              changedBy.keys().next().value || '',
              changeCount,
              date,
              shouldShowRelativeTime,
              distanceInTimeText,
              intl)}
          {(authorCount > 1) &&
            renderTitleWithMultipleAuthors(
              changedBy.size,
              changeCount,
              date,
              shouldShowRelativeTime,
              distanceInTimeText,
              intl)}
        </div>
      </header>
      <ScrollableContent>
        {renderChanges(intl, authorCount, changes, props)}
      </ScrollableContent>
    </>
  )
}

const goBack = (navigate: NavigateFunction, props: SheetProps) => {
  const { setAnimationState, setThing } = props.state
  navigate(-1)
  setThing(null)
  setAnimationState('slide-right')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

/**
 * Renders a hyperlink to a list of things that were changed at a specific date and time.
 * @param intl Internationalization support.
 * @param count Number of things changed at a specific date and time.
 * @param timeOfDay Time of day when things were changed.
 */
const linkToChanges = (intl: IntlShape, count: number, timeOfDay: string): string => {
  return intl.formatMessage({ id: 'library.summarized.changes.title' }, { count, timeOfDay })
}

/**
 * Renders a hyperlink to a list of things that a specific user changed at a specific date and time.
 * @param intl Internationalization support.
 * @param by Name of the user who changed things.
 * @param count Number of things changed at a specific date and time.
 * @param timeOfDay Time of day when things were changed.
 */
const linkToChangesWithMultipleAuthors = (
  intl: IntlShape, by: string, count: number, timeOfDay: string): string => {
  return intl.formatMessage({ id: 'library.summarized.changes.title.with.author' }, { by, count, timeOfDay })
}

/**
 * Renders a list of links to changes made at different times on the same day.
 * @param intl Internationalization support.
 * @param authorCount The number of users who changed things at a given date.
 * @param changes Information about the changes made to things.
 * @param props
 */
const renderChanges = (
  intl: IntlShape, authorCount: number, changes: LibraryChangeType[], props: SheetProps): React.ReactNode => {
  const changesByDays: React.ReactNode[] = []
  const { configuration, currentLibraryName } = props.state
  if (changes) {
    changes.forEach((recentChange: LibraryChangeType, index) => {
      const { by, id, totalCount } = recentChange
      const timestamp = parseISO(recentChange.date)
      const timeOfDay = format(timestamp, 'h:mm aaa')
      const url = `#/${configuration.applicationName}/${currentLibraryName}/types/changes?ids=${id}`
      changesByDays.push(
        <div className='sqwerl-library-changes-on-day-item'>
          <Link
            className='sqwerl-library-changes-on-day-link'
            key={index}
            to={url}
          >
            <span className='sqwerl-library-view-changes-title-text'>
              {(authorCount > 1) &&
                <span dangerouslySetInnerHTML={{
                  __html: linkToChangesWithMultipleAuthors(intl, by, totalCount, timeOfDay)
                }}
                />}
              {(authorCount === 1) &&
                <span dangerouslySetInnerHTML={{
                  __html: linkToChanges(intl, totalCount, timeOfDay)
                }}
                />}
            </span>
            <span className='sqwerl-library-view-changes-title-details-icon'>
              <ChevronRight className='sqwerl-back-or-forward-icon' />
            </span>
          </Link>
        </div>
      )
    })
  }
  return (
    <div className='library-changes-on-day-summary'>
      {changesByDays}
    </div>
  )
}

export default ChangesByDaySummarySheet
