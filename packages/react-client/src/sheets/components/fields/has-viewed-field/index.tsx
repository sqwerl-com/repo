import { CollectionType, Thing } from '@/utilities/types'
import Field, { renderFieldValue } from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import type { SheetState } from '@/properties'
import * as React from 'react'

export interface Props {
  hasViewed: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that specifies the things a user has viewed.
 * @param props
 */
const HasViewedField = (props: Props): React.JSX.Element => {
  const { hasViewed, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={hasViewed}
      createLink={(intl: IntlShape, hasViewed: Thing) =>
        renderFieldValue(intl, 'hasViewed', hasViewed, state)}
      fieldLabel={intl.formatMessage({ id: 'hasViewed.field.label' }, { count: hasViewed.totalCount })}
      property='hasViewed'
      state={state}
    />
  )
}

export default HasViewedField
