import { CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  recommendedBy: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the things that have recommended a thing.
 * @param props
 * @constructor
 */
const RecommendedByField = (props: Props): React.JSX.Element => {
  const { state } = props
  const intl = useIntl()
  const { recommendedBy } = props
  return (
    <Field
      collection={recommendedBy}
      createLink={recommendedByLink}
      fieldLabel={intl.formatMessage({ id: 'recommendedBy.field.label' }, { count: recommendedBy.totalCount })}
      property='recommendedBy'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things that have recommended a thing.
 * @param intl
 * @param recommendedBy
 * @param state
 */
const recommendedByLink = (intl: IntlShape, recommendedBy: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = recommendedBy
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

export default RecommendedByField
