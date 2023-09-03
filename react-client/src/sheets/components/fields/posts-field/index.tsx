import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  items: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists posts.
 * @param props
 * @constructor
 */
const PostsField = (props: Props): React.JSX.Element => {
  const { items, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={items}
      createLink={postsLink}
      fieldLabel={intl.formatMessage({ id: 'posts.field.label' }, { count: items.totalCount })}
      property='posts'
      state={state}
    />)
}

/**
 * Renders hyperlinks to posts.
 * @param intl
 * @param items
 * @param state
 */
const postsLink = (intl: IntlShape, items: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = items
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

export default PostsField
