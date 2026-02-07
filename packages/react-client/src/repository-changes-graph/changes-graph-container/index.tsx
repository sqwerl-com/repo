import { AggregatedChange } from '@/utilities/change-aggregator.ts'
import ChangesByDay from '@/sheets/repositories/changes-by-day.tsx'
import { IntlShape, useIntl } from 'react-intl'
import LoggerFactory from '@/logger'
import lowerCaseFirstLetter from '@/utilities/formatters/lower-case-first-letter.ts'
import { parseISO } from 'date-fns'
import RepositoryChangesGraph from '@/repository-changes-graph'
import React, { Ref, useRef } from 'react'
import { SheetState } from '@/properties'
import { Thing } from '@/utilities/types'

type Props = {
  changes: AggregatedChange[],
  repository: Thing,
  state: SheetState
}

/**
 * Renders a graph that shows the number of changes people have made to a repository of things over time.
 * @params props
 * @constructor
 */
const ChangesGraphContainer = (props: Props) => {
  const { changes, repository, state } = props
  const changesByDays: React.ReactNode[] = []
  const containerRef: Ref<HTMLDivElement | null> = useRef(null)
  const intl = useIntl()
  const logger = loggerFactory.create(ChangesGraphContainer)
  const { name } = repository

  logger.info('Rendering changes graph container')

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
      {/*
      <div
        className="sqwerl-property-sheet-text"
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
            id: 'changesByDaySummarySheet.changesGraphIntroduction'
          }, {
            repositoryName: name || lowerCaseFirstLetter(description)
          })
        }}
      />
      */}
      <div
        className='sqwerl-repository-changes-details-title'
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
              defaultMessage: '',
              id: 'repositorySheet.repositoryChangesListSubtitle'
            }, {
              count: changesByDays.length,
              repositoryName: name
            })
        }}
      />
      <div
        className="sqwerl-repository-changes-graph-container"
        ref={containerRef}
      >
        {/*
        <div className="sqwerl-repository-changes-graph-y-axis-title-container">
          <div className="sqwerl-repository-changes-graph-y-title">
            {intl.formatMessage({
              defaultMessage: 'Number of Changes per Day',
              id: 'changes-per-day-graph-axis-label-text'
            })}
          </div>
        </div>
        */}
        <RepositoryChangesGraph
          data={changes}
          height={230}
          margins={{ bottom: 50, left: 0, right: 30, top: 10 }}
          width={containerRef.current ? containerRef.current.clientWidth : 0}
        />
        {renderChanges(intl, props, state, changes )}
        {/*
        <RepositoryChanges
          repository={repository}
          state={state}
        />
        */}
      </div>
    </>
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
      <div className='sqwerl-repository-changes-details-container'>
        {changesByDays}
      </div>
    </>
  )
}

const loggerFactory = LoggerFactory(ChangesGraphContainer)

export default ChangesGraphContainer
