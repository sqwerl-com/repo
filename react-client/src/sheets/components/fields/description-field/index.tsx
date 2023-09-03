import { SheetState } from 'properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  description: string
  state: SheetState
}

/**
 * Renders a read-only field that shows a textual description of a thing.
 * @param props
 * @constructor
 */
const DescriptionField = (props: Props): React.JSX.Element => {
  const { description } = props
  const intl = useIntl()
  return (
    <>
      {description &&
        <div className='sqwerl-properties-read-only-field'>
          <div className='sqwerl-properties-read-only-field-label'>
            {intl.formatMessage({ id: 'description.field.label' })}
          </div>
          <div
            className='sqwerl-properties-read-only-field-value'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>}
    </>
  )
}

export default DescriptionField
