import ArchivedField from '../components/fields/archived-field'
import DescriptionField from 'sheets/components/fields/description-field'
import HistoryField from 'sheets/components/fields/history-field'
import Logger, { LoggerType } from 'logger'
import ParentGroupField from 'sheets/components/fields/parent-group-field'
import RolesField from 'sheets/components/fields/roles-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import SubgroupsField from 'sheets/components/fields/subgroups-field'
import TitleBar from 'sheets/components/title-bar'
import UsersField from 'sheets/components/fields/users-field'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only field that displays information about a group of users.
 * @param {Props} props
 * @returns {JSX.Element}
 * @constructor
 */
const GroupsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(GroupsSheet, GroupsSheet)
  const connectionProperties = ['addedBy', 'archived', 'roles', 'subgroups', 'users']
  logger.setContext(GroupsSheet.name)
  logger.info('Render Groups property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const { addedBy, addedOn, archived, description, name, parent, roles, subgroups, users } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='groupsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {parent && <ParentGroupField parent={parent} state={state} />}
        {subgroups && <SubgroupsField subgroups={subgroups} state={state} />}
        {roles && <RolesField roles={roles} state={state} />}
        {users && <UsersField users={users} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default GroupsSheet
