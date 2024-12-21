import { CollectionType, Thing } from '@/utils/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import * as React from 'react'

interface Props {
  state: SheetState
  teams: CollectionType<Thing>
}

const TeamsField = (props: Props): React.JSX.Element => {
  const { state, teams } = props
  const intl = useIntl()

  return (
    <Field
      collection={teams}
      createLink={teamsLink}
      fieldLabel={intl.formatMessage({ id: 'teams.field.label' }, { count: teams.totalCount })}
      property='teams'
      state={state}
    />
  )
}

const teamsLink = (_intl: IntlShape, teams: Thing, state: SheetState) => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type } = teams

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

export default TeamsField
