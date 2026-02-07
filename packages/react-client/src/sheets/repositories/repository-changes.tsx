import { AggregatedChange, aggregateToChangesByDay } from '@/utilities/change-aggregator'
import ChangesByDay from '@/sheets/repositories/changes-by-day'
import ChangesForSelectedDay from '@/repository-changes-graph/changes-for-selected-day'
import ChangesGraphContainer from '@/repository-changes-graph/changes-graph-container'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import LoggerFactory from '@/logger'
import { parseISO } from 'date-fns'
import React, { useState } from 'react'
import type { SheetState } from '@/properties'
import { Thing } from '@/utilities/types'

export interface Props {
  repository: Thing
  state: SheetState
}

/**
 * Renders a read-only form that summarizes the changes made to a repository of things.
 * @param props
 */
const RepositoryChanges = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const logger = loggerFactory.create(RepositoryChanges)
  const { repository, state } = props
  const [selectedChangesByDay] = useState(null)

  logger.info('Render Repository properties')

  if (selectedChangesByDay) {
    return (
      <ChangesForSelectedDay
        changes={aggregateToChangesByDay(repository.recentChanges)}
        selectedChangesByDay={selectedChangesByDay}
        state={state}
      />
    )
  } else {
    return (
      <>
        {repository
          ? <ChangesGraphContainer
              changes={aggregateToChangesByDay(repository.recentChanges)}
              repository={repository}
              state={state}
            />
          : renderBusy()
        }
      </>
    )
  }
}

/**
 * Renders this sheet's contents when this application is waiting to receive the data to display within
 * this sheet.
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
  changes: AggregatedChange[]) => {
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
        className='sqwerl-repository-changes-details-title'
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
              defaultMessage: '',
                id: 'repositorySheet.repositoryChangesListSubtitle'
            }, {
                count: changesByDays.length,
                repositoryName: repository.name
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
 * Renders a contributor's home page once this client application has received data to display within the page.
 * @param intl Internationalization support.
 * @param props
 * @param state
 * @param changes Changes made to a repository of things.
 */
const renderWithData = (
  intl: IntlShape,
  props: Props,
  state: SheetState,
  changes: AggregatedChange[]) => {

  return (
    <>
      <ChangesGraphContainer
        changes={changes}
        repository={props.repository}
        state={state}
      />
      {renderChanges(intl, props, state, changes)}
    </>
  )
}

const loggerFactory = LoggerFactory(RepositoryChanges)

export default RepositoryChanges
