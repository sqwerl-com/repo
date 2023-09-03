import ArchivedField from '../components/fields/archived-field'
import CompletedField from 'sheets/components/fields/completed-field'
import HistoryField from 'sheets/components/fields/history-field'
import Logger, { LoggerType } from 'logger'
import NotesForField from 'sheets/components/fields/notes-for-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TitleBar from 'sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only field that displays information about text notes about a thing.
 * @param props
 * @constructor
 */
const NotesSheet = (props: Props): React.JSX.Element => {
  logger = Logger(NotesSheet, NotesSheet)
  const connectionProperties = ['addedBy', 'archived', 'notesFor']
  logger.info('Rendering Notes property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const { addedBy, addedOn, archived, done, name, notesFor } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='notesSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {notesFor && <NotesForField notesFor={notesFor} state={state} />}
        {done && <CompletedField done={done} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default NotesSheet
