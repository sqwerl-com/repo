import { AggregatedRepositoryChange } from '@/utils/repository-change-aggregator'
import ChangesThumbnailGraph from '@/repository-changes-graph/changes-thumbnail-graph'
import { ChevronRight } from 'react-feather'
import { evenOrOddClassName } from '@/utils/css/even-or-odd-class-name'
import { format } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { SheetState } from '@/properties'
import * as React from 'react'
import { ApplicationContextType } from '@/context/application'

interface Props {
  authorCount: number
  change: AggregatedRepositoryChange
  index: number
  repositoryName: string
  state: SheetState
  timestamp: Date
}

/**
 * Summarizes and links to all the changes made to a repository of things on a single day.
 * @param props
 */
const ChangesByDay = (props: Props): React.JSX.Element => {
  const { authorCount, change, repositoryName, index, state, timestamp } = props
  const { configuration, context, thing } = state
  const intl = useIntl()
  console.log(`ChangesByDay: index=${index}`)
  return (
    <Link
      className={`sqwerl-repository-changes ${evenOrOddClassName(index)}`}
      key={`change-${timestamp}-${index}`}
      onClick={() => slideLeft(state)}
      to={`#/${configuration.applicationName}/${repositoryName}/types/changes?ids=${change.idsAsList}&index=0&limit=10`}
    >
      {(authorCount === 1) && renderChangeTitleWithSingleAuthor(intl, context, change, timestamp, index)}
      {(authorCount > 1) && renderChangeTitleWithMultipleAuthors(intl, context, change, timestamp, index)}
      <svg className='sqwerl-repository-changes-thumbnail' height='30px' key={`svg-${index}`} width='64px'>
        {(thing != null) &&
          <ChangesThumbnailGraph
            change={thing}
            index={index}
            key={`thumbnail-${index}-${thing.id}`}
            timestamp={timestamp.toISOString()}
            width='60px'
          />
        }
      </svg>
      <span className='sqwerl-repository-changes-title-details-icon'>
        <ChevronRight className='sqwerl-back-or-forward-icon' />
      </span>
    </Link>
  )
}

/**
 * Renders text for a link that points to changes made to a repository of things by more than one person.
 * @param intl Internationalization support.
 * @param context
 * @param change Changes made to a repository of things.
 * @param date The day when a repository of things was changed.
 * @param index The index of the change within a list of changes.
 */
const renderChangeTitleWithMultipleAuthors = (
  intl: IntlShape, context: ApplicationContextType, change: AggregatedRepositoryChange, date: Date, index: number) => {
  const thingTextId = change.changesCount === 1 ? 'thingSingular' : 'thingPlural'
  return (
    <span
      className='sqwerl-repository-changes-title'
      dangerouslySetInnerHTML={{
        __html: intl.formatMessage({
          id: 'repositorySheet.repositoryChangesMultipleAuthorsTitle' +
            `${context.shouldShowRelativeTime(date) ? 'RelativeTime' : ''}`
        },
        {
          authorsCount: change.by.length,
          count: change.changesCount,
          countEndTag: '</span>',
          countStartTag: '<span class="sqwerl-repository-changes-count">',
          index: index + 1,
          on: format(date, 'MMM do'),
          things: intl.formatMessage({ id: thingTextId }),
          when: context.distanceInTimeText(date)
        })
      }}
    />
  )
}

/**
 * Renders text for a link to changes made to a repository of things by a single person.
 * @param intl  Internationalization support.
 * @param context
 * @param change Changes made to a repository of things.
 * @param date The day when changes were made to a repository.
 * @param index The index of the change within a list of changes.
 */
const renderChangeTitleWithSingleAuthor = (
  intl: IntlShape, context: ApplicationContextType, change: AggregatedRepositoryChange, date: Date, index: number) => {
  const thingTextId = change.changesCount === 1 ? 'thingSingular' : 'thingPlural'
  return (
    <span
      className='sqwerl-repository-changes-title'
      dangerouslySetInnerHTML={{
        __html: intl.formatMessage({
          id: `repositorySheet.repositoryChangesSingleAuthorTitle${context.shouldShowRelativeTime(date) ? 'RelativeTime' : ''}`
        },
        {
          at: format(date, 'h:mma'),
          count: change.changesCount,
          countEndTag: "'</span>'",
          countStartTag: "'<span class=\"sqwerl-repository-changes-count\">'",
          index: index + 1,
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
