import ArchivedField from '@/sheets/components/fields/archived-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LoggerFactory from '@/logger'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TaggedField from '@/sheets/components/fields/tagged-field'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about text tags linked to things.
 * @param props
 */
const TagsSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['addedBy', 'archived', 'collections', 'notes', 'tagged']
  const logger = loggerFactory.create(TagsSheet)

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
        state={state}
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

const loggerFactory = LoggerFactory(TagsSheet)

export default TagsSheet
