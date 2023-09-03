import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field, { renderFieldValue } from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  hasRead: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that specifies the things that a user has read.
 * @param props
 * @constructor
 */
const HasReadField = (props: Props): React.JSX.Element => {
  const { hasRead, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={hasRead}
      property='hasRead'
      fieldLabel={intl.formatMessage({ id: 'hasRead.field.label' }, { count: hasRead.totalCount })}
      createLink={(intl: IntlShape, hasRead: Thing) =>
        renderFieldValue(intl, 'hasRead', hasRead, state)}
      state={state}
    />)
}

export default HasReadField
