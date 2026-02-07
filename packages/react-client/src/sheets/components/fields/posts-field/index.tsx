import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import Field from '@/sheets/components/fields/field'
import IsThingOfType from '@/sheets/components/is-thing-of-type'
import IsTypeOfThing from '@/sheets/components/is-type-of-thing'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  posts: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that shows an RSS feed's posts.
 * @param props
 */
const PostsField = (props: Props): React.JSX.Element => {
  const context = useContext(ApplicationContext)
  const { posts, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={posts}
      createLink={(intl, post, staet) => postLink(context, intl, post, state)}
      fieldLabel={intl.formatMessage({ id: 'posts.field.label' }, { count: posts.totalCount })}
      property='posts'
      state={state}
    />
  )
}

/**
 * Renders links to an RSS feed's post.
 * @param context
 * @param _intl
 * @param post
 * @param linkCount
 * @param state
 */
const postLink = (context: ApplicationContextType, _intl: IntlShape, post: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const { applicationName } = configuration
  const { id, typeName } = post
  const isType = {}.hasOwnProperty.call(post, 'isType') && post.isType

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        key={`collection-link-${id}`}
        to={`${context.parentThingIdToHref(currentRepositoryName, id)}` +
          `#/${applicationName}/${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(id)}`}
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
