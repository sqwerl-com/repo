import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { useIntl } from 'react-intl'
import * as React from 'react'

export interface Props {
  /** Text that describes a title field--typically displayed within a tooltip */
  description: string | undefined,

  /** Text to label this title field */
  label?: string,

  /** A thing's title to display as this field's value */
  title: string
}

/**
 * Renders a read-only field whose value is a thing's title.
 * @param props
 */
const TitleField = (props: Props): React.JSX.Element => {
  const { description, label, title } = props
  const intl = useIntl()
  const labelText = label ?? intl.formatMessage({ id: 'title.label' })

  return (
    <>
      {title &&
        <div className='sqwerl-properties-read-only-field'>
          <ReadOnlyFieldLabel
            description={description}
            labelText={labelText}
          />
          <div className='sqwerl-properties-read-only-field-value'>
            <span className='sqwerl-properties-title-value'>{title}</span>
          </div>
        </div>
      }
    </>
  )
}

export default TitleField
