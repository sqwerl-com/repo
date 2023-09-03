import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  subgroups: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists groups of users that are children of a parent group of users.
 * @param props
 * @constructor
 */
const SubgroupsField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { subgroups, state } = props
  return (
    <Field
      collection={subgroups}
      createLink={subgroupsLink}
      fieldLabel={intl.formatMessage({ id: 'subgroups.field.label' }, { count: subgroups.totalCount })}
      property='subgroups'
      state={state}
    />)
}

/**
 * Renders hyperlinks to groups of users that are children of a parent group of users.
 * @param intl
 * @param subgroup
 * @param state
 */
const subgroupsLink = (intl: IntlShape, subgroup: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = subgroup
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

export default SubgroupsField
