import ArchivedField from '@/sheets/components/fields/archived-field'
import CompletedField from '@/sheets/components/fields/completed-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LoggerFactory from '@/logger'
import NotesForField from '@/sheets/components/fields/notes-for-field'
import RepresentationsField from '@/sheets/components/fields/representations-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only field that displays information about text notes about a thing.
 * @param props
 */
const NotesSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['addedBy', 'archived', 'notesFor']
  const logger = loggerFactory.create(NotesSheet)
  const { state } = props
  const { configuration, thing } = state

  logger.info('Rendering Notes property sheet')

  if (thing == null) {
    return (<></>)
  }

  const { addedBy, addedOn, archived, done, name, notesFor, representations } = thing

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='notesSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {notesFor && <NotesForField notesFor={notesFor} state={state} />}
        {done && <CompletedField done={done} state={state} />}
        {representations &&
          <RepresentationsField
            fieldTitleId='representations.field.label'
            representations={representations}
            state={state}
          />
        }
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(NotesSheet)

export default NotesSheet
