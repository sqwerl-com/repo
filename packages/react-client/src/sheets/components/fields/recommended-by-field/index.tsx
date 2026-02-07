import ApplicationContext from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import lowerCaseFirstLetter from '@/utilities/formatters/lower-case-first-letter'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  recommendedBy: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the things that have recommended a thing.
 * @param props
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
    />
  )
}

/**
 * Renders hyperlinks to things that have recommended a thing.
 * @param intl
 * @param recommendedBy
 * @param state
 */
const recommendedByLink = (intl: IntlShape, recommendedBy: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = recommendedBy

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

export default RecommendedByField
