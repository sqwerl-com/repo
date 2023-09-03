import ArchivedField from '../components/fields/archived-field'
import DescriptionField from 'sheets/components/fields/description-field'
import HistoryField from 'sheets/components/fields/history-field'
import Logger, { LoggerType } from 'logger'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TaggedField from 'sheets/components/fields/tagged-field'
import TitleBar from 'sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 *
 * @param props
 * @constructor
 */
const TagsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(TagsSheet, TagsSheet)
  const connectionProperties = ['addedBy', 'archived', 'collections', 'notes', 'tagged']
  logger.info('Render Tags property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const { addedBy, addedOn, archived, description, name, tagged } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='tagsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {tagged && <TaggedField tagged={tagged} state={state} />}
        {addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default TagsSheet
