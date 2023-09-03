import ArchivedField from '../components/fields/archived-field'
import CapabilitiesField from 'sheets/components/fields/capabilities-field'
import DescriptionField from 'sheets/components/fields/description-field'
import GroupsField from 'sheets/components/fields/groups-field'
import HistoryField from 'sheets/components/fields/history-field'
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
 * Renders a read-only form that displays information about a security role that users can perform.
 * @param {Props} props
 * @returns {JSX.Element}
 * @constructor
 */
const RolesSheet = (props: Props): React.JSX.Element => {
  logger = Logger(RolesSheet, RolesSheet)
  const connectionProperties = ['addedBy', 'archived', 'capabilities', 'groups']
  logger.info('Render Roles property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const { addedBy, addedOn, archived, capabilities, description, groups, name } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='rolesSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {groups && <GroupsField groups={groups} state={state} />}
        {capabilities && <CapabilitiesField capabilities={capabilities} state={state} />}
        {addedOn &&
          <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default RolesSheet
