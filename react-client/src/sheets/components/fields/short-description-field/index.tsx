import { useIntl } from 'react-intl'
import { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  shortDescription: string
  state: SheetState
}

/**
 * Renders a read-only field that displays a thing's short textual description.
 * @param props
 * @constructor
 */
const ShortDescriptionField = (props: Props): React.JSX.Element => {
  const { shortDescription } = props
  const intl = useIntl()
  return (
    <>
      {shortDescription &&
        <div className='sqwerl-properties-read-only-field'>
          <div className='sqwerl-properties-read-only-field-label'>
            {intl.formatMessage({ id: 'shortDescription.field.label' })}
          </div>
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
