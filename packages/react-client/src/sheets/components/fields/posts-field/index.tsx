import { CollectionType, Thing } from '@/utils/types'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import type { SheetState } from '@/properties'
import TableField from '@/sheets/components/fields/table-field'
import * as React from 'react'
import Field from '@/sheets/components/fields/field'
import IsTypeOfThing from '@/sheets/components/is-type-of-thing'
import IsThingOfType from '@/sheets/components/is-thing-of-type'

interface Props {
  posts: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that shows an RSS feed's posts.
 * @param props
 */
const PostsField = (props: Props): React.JSX.Element => {
  const { posts, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={posts}
      createLink={postLink}
      fieldLabel={intl.formatMessage({ id: 'posts.field.label' }, { count: posts.totalCount })}
      property='posts'
      state={state}
    />)
    /* TODO - Remove
    <TableField
      collection={posts}
      columnProperties={['name', 'typeName']}
      columnTitles={[
        intl.formatMessage({ id: 'postsField.posts.nameTitle' }),
        intl.formatMessage({ id: 'postsField.posts.typeTitle' })
      ]}
      createLink={postLink}
      fieldLabel={intl.formatMessage({ id: 'posts.field.label' }, { count: posts.totalCount })}
      property='posts'
      state={state}
    />)
     */
}

/**
 * Renders links to an RSS feed's post.
 * @param _intl
 * @param post
 * @param linkCount
 * @param state
 */
const postLink = (_intl: IntlShape, post: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const { applicationName } = configuration
  const { id, typeName } = post
  const isType = {}.hasOwnProperty.call(post, 'isType') && post.isType
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        key={`collection-link-${id}`}
        to={`${state.context.parentThingIdToHref(currentRepositoryName, id)}` +
          `#/${applicationName}/${currentRepositoryName}${state.context.encodeUriReplaceStringsWithHyphens(id)}`}
      >
        {post.name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {isType ? <IsTypeOfThing/> : <IsThingOfType typeName={typeName}/>}
      </span>
    </span>
  )
}

export default PostsField
