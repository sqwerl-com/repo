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
  authorOf: CollectionType<Thing>
  fieldDescription?: string
  state: SheetState
}

/**
 * Renders a read-only field that displays links to the things an author has authored.
 * @param props
 */
const AuthorOfField = (props: Props): React.JSX.Element => {
  const { authorOf, fieldDescription, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={authorOf}
      createLink={authorOfLink}
      fieldDescription={fieldDescription}
      fieldLabel={intl.formatMessage({ id: 'authorOf.field.label' }, { count: authorOf.totalCount })}
      property='authorOf'
      state={state}
    />
  )
}

/**
 * Renders a hyperlink to an authored thing.
 * @param intl
 * @param authorOf
 * @param state
 */
const authorOfLink = (intl: IntlShape, authorOf: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = authorOf
  const lowerCaseTypeName = lowerCaseFirstLetter(typeName)
  const typeMessageKey = `is${typeName}`

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        <span className='sqwerl-read-only-field-label-text'>{name}</span>
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {typeName && (' ' +
            intl.formatMessage(
              { id: typeMessageKey },
              { name: lowerCaseTypeName, typeName: lowerCaseTypeName }
            ))}
      </span>
    </span>
  )
}

export default AuthorOfField
