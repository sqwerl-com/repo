import ArchivedField from '../components/fields/archived-field'
import Logger, { LoggerType } from 'logger'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TitleBar from 'sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information that describes how things are presented visually.
 * @param props
 * @constructor
 */
const ViewsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(ViewsSheet, ViewsSheet)
  const connectionProperties: string[] = ['archived']
  logger.info('Render Views property sheet')
  const { configuration, thing } = props.state
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

export default ViewsSheet
