import { CollectionType, Thing } from 'utils/types'
import Field, { renderFieldValue } from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  attending: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that specifies things a user is attending.
 * @param props
 * @constructor
 */
const AttendingField = (props: Props): React.JSX.Element => {
  const { attending, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={attending}
      createLink={(intl: IntlShape, attending: Thing, state: SheetState) =>
        renderFieldValue(intl, 'isAttending', attending, state)}
      property='attending'
      fieldLabel={intl.formatMessage({ id: 'attending.field.label' }, { count: attending.totalCount })}
      state={state}
    />
  )
}

export default AttendingField
