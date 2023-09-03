import aggregateToChangesByDay, { AggregatedLibraryChange } from 'utils/library-change-aggregator'
import { ChevronLeft } from 'react-feather'
import { format } from 'date-fns'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { Thing } from 'utils/types'
import LibraryChanges from 'sheets/libraries/library-changes'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from 'logger'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetProps, SheetState } from 'properties'
import { useState } from 'react'
import * as React from 'react'

let logger: LoggerType

/**
 * Renders a read-only form that displays information about a library of things.
 * @param props
 * @constructor
 */
const LibrariesSheet = (props: SheetProps): React.JSX.Element => {
  logger = Logger(LibrariesSheet, LibrariesSheet)
  const { state } = props
  const { selection, thing } = state
  const intl = useIntl()
  logger.info('Render Libraries property sheet')
  const [changesByDay] = useState((thing != null) ? aggregateToChangesByDay(thing.recentChanges) : [])
  if (thing == null) {
    return (<></>)
  }
  if (selection && (selection.length > 0)) {
    return renderSelectedDaysChanges(intl, changesByDay, props, state)
  } else {
    return renderGraphAndChangesByDayLinks(intl, changesByDay, props, state)
  }
}

const goBack = (props: SheetProps, state: SheetState) => {
  const { setAnimationState } = state
  setAnimationState('slide-right')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

/**
 * Renders this library sheet's contents when this application is waiting to receive the data to display within
 * this sheet.
 */
const renderBusy = () => {
  /* TODO - Change to show busy animation. */
  return (
    <div className='sqwerl-home-sheet'>
      <FormattedMessage
        defaultMessage='Loading. Please wait...'
        id='homeSheet.busyMessage'
      />
    </div>
  )
}

/**
 * Renders the changes users have made to a library of things on a single day.
 * @param intl Internationalization support.
 * @param changes
 * @param props
 * @param state
 */
const renderSelectedDaysChanges = (
  intl: IntlShape, changes: AggregatedLibraryChange[], props: SheetProps, state: SheetState) => {
  const { animationState, selection } = state
  const sumAuthors = (total: number, change: AggregatedLibraryChange) => total + (change.by ? change.by.length : 0)
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
    <div className={`sqwerl-library-changes-for-day ${animationState}`}>
      <div className='sqwerl-properties-title-bar'>
        <Link
          className='sqwerl-property-sheet-title-bar-back-button'
          onClick={() => goBack(props, state)}
          to='/'
        >
          <span className='sqwerl-home-details-title-bar-back-icon'>
            <ChevronLeft />
          </span>
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
        </Link>
      </div>
      <ScrollableContent>
        {/* TODO
        <ChangesByDayDetails changes={changes} state={state} />
        */}
      </ScrollableContent>
    </div>
  )
}

/**
 * Renders a graph that depicts the changes people have made to a library of things over time and a list of links
 * that refer to details about those changes.
 * @param intl Internationalization support.
 * @param changes
 * @param props
 * @param state
 */
const renderGraphAndChangesByDayLinks = (
  intl: IntlShape, changes: AggregatedLibraryChange[], props: SheetProps, state: SheetState) => {
  const { thing } = state
  return (<>{(thing != null) ? renderWithData(intl, changes, props, state) : renderBusy()}</>)
}

/**
 * Renders a user's home page once this client application has received data to display within the page.
 * @param intl Internationalization support.
 * @param changes Changes users have made to a library of things.
 * @param props
 * @param state
 */
const renderWithData = (
  intl: IntlShape, changes: AggregatedLibraryChange[], props: SheetProps, state: SheetState) => {
  const { thing } = state
  const isLoading = (thing != null) ? '' : 'loading'
  return (
    <>
      {/* selection && renderSelectedChange(props) */}
      <header className={`sqwerl-properties-title-bar ${isLoading}`}>
        <div className={`sqwerl-properties-title-bar-title ${isLoading}`}>
          {!isLoading &&
            <div
              className='sqwerl-properties-title-text'
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({
                  id: 'homeSheet.title'
                }, {
                  count: (thing != null) ? thing.thingCount : 0,
                  name: (thing != null) ? thing.description : ''
                })
              }}
            />}
        </div>
      </header>
      <ScrollableContent>
        <div className='sqwerl-home-sheet'>
          {/* TODO - Show if library has been archived. */}
          {(thing != null) && <LibraryChanges library={thing} state={state} />}
        </div>
      </ScrollableContent>
    </>
  )
}

export default LibrariesSheet
