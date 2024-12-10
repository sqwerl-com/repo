import { CollectionType, Thing } from '@/utils/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import * as React from 'react'

interface Props {
  contributors: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that lists contributors: people who use Sqwerl to manage the thing that make them smart.
 * @param props
 * @constructor
 */
const ContributorsField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { contributors, state } = props
  return (
    <Field
      collection={contributors}
      createLink={contributorLink}
      fieldLabel={intl.formatMessage({ id: 'contributors.field.label' }, { count: contributors.totalCount })}
      property='users'
      state={state}
    />)
}

/**
 * Renders hyperlinks to contributors.
 * @param _intl
 * @param contributor
 * @param state
 */
const contributorLink = (_intl: IntlShape, contributor: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type } = contributor
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

export default ContributorsField
