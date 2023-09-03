import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  authors: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to authors.
 * @param props
 * @constructor
 */
const AuthorsField = (props: Props): React.JSX.Element => {
  const { authors, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={authors}
      createLink={authorLink}
      fieldLabel={intl.formatMessage({ id: 'author.field.label' }, { count: authors.totalCount })}
      property='authors'
      state={state}
    />)
}

/**
 * Renders a hyperlink to an author.
 * @param intl
 * @param author
 * @param state
 */
const authorLink = (intl: IntlShape, author: Thing, state: SheetState): React.ReactNode => {
  const { authorOfCount, id, name, type } = author
  const { configuration, context, currentLibraryName } = state
  const authorOfText = intl.formatMessage({ id: 'authorOf' }, { authorOfCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: authorOfText }} />
    </span>
  )
}

export default AuthorsField
