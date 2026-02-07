import aggregateToChangesByDay, { AggregatedChange } from '@/utilities/change-aggregator'
import ArchivedField from '@/sheets/components/fields/archived-field'
import ChangesForSelectedDay from '@/repository-changes-graph/changes-for-selected-day'
import ChangesGraphContainer from '@/repository-changes-graph/changes-graph-container'
import { ChevronLeft } from 'react-feather'
import ContentsField from '@/sheets/components/fields/contents-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import { format } from 'date-fns/format'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import HistoryField from '@/sheets/components/fields/history-field'
import LoggerFactory from '@/logger'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import RepositoryChanges from '@/sheets/repositories/repository-changes'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetProps, SheetState } from '@/properties'
import { Thing } from '@/utilities/types'
import TitleBar from '@/sheets/components/title-bar'
import { useState } from 'react'
import * as React from 'react'

/**
 * Renders a read-only form that displays information about a repository of things.
 * @param props
 * @constructor
 */
const RepositoriesSheet = (props: SheetProps): React.JSX.Element => {
  const intl = useIntl()
  const logger = loggerFactory.create(RepositoriesSheet)
  const { state } = props
  const { configuration, selection, thing } = state
  const [changesByDay] = useState(aggregateToChangesByDay(thing ? thing.recentChanges : []))

  if (!thing) {
    return (<></>)
  }

  const { archived, description, name, shortDescription } = thing

  logger.info('Render Repository property sheet')
  const thingCount = thing.hasOwnProperty('thingCount') ? thing.thingCount : 0

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={[]}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='repositorySheet.title'
        titleTextValues={{ name, thingCount }}
     />
     <ScrollableContent>
       {archived && <ArchivedField archived={archived} />}

       {(shortDescription.length > 0) &&
         <div className='sqwerl-properties-read-only-field'>
           <ReadOnlyFieldLabel
             description={intl.formatMessage({ id: 'collections.shortDescriptionField.description' })}
             labelText={intl.formatMessage({ id: 'shortDescription.field.label' } )} />
           <div className='sqwerl-properties-read-only-field-value'>{shortDescription}</div>
         </div>
       }

       {(description != undefined) && <DescriptionField description={description} state={state} />}

       {selection && (selection.length > 0) &&
         <ChangesForSelectedDay
           changes={changesByDay}
           selectedChangesByDay={selection}
           state={state}
         />
       }
       <ContentsField changes={changesByDay} repository={thing} state={state} />
       <HistoryField addedBy={thing.addedBy} addedOn={thing.addedOn} state={state} />
     </ScrollableContent>
    </>
  )
}

const goBack = (_props: SheetProps, state: SheetState) => {
  const { setAnimationState } = state
  setAnimationState('slide-right')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

/**
 * Renders this repository sheet's contents when this application is waiting to receive the data to display within
 * this sheet.
 */
const renderBusy = () => {
  /* TODO - Change to show busy animation. */
  return (
    <div className='sqwerl-repository-sheet'>
      <FormattedMessage
        defaultMessage='Loading. Please wait...'
        id='homeSheet.busyMessage'
      />
    </div>
  )
}

/**
 * Renders the changes users have made to a repository of things on a single day.
 * @param intl Internationalization support.
 * @param changes
 * @param props
 * @param state
 */
const renderSelectedDaysChanges = (
  intl: IntlShape, changes: AggregatedChange[], props: SheetProps, state: SheetState) => {
  const { animationState, selection } = state
  const sumAuthors = (total: number, change: AggregatedChange) => total + (change.by ? change.by.length : 0)
  const sumChanges = (total: number, changes: Thing) => total + changes.changesCount
  const authorCount = changes.reduce(sumAuthors, 0)
  const totalNumberOfChanges = selection.reduce(sumChanges, 0)
  const singleAuthorTitleBarTitleText = intl.formatMessage({
    id: 'homeSheet.changesDetailsTitleSingleAuthorMultipleTimes'
  }, {
    changeCount: totalNumberOfChanges,
    date: format(new Date(selection[0].date), 'MMMM do'),
    who: changes[0].by
  })
  const multipleAuthorTitleBarText = intl.formatMessage({
    id: 'homeSheet.changesDetailsTitleSingleAuthorMultipleTimes'
  }, {
    changeCount: totalNumberOfChanges,
    date: format(new Date(selection[0].date), 'MMMM do'),
    who: changes[0].by
  })
  return (
    <div className={`sqwerl-repository-changes-for-day ${animationState}`}>
      <header className='sqwerl-properties-title-bar'>
        <div className='sqwerl-properties-title-bar-title'>
          <button
            className='sqwerl-property-sheet-title-bar-back-button'
            onClick={() => goBack(props, state)}
          >
            <ChevronLeft />
          </button>
          <svg className='sqwerl-home-view-changes-thumbnail' height='30px' width='60px'>
            {/* TODO - Fix this
            <ThumbnailChangesGraph change={selection} data={thing} width='60px' />
            */}
          </svg>
          {(authorCount === 1) && (selection.length < 2) &&
            <span
              className='sqwerl-home-details-title-bar-title'
              dangerouslySetInnerHTML={{ __html: `${singleAuthorTitleBarTitleText}` }}
            />}
          {(authorCount === 1) && (selection.length > 1) &&
            <span
              className='sqwerl-home-details-title-bar-title'
              dangerouslySetInnerHTML={{ __html: `${multipleAuthorTitleBarText}` }}
            />}
        </div>
      </header>
      <ScrollableContent>
        {/* TODO
        <ChangesByDayDetails changes={changes} state={state} />
        */}
      </ScrollableContent>
    </div>
  )
}

/**
 * Renders a graph that depicts the changes people have made to a repository of things over time and a list of links
 * that refer to details about those changes.
 * @param intl Internationalization support.
 * @param props
 * @param state
 */
const renderGraphAndChangesByDayLinks = (intl: IntlShape, props: SheetProps, state: SheetState) => {
  const { thing } = state
  return (<>{(thing != null) ? renderWithData(intl, props, state) : renderBusy()}</>)
}

/**
 * Renders a user's home page once this client application has received data to display within the page.
 * @param intl Internationalization support.
 * @param props
 * @param state
 */
const renderWithData = (intl: IntlShape, props: SheetProps, state: SheetState) => {
  const { thing } = state
  const isLoading = (thing != null) ? '' : 'loading'

  return (
    <>
      <header className={`sqwerl-properties-title-bar ${isLoading}`}>
        <div className={`sqwerl-properties-title-bar-title ${isLoading}`}>
          {!isLoading &&
            <>
              <button
                className="sqwerl-property-sheet-title-bar-back-button"
                onClick={() => goBack(props, state)}
              >
                <ChevronLeft className="sqwerl-back-or-forward-icon"/>
              </button>
              <div
                className="sqwerl-properties-title-text"
                dangerouslySetInnerHTML={{
                  __html: intl.formatMessage({
                    id: 'homeSheet.title'
                  }, {
                    count: (thing != null) ? thing.thingCount : 0,
                    name: (thing != null) ? thing.name : ''
                  })
                }}
              />
            </>
          }
        </div>
      </header>

      <div className="sqwerl-repository-sheet">
        {/* TODO - Show if repository has been archived. */}
        {(thing != null) && <RepositoryChanges repository={thing} state={state}/>}
      </div>
    </>
  )
}

const loggerFactory = LoggerFactory(RepositoriesSheet)

export default RepositoriesSheet
