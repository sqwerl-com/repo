import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { SheetState } from '@/properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

export interface Props {
  description: string
  state: SheetState
}

/**
 * Renders a read-only field that shows a textual description of a thing.
 * @param props
 */
const DescriptionField = (props: Props): React.JSX.Element => {
  const { description } = props
  const intl = useIntl()

  return (
    <>
      {description &&
        <div className='sqwerl-properties-read-only-field'>
          <ReadOnlyFieldLabel
            description={intl.formatMessage({ id: 'description.field.description' })}
            labelText={intl.formatMessage({ id: 'description.field.label' })} />
          <div
            className='sqwerl-properties-read-only-field-value'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>}
    </>
  )
}

export default DescriptionField
