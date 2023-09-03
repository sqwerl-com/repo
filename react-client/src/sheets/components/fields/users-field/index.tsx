import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  state: SheetState
  users: CollectionType<BasicThing>
}

/**
 * Renders a read-only field that lists users: people who use Sqwerl.
 * @param props
 * @constructor
 */
const UsersField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { users, state } = props
  return (
    <Field
      collection={users}
      createLink={userLink}
      fieldLabel={intl.formatMessage({ id: 'users.field.label' }, { count: users.totalCount })}
      property='users'
      state={state}
    />)
}

/**
 * Renders hyperlinks to users (people who use Sqwerl).
 * @param intl
 * @param user
 * @param state
 */
const userLink = (intl: IntlShape, user: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = user
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

export default UsersField
