import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { SheetState } from '@/properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

export interface Props {
  shortDescription: string
  state: SheetState
}

/**
 * Renders a read-only field that displays a thing's short textual description.
 * @param props
 */
const ShortDescriptionField = (props: Props): React.JSX.Element => {
  const { shortDescription } = props
  const intl = useIntl()

  return (
    <>
      {shortDescription &&
        <div className='sqwerl-properties-read-only-field'>
          <ReadOnlyFieldLabel
            description={intl.formatMessage({ id: 'shortDescription.field.description' })}
            labelText={intl.formatMessage({ id: 'shortDescription.field.label' })}
          />
          <div
            className='sqwerl-properties-read-only-field-value'
            // TODO - Scrub the value to make sure it's not a XSS attack vulnerability.
            dangerouslySetInnerHTML={{ __html: shortDescription }}
          />
        </div>}
    </>
  )
}

export default ShortDescriptionField
