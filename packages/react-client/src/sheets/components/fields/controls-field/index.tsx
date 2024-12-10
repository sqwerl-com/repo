import { CollectionType, Thing } from '@/utils/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import IsThingOfType from '@/sheets/components/is-thing-of-type'
import IsTypeOfThing from '@/sheets/components/is-type-of-thing'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import * as React from 'react'

interface Props {
  controls: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the data about things that contributors control access to.
 * @param props
 * @constructor
 */
const ControlsField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { controls, state } = props
  return (
    <Field
      collection={controls}
      createLink={controlsLink}
      fieldLabel={intl.formatMessage({ id: 'controls.field.label' }, { count: controls.totalCount })}
      property='controls'
      state={state}
    />)
}

/**
 * Renders hyperlinks to the data about things that contributors control access to.
 * @param _intl
 * @param controls  A thing that a contributor controls access to.
 * @param state
 */
const controlsLink = (_intl: IntlShape, controls: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type, typeName } = controls
  const isType = {}.hasOwnProperty.call(controls, 'isType') && controls.isType
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {isType ? <IsTypeOfThing /> : <IsThingOfType typeName={typeName} />}
      </span>
    </span>
  )
}

export default ControlsField
