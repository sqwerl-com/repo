import ArchivedField from '../components/fields/archived-field'
import DescriptionField from 'sheets/components/fields/description-field'
import HistoryField from 'sheets/components/fields/history-field'
import LinksField from 'sheets/components/fields/links-field'
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
 * Renders a read-only form that displays information about a collection that contains related things.
 * @param props
 * @constructor
 */
const CollectionsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(CollectionsSheet, CollectionsSheet)
  logger.info('Rendering Collections property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const { addedBy, addedOn, archived, children, description, links, name, shortDescription } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={['archived']}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='collectionsSheet.title'
        titleTextValues={{ name, thingCount: children ? children.totalCount : 0 }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {shortDescription &&
          <div className='sqwerl-properties-read-only-field'>
            <div className='sqwerl-properties-read-only-field-label'>Short description</div>
            <div className='sqwerl-properties-read-only-field-value'>{shortDescription}</div>
          </div>}
        {links && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default CollectionsSheet
