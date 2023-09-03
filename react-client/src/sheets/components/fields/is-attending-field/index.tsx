import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field, { renderFieldValue } from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  isAttending: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that specifies the things (like courses, talks, or seminars) that people are currently
 * attending.
 * @param props
 * @constructor
 */
const IsAttendingField = (props: Props): React.JSX.Element => {
  const { isAttending, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={isAttending}
      createLink={(intl: IntlShape, isAttending: Thing, state: SheetState) =>
        renderFieldValue(intl, 'isAttending', isAttending, state)}
      fieldLabel={intl.formatMessage({ id: 'isAttending.field.label' }, { count: isAttending.totalCount })}
      property='isAttending'
      state={state}
    />)
}

export default IsAttendingField
