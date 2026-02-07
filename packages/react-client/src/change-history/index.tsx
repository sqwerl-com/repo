import { AggregatedChange } from '@/utilities/change-aggregator.ts'
import LoggerFactory from '@/logger'
import React from 'react'
import { Thing } from '@/utilities/types'
import { useIntl } from 'react-intl'

type Props = {
  changes: AggregatedChange[],
  thing: Thing
}

/**
 * User interface component that shows changes that have been made to a thing.
 * @param props
 * @constructor
 */
const ChangeHistory = (props: Props) => {
  const changesByDays: React.ReactNode[] = []
  const intl = useIntl()
  const logger = loggerFactory.create(ChangeHistory)

  logger.info('Rendering change history')


}

const loggerFactory = LoggerFactory(ChangeHistory)

export default ChangeHistory
