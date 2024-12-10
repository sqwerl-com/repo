import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { SheetState } from '@/properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  firstName: string
  state: SheetState
}

const FirstNameField = (props: Props): React.JSX.Element => {
  const { firstName } = props
  const intl = useIntl()
  return (
    <>
      {firstName &&
        <div className='sqwerl-properties-read-only-field'>
          <ReadOnlyFieldLabel labelText={intl.formatMessage({ id: 'firstName.field.label' })} />
          <div
            className='sqwerl-properties-read-only-field-value'
            dangerouslySetInnerHTML={{ __html: firstName }}
          />
        </div>}
    </>
  )
}

export default FirstNameField
