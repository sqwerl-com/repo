import { format } from 'date-fns'
import { IntlShape } from 'react-intl'
import * as React from 'react'

/**
 * Renders title text for changes made to a library of things by more than one person.
 * @param changedByCount
 * @param changesCount
 * @param date
 * @param shouldShowRelativeTime Display a textual description of the distance of the given date from now.
 * @param distanceInTimeText Text that describes how far back in time a change was made.
 * @param intl
 */
export const renderTitleWithMultipleAuthors = (
  changedByCount: number,
  changesCount: number,
  date: Date,
  shouldShowRelativeTime: boolean,
  distanceInTimeText: string,
  intl: IntlShape): React.ReactNode => {
  return (
    <div
      className='sqwerl-properties-title-text'
      dangerouslySetInnerHTML={{
        __html: intl.formatMessage(
          { id: `changesByDaySheet.multipleAuthorTitle${shouldShowRelativeTime ? 'RelativeTime' : ''}` }, {
            changedByCount,
            changesCount,
            date: format(date, 'MMM do'),
            when: distanceInTimeText
          })
      }}
    />
  )
}

/**
 * Renders title text for changes made to a library of things by a single individual.
 * @param changedBy
 * @param changesCount
 * @param date
 * @param shouldShowRelativeTime Display a textual description of the distance of the given date from now.
 * @param distanceInTimeText Text that describes how far back in time a change was made.
 * @param intl
 */
export const renderTitleWithSingleAuthor = (
  changedBy: string,
  changesCount: number,
  date: Date,
  shouldShowRelativeTime: boolean,
  distanceInTimeText: string,
  intl: IntlShape): React.ReactNode => {
  return (
    <div
      className='sqwerl-properties-title-text'
      dangerouslySetInnerHTML={{
        __html: intl.formatMessage({
          id: `changesByDaySheet.singleAuthorTitle${shouldShowRelativeTime ? 'RelativeTime' : ''}`
        }, {
          changedBy,
          changesCount,
          date: format(date, 'MMM do'),
          when: distanceInTimeText
        })
      }}
    />
  )
}
