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
 * Renders a read-only form that displays information about a security capability granted to individual contributors
 * or teams of contributors.
 * @param props
 */
const CapabilitiesSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['addedBy', 'archived', 'roles']
  const logger = loggerFactory.create(CapabilitiesSheet)
  const { state } = props
  const { configuration, thing } = state

  logger.info('Rendering Capabilities property sheet')

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

const loggerFactory = LoggerFactory(CapabilitiesSheet)

export default CapabilitiesSheet
