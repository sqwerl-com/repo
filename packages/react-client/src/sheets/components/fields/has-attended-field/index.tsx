import { CollectionType, Thing } from '@/utils/types'
import Field, { renderFieldValue } from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import type { SheetState } from '@/properties'
import * as React from 'react'

interface Props {
  hasAttended: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that specifies the things a user has attended.
 * @param props
 * @constructor
 */
const HasAttendedField = (props: Props): React.JSX.Element => {
  const { hasAttended, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={hasAttended}
      createLink={(intl: IntlShape, hasAttended: Thing, state: SheetState) =>
        renderFieldValue(intl, 'hasAttended', hasAttended, state)}
      fieldLabel={intl.formatMessage({ id: 'hasAttended.field.label' }, { count: hasAttended.totalCount })}
      property='hasAttended'
      state={state}
    />)
}

export default HasAttendedField
