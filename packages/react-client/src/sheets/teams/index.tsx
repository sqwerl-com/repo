import ArchivedField from '@/sheets/components/fields/archived-field'
import ContributorsField from '@/sheets/components/fields/contributors-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LoggerFactory from '@/logger'
import ParentTeamField from '@/sheets/components/fields/parent-team-field'
import RolesField from '@/sheets/components/fields/roles-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import SubteamsField from '@/sheets/components/fields/subteams-field'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only field that displays information about a team of contributors.
 * @param props
 */
const TeamsSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['addedBy', 'archived', 'contributors', 'roles', 'subteams']
  const logger = loggerFactory.create(TeamsSheet)
  const { state } = props
  const { configuration, thing } = state

  logger.info('Render Teams property sheet')

  if (thing == null) {
    return (<></>)
  }

  const { addedBy, addedOn, archived, contributors, description, name, parent, roles, subteams } = thing

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='teamsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {parent && <ParentTeamField parent={parent} state={state} />}
        {subteams && <SubteamsField subteams={subteams} state={state} />}
        {roles && <RolesField roles={roles} state={state} />}
        {contributors && <ContributorsField contributors={contributors} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(TeamsSheet)

export default TeamsSheet
