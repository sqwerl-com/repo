import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field, { renderFieldValue } from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  isReading: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that specifies the things a user is currently reading.
 * @param props
 * @constructor
 */
const IsReadingField = (props: Props): React.JSX.Element => {
  const { isReading, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={isReading}
      createLink={(intl: IntlShape, isReading: Thing, state: SheetState) =>
        renderFieldValue(intl, 'isReading', isReading, state)}
      fieldLabel={intl.formatMessage({ id: 'isReading.field.label' }, { count: isReading.totalCount })}
      property='isReading'
      state={state}
    />)
}

export default IsReadingField
