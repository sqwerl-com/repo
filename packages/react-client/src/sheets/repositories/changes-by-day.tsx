import { AggregatedChange } from '@/utilities/change-aggregator'
import ApplicationContext, { ApplicationContextType } from '@/context/application'
import ChangesThumbnailGraph from '@/repository-changes-graph/changes-thumbnail-graph'
import { ChevronRight } from 'react-feather'
import { evenOrOddClassName } from '@/utilities/css/even-or-odd-class-name'
import { format } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { SheetState } from '@/properties'
import { Thing } from '@/utilities/types'
import { useContext } from 'react'

export interface Props {
  authorCount: number
  change: AggregatedChange
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
  const { configuration, thing } = state
  const context = useContext(ApplicationContext)
  const intl = useIntl()

  return (
    <div className='sqwerl-navigation-item'>
      <Link
        className='sqwerl-navigation-parent-item double-height'
        key={`change-${timestamp}-${index}`}
        onClick={() => slideLeft(state)}
        to={`#/${configuration.applicationName}/${repositoryName}/types/changes?ids=${change.idsAsList}&index=0&limit=10`}
      >
        {/* TODO - render the ordinal number, then the thumbnail graph, then the title text */}
        {(authorCount === 1) && renderChangeTitleWithSingleAuthor(thing, intl, context, change, timestamp, index)}
        {(authorCount > 1) && renderChangeTitleWithMultipleAuthors(intl, context, change, timestamp, index)}
        <span className='sqwerl-repository-changes-title-details-icon'>
          <ChevronRight className='sqwerl-back-or-forward-icon' />
        </span>
      </Link>
    </div>
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
  intl: IntlShape, context: ApplicationContextType, change: AggregatedChange, date: Date, index: number) => {
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
  thing: Thing | null,
  intl: IntlShape,
  context: ApplicationContextType,
  change: AggregatedChange,
  date: Date,
  index: number
) => {
  const thingTextId = change.changesCount === 1 ? 'thingSingular' : 'thingPlural'

  return (
    <>
      <span className='sqwerl-navigation-item-ordinal'>{index + 1}</span>
      <div className='sqwerl-repository-changes-description'>
        <svg className='sqwerl-repository-changes-thumbnail' height='30px' key={`svg-${index}`} width='64px'>
          {(thing != null) &&
            <ChangesThumbnailGraph
              change={thing}
              index={index}
              key={`thumbnail-${index}-${thing.id}`}
              timestamp={date.toISOString()}
              width='60px'
            />
          }
        </svg>
        <div className='sqwerl-parent-item-heading'>
          <label className='sqwerl-navigation-item-title' data-key={index}>
            <div
              className='sqwerl-navigation-item-title-text sqwerl-hyperlink-underline-on-hover'
              data-key={index}
            >
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
            </div>
          </label>
        </div>
      </div>
    </>
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
