import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  groups: CollectionType<BasicThing>
  state: SheetState
}

const GroupsField = (props: Props): React.JSX.Element => {
  const { groups, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={groups}
      createLink={groupsLink}
      fieldLabel={intl.formatMessage({ id: 'groups.field.label' }, { count: groups.totalCount })}
      property='groups'
      state={state}
    />)
}

const groupsLink = (intl: IntlShape, groups: BasicThing, state: SheetState) => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = groups
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

export default GroupsField
