import { SheetState } from 'properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  lastName: string
  state: SheetState
}

/**
 * Renders a read-only field that displays a person's last name (also known as surname or family name).
 * @param props
 * @constructor
 */
const LastNameField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { lastName } = props
  return (
    <>
      {lastName &&
        <div className='sqwerl-properties-read-only-field'>
          <div className='sqwerl-properties-read-only-field-label'>
            {intl.formatMessage({ id: 'lastName.field.label' })}
          </div>
          <div
            className='sqwerl-properties-read-only-field-value'
            // TODO - This value needs to be scrubbed to make sure it's not a source for XSS.
            dangerouslySetInnerHTML={{ __html: lastName }}
          />
        </div>}
    </>
  )
}

export default LastNameField
