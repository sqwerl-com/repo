import ArchivedField from '@/sheets/components/fields/archived-field'
import Logger, { LoggerType } from '@/logger'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a security capability granted to individual contributors
 * or teams of contributors.
 * @param props
 * @constructor
 */
const CapabilitiesSheet = (props: Props): React.JSX.Element => {
  logger = Logger(CapabilitiesSheet, CapabilitiesSheet)
  logger.info('Rendering Capabilities property sheet')

  const connectionProperties = ['addedBy', 'archived', 'roles']
  const { state } = props
  const { configuration, thing } = state

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
        titleTextId='capabilitiesSheet.title'
        titleTextValues={{ name }}
      />
      {/* TODO - Implement capability property sheet. */}
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        <div>Capability property sheet</div>
      </ScrollableContent>
    </>
  )
}

export default CapabilitiesSheet
