import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { SheetState } from '@/properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  middleNameOrInitial: string
  state: SheetState
}

/**
 * Renders a read-only field that displays a person's middle name or middle name initial.
 * @param props
 * @constructor
 */
const MiddleNameOrInitialField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { middleNameOrInitial } = props
  return (
    <>
      {middleNameOrInitial &&
        <div className='sqwerl-properties-read-only-field'>
          <ReadOnlyFieldLabel labelText={intl.formatMessage({ id: 'middleNameOrInitial.field.label' })} />
          <div
            className='sqwerl-properties-read-only-field-value'
            // TODO - Scrub the value to make sure its secured against XSS attacks.
            dangerouslySetInnerHTML={{ __html: middleNameOrInitial }}
          />
        </div>}
    </>
  )
}

export default MiddleNameOrInitialField
