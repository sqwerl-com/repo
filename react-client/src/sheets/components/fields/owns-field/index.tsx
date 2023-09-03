import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import IsThingOfType from 'sheets/components/is-thing-of-type'
import IsTypeOfThing from 'sheets/components/is-type-of-thing'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  owns: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the data about things that people own.
 * @param props
 * @constructor
 */
const OwnsField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { owns, state } = props
  return (
    <Field
      collection={owns}
      createLink={ownsLink}
      fieldLabel={intl.formatMessage({ id: 'owns.field.label' }, { count: owns.totalCount })}
      property='owns'
      state={state}
    />)
}

/**
 * Renders hyperlinks to the data about things that people own.
 * @param intl
 * @param owns  A thing that a user owns.
 * @param state
 */
const ownsLink = (intl: IntlShape, owns: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = owns
  const isType = {}.hasOwnProperty.call(owns, 'isType') && owns.isType
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {isType ? <IsTypeOfThing /> : <IsThingOfType typeName={typeName} />}
      </span>
    </span>
  )
}

export default OwnsField
