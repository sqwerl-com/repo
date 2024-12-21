import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import type { SheetState } from '@/properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  done: boolean
  state: SheetState
}

/**
 * Renders a read-only field that specifies whether a thing, like notes, is complete.
 * @param props
 * @constructor
 */
const CompletedField = (props: Props): React.JSX.Element => {
  const { done } = props
  const intl = useIntl()
  const textId = done ? 'affirmative' : 'negative'

  return (
    <>
      <div className='sqwerl-properties-read-only-field'>
        <ReadOnlyFieldLabel labelText={intl.formatMessage({ id: 'completed.field.label' })} />
        <div className='sqwerl-properties-read-only-field-value'>
          <span className='sqwerl-read-only-field-sub-item-type-name'>
            {intl.formatMessage({ id: textId })}
          </span>
        </div>
      </div>
    </>
  )
}

export default CompletedField
