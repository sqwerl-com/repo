import { CollectionType, Thing } from '@/utils/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import * as React from 'react'

interface Props {
  roles: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that displays the security roles that a user is allowed to play.
 * @param props
 * @constructor
 */
const RolesField = (props: Props): React.JSX.Element => {
  const { roles, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={roles}
      createLink={roleLink}
      fieldLabel={intl.formatMessage({ id: 'roles.field.label' }, { count: roles.totalCount })}
      property='roles'
      state={state}
    />)
}

/**
 * Renders hyperlinks to security roles. A security role defines a set of permissions and capabilities that are
 * granted to any contributor or team of contributors allowed to perform the role.
 * @param _intl
 * @param role
 * @param state
 */
const roleLink = (_intl: IntlShape, role: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type } = role
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default RolesField
