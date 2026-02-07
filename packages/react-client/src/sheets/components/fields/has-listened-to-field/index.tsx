import { CollectionType, Thing } from '@/utilities/types'
import Field, { renderFieldValue } from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import type { SheetState } from '@/properties'
import * as React from 'react'

export interface Props {
  hasListenedTo: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that specifies the things a user has listened to.
 * @param props
 */
const HasListenedToField = (props: Props): React.JSX.Element => {
  const { hasListenedTo, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={hasListenedTo}
      createLink={(intl: IntlShape, hasListenedTo: Thing, state: SheetState) =>
        renderFieldValue(intl, 'hasListenedTo', hasListenedTo, state)}
      fieldLabel={intl.formatMessage({ id: 'hasListenedTo.field.label' }, { count: hasListenedTo.totalCount })}
      property='hasListenedTo'
      state={state}
    />
  )
}

export default HasListenedToField
