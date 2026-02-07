import ArchivedField from '@/sheets/components/fields/archived-field'
import CapabilitiesField from '@/sheets/components/fields/capabilities-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LoggerFactory from '@/logger'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TeamsField from '@/sheets/components/fields/teams-field'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a security role that users can perform.
 * @param props
 */
const RolesSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['addedBy', 'archived', 'capabilities', 'teams']
  const logger = loggerFactory.create(RolesSheet)

  logger.info('Render Roles property sheet')

  const { state } = props
  const { configuration, thing } = state

  if (thing == null) {
    return (<></>)
  }

  const { addedBy, addedOn, archived, capabilities, description, name, teams } = thing

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='rolesSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {teams && <TeamsField state={state} teams={teams} />}
        {capabilities && <CapabilitiesField capabilities={capabilities} state={state} />}
        {addedOn &&
          <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(RolesSheet)

export default RolesSheet
