import ArchivedField from '@/sheets/components/fields/archived-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import ReadOnlyFieldLabel from '../components/read-only-field-label'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TitleBar from '@/sheets/components/title-bar'
import { useIntl } from 'react-intl'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a collection that contains related things.
 * @param props
 */
const CollectionsSheet = (props: Props): React.JSX.Element => {

  const intl = useIntl()
  const logger = loggerFactory.create(CollectionsSheet)
  const { state } = props
  const { configuration, thing } = state

  logger.info('Rendering Collections property sheet')

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
        state={state}
        thing={thing}
        titleTextId='collectionsSheet.title'
        titleTextValues={{ name, thingCount: children.totalCount.toString() }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {(shortDescription.length > 0) &&
          <div className='sqwerl-properties-read-only-field'>
            <ReadOnlyFieldLabel
              description={intl.formatMessage({ id: 'collections.shortDescriptionField.description' })}
              labelText={intl.formatMessage({ id: 'shortDescription.field.label' } )} />
            <div className='sqwerl-properties-read-only-field-value'>{shortDescription}</div>
          </div>
        }
        {(description != undefined) && <DescriptionField description={description} state={state} />}
        {(links?.members.length > 0) && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(CollectionsSheet)

export default CollectionsSheet
