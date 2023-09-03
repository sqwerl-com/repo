import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  archived: boolean
}

/**
 * Renders a read-only field that indicates whether a thing has been archived (marked irrelevant or obsolete).
 * @param props
 * @constructor
 */
const ArchivedField = (props: Props): React.JSX.Element => {
  const { archived } = props
  const intl = useIntl()
  const isArchivedValue = intl.formatMessage({ id: archived ? 'affirmative' : 'negative' })
  return (
    <div className='sqwerl-properties-read-only-field'>
      <div className='sqwerl-properties-read-only-field-label'>
        {intl.formatMessage({ id: 'archived.field.label' })}
      </div>
      <div
        className='sqwerl-properties-read-only-field-value'
        dangerouslySetInnerHTML={{ __html: isArchivedValue }}
      />
    </div>
  )
}

export default ArchivedField
