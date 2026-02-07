import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { useIntl } from 'react-intl'
import * as React from 'react'

export interface Props {
  archived: boolean
}

/**
 * Renders a read-only field that indicates whether a thing has been archived (marked irrelevant or obsolete).
 * @param props
 */
const ArchivedField = (props: Props): React.JSX.Element => {
  const { archived } = props
  const intl = useIntl()
  const isArchivedValue = intl.formatMessage({ id: archived ? 'affirmative' : 'negative' })

  return (
    <div className='sqwerl-properties-read-only-field'>
      <ReadOnlyFieldLabel
        description={intl.formatMessage({ id: 'archived.field.description' })}
        labelText={intl.formatMessage({ id: 'archived.field.label' })} />
      <div
        className='sqwerl-properties-read-only-field-value'
        dangerouslySetInnerHTML={{ __html: isArchivedValue }}
      />
    </div>
  )
}

export default ArchivedField
