import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  spokeAt: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists things that a person has spoken at.
 * @param props
 * @constructor
 */
const SpokeAtField = (props: Props): React.JSX.Element => {
  const { spokeAt, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={spokeAt}
      createLink={spokeAtLink}
      fieldLabel={intl.formatMessage({ id: 'spokeAt.field.label' }, { count: spokeAt.totalCount })}
      property='spokeAt'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things a person has spoken at.
 * @param intl
 * @param spokeAt
 * @param state
 */
const spokeAtLink = (intl: IntlShape, spokeAt: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = spokeAt
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {' ' + intl.formatMessage({ id: 'isA' }, { name: lowerCaseFirstLetter(typeName) })}
      </span>
    </span>
  )
}

export default SpokeAtField
