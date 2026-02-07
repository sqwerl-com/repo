import ArchivedField from '@/sheets/components/fields/archived-field'
import LoggerFactory from '@/logger'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information that describes how things are presented visually.
 * @param props
 */
const ViewsSheet = (props: Props): React.JSX.Element => {
  const connectionProperties: string[] = ['archived']
  const logger = loggerFactory.create(ViewsSheet)
  const { state } = props
  const { configuration, thing } = state

  logger.info('Render Views property sheet')

  if (thing == null) {
    return (<></>)
  }

  const { archived, name } = thing

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='viewsSheet.title'
        titleTextValues={{ name }}
      />
      {/* TODO - Implement view properties sheet. */}
      <ScrollableContent>
        <div>View property sheet</div>
        {archived && <ArchivedField archived={archived} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(ViewsSheet)

export default ViewsSheet
