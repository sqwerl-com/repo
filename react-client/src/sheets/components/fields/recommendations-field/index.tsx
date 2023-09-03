import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  recommendations: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the things that a thing recommends.
 * @param props
 * @constructor
 */
const RecommendationsField = (props: Props): React.JSX.Element => {
  const { recommendations, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={recommendations}
      createLink={recommendationsLink}
      fieldLabel={intl.formatMessage({ id: 'recommendations.field.label' }, { count: recommendations.totalCount })}
      property='recommendations'
      state={state}
    />)
}

/**
 * Renders links to thing that a thing recommends people look at.
 * @param intl
 * @param recommendation
 * @param state
 */
const recommendationsLink = (intl: IntlShape, recommendation: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = recommendation
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

export default RecommendationsField
