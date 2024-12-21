import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import { Thing } from '@/utils/types'
import * as React from 'react'

interface Props {
  parent: Thing
  state: SheetState
}

/**
 * Renders a read-only field that points to a team of contributors parent team of contributors.
 * @param props
 * @constructor
 */
const ParentTeamField = (props: Props): React.JSX.Element => {
  const { parent, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={{ offset: 0, members: [parent], totalCount: 1 }}
      createLink={parentTeamLink}
      fieldLabel={intl.formatMessage({ id: 'parentTeam.field.label' })}
      property='parentTeam'
      state={state}
    />
  )
}

/**
 * Renders links to teams of contributors that are parents of other teams of contributors.
 * @param _intl
 * @param parent
 * @param state
 */
const parentTeamLink = (_intl: IntlShape, parent: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type } = parent

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

export default ParentTeamField
