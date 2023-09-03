import { AggregatedLibraryChange } from 'utils/library-change-aggregator'
import ChangesThumbnailGraph from 'library-changes-graph/changes-thumbnail-graph'
import { ChevronRight } from 'react-feather'
import { format, parseISO } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { SheetState } from 'properties'
import * as React from 'react'
import { ApplicationContextType } from '../../context/application'

interface Props {
  authorCount: number
  change: AggregatedLibraryChange
  index: number
  libraryName: string
  state: SheetState
  timestamp: Date
}

/**
 * Summarizes and links to all the changes made to a library of things on a single day.
 * @param props
 */
const ChangesByDay = (props: Props): React.JSX.Element => {
  const { authorCount, change, libraryName, index, state, timestamp } = props
  const { configuration, context, thing } = state
  const intl = useIntl()
  return (
    <Link
      className='sqwerl-library-changes'
      key={index}
      onClick={() => slideLeft(state)}
      to={`#/${configuration.applicationName}/${libraryName}/types/changes?ids=${change.idsAsList}&index=0&limit=10`}
    >
      <svg className='sqwerl-library-changes-thumbnail' height='30px' width='60px'>
        {(thing != null) && <ChangesThumbnailGraph change={thing} index={index} width='60px' />}
      </svg>
      {(authorCount === 1) && renderChangeTitleWithSingleAuthor(intl, context, change, timestamp)}
      {(authorCount > 1) && renderChangeTitleWithMultipleAuthors(intl, context, change, timestamp)}
      <span className='sqwerl-library-changes-title-details-icon'>
        <ChevronRight className='sqwerl-back-or-forward-icon' />
      </span>
    </Link>
  )
}

/**
 * Renders text for a link that points to changes made to a library of things by more than one person.
 * @param intl Internationalization support.
 * @param context
 * @param change Changes made to a library of things.
 * @param date The day when a library of things was changed.
 */
const renderChangeTitleWithMultipleAuthors = (
  intl: IntlShape, context: ApplicationContextType, change: AggregatedLibraryChange, date: Date) => {
  const thingTextId = change.changesCount === 1 ? 'thingSingular' : 'thingPlural'
  return (
    <span
      className='sqwerl-library-changes-title'
      dangerouslySetInnerHTML={{
        __html: intl.formatMessage({
          id: 'librarySheet.libraryChangesMultipleAuthorsTitle' +
            `${context.shouldShowRelativeTime(date) ? 'RelativeTime' : ''}`
        },
        {
          authorsCount: change.by.length,
          count: change.changesCount,
          countEndTag: '</span>',
          countStartTag: '<span class="sqwerl-library-changes-count">',
          on: format(date, 'MMM do'),
          things: intl.formatMessage({ id: thingTextId }),
          when: context.distanceInTimeText(date)
        })
      }}
    />
  )
}

/**
 * Renders text for a link to changes made to a library of things by a single person.
 * @param intl  Internationalization support.
 * @param context
 * @param change Changes made to a library of things.
 * @param date The day when changes were made to a library.
 */
const renderChangeTitleWithSingleAuthor = (
  intl: IntlShape, context: ApplicationContextType, change: AggregatedLibraryChange, date: Date) => {
  const thingTextId = change.changesCount === 1 ? 'thingSingular' : 'thingPlural'
  return (
    <span
      className='sqwerl-library-changes-title'
      dangerouslySetInnerHTML={{
        __html: intl.formatMessage({
          id: `librarySheet.libraryChangesSingleAuthorTitle${context.shouldShowRelativeTime(date) ? 'RelativeTime' : ''}`
        },
        {
          at: format(date, 'h:mma'),
          count: change.changesCount,
          countEndTag: "'</span>'",
          countStartTag: "'<span class=\"sqwerl-library-changes-count\">'",
          on: format(date, 'MMM do'),
          things: intl.formatMessage({ id: thingTextId }),
          when: context.distanceInTimeText(date),
          who: change.by[0]
        })
      }}
    />
  )
}

/**
 * Animates this property sheet so that it appears to slide to the left.
 * @param state
 */
const slideLeft = (state: SheetState) => {
  const { setAnimationState } = state
  setAnimationState('slide-left')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

export default ChangesByDay
