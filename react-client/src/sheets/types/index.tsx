import ArchivedField from '../components/fields/archived-field'
import DescriptionField from 'sheets/components/fields/description-field'
import HistoryField from 'sheets/components/fields/history-field'
import Logger, { LoggerType } from 'logger'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetProps, SheetState } from 'properties'
import ShortDescriptionField from 'sheets/components/fields/short-description-field'
import TypeTitleBar from 'sheets/components/type-title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information describing a type of thing.
 * @param props
 * @constructor
 */
const TypesSheet: React.FC<SheetProps> = (props: Props): React.JSX.Element => {
  logger = Logger(TypesSheet, TypesSheet)
  logger.info('Render Types property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const { addedBy, addedOn, archived, children, description, name, shortDescription } = thing
  const childrenCount: number = children ? children.totalCount : 0
  return (
    <>
      <TypeTitleBar
        childrenCount={childrenCount}
        configuration={configuration}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='typesSheet.title'
        titleTextValues={{ count: childrenCount.toString(), name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {shortDescription && <ShortDescriptionField shortDescription={shortDescription} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default TypesSheet
