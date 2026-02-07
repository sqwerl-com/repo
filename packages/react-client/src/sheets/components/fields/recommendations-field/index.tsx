import ApplicationContext from '@/context/application'
import { CollectionType, Thing} from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import lowerCaseFirstLetter from '@/utilities/formatters/lower-case-first-letter'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  recommendations: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the things that a thing recommends.
 * @param props
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
    />
  )
}

/**
 * Renders links to thing that a thing recommends people look at.
 * @param intl
 * @param recommendation
 * @param state
 */
const recommendationsLink = (intl: IntlShape, recommendation: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = recommendation

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
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
