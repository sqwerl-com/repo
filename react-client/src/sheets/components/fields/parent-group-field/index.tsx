import { BasicThing, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  parent: BasicThing
  state: SheetState
}

/**
 * Renders a read-only field that points to a group of users parent group of users.
 * @param props
 * @constructor
 */
const ParentGroupField = (props: Props): React.JSX.Element => {
  const { parent, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={{ offset: 0, members: [parent], totalCount: 1 }}
      createLink={parentGroupLink}
      fieldLabel={intl.formatMessage({ id: 'parentGroup.field.label' })}
      property='parentGroup'
      state={state}
    />)
}

/**
 * Renders links to groups of users that are parents of other groups of users.
 * @param intl
 * @param parent
 * @param state
 */
const parentGroupLink = (intl: IntlShape, parent: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = parent
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default ParentGroupField
