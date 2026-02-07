import ApplicationContext from '@/context/application'
import { ChevronRight } from 'react-feather'
import { format, parseISO } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LoggerFactory from '@/logger'
import { renderTitleWithMultipleAuthors, renderTitleWithSingleAuthor } from '@/sheets/components/changes-by-day-title'
import { RepositoryChangeType } from '@/utilities/types'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetProps } from '@/properties'
import { useContext } from 'react'

/**
 * Renders a read-only form that displays summarized information that describes changes made to a repository of
 * things during multiple times on the same day. Renders a read-only property sheet with links to multiple commits
 * made to a repository of things.
 * @param props
 */
const ChangesByDaySummarySheet: React.FC<SheetProps> = (props: SheetProps): React.JSX.Element => {
  const context = useContext(ApplicationContext)
  const intl = useIntl()
  const logger = loggerFactory.create(ChangesByDaySummarySheet)
  const { state } = props
  const { thing } = state

  logger.info('Render Changes by Day Summary properties sheet')

  if (thing == null) {
    return (<></>)
  }

  const { changes } = thing
  const changedBy = new Set()
  let changeCount = 0

  if ((changes !== undefined) && (changes.length > 0)) {
    changes.forEach((change: RepositoryChangeType) => {
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
          {(authorCount === 1) &&
            renderTitleWithSingleAuthor(
              changedBy.keys().next().value as string,
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

/**
 * Renders a hyperlink to a list of things that were changed at a specific date and time.
 * @param intl Internationalization support.
 * @param count Number of things changed at a specific date and time.
 * @param timeOfDay Time of day when things were changed.
 */
const linkToChanges = (intl: IntlShape, count: number, timeOfDay: string): string => {
  return intl.formatMessage({ id: 'repository.summarized.changes.title' }, { count, timeOfDay })
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
  return intl.formatMessage({ id: 'repository.summarized.changes.title.with.author' }, { by, count, timeOfDay })
}

/**
 * Renders a list of links to changes made at different times on the same day.
 * @param intl Internationalization support.
 * @param authorCount The number of users who changed things at a given date.
 * @param changes Information about the changes made to things.
 * @param props
 */
const renderChanges = (
  intl: IntlShape, authorCount: number, changes: RepositoryChangeType[], props: SheetProps): React.ReactNode => {
  const changesByDays: React.ReactNode[] = []
  const { configuration, currentRepositoryName } = props.state

  if (changes !== undefined) {
    changes.forEach((recentChange: RepositoryChangeType, index) => {
      const { by, id, totalCount } = recentChange
      const timestamp = parseISO(recentChange.date)
      const timeOfDay = format(timestamp, 'h:mm aaa')
      const url = `#/${configuration.applicationName}/${currentRepositoryName}/types/changes?ids=${id}`
      changesByDays.push(
        <div
          className='sqwerl-repository-changes-on-day-item'
          key={`change-per-day-${timestamp}-${index}`}
        >
          <Link
            className='sqwerl-repository-changes-on-day-link'
            to={url}
          >
            <span className='sqwerl-repository-view-changes-title-text'>
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
            <span className='sqwerl-repository-view-changes-title-details-icon'>
              <ChevronRight className='sqwerl-back-or-forward-icon' />
            </span>
          </Link>
        </div>
      )
    })
  }
  return (
    <div className='repository-changes-on-day-summary'>
      {changesByDays}
    </div>
  )
}

const loggerFactory = LoggerFactory(ChangesByDaySummarySheet)

export default ChangesByDaySummarySheet
