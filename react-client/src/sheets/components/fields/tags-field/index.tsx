import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  tags: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the text that a thing has been tagged with.
 * @param props
 * @constructor
 */
const TagsField = (props: Props): React.JSX.Element => {
  const { tags, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={tags}
      createLink={tagsLink}
      fieldLabel={intl.formatMessage({ id: 'tags.field.label' }, { tagsCount: tags.totalCount })}
      property='tags'
      state={state}
    />)
}

/**
 * Renders links to text tags.
 * @param intl
 * @param tags
 * @param state
 */
const tagsLink = (intl: IntlShape, tags: Thing, state: SheetState) => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, taggedCount, type } = tags
  const tagsText = intl.formatMessage({ id: 'hasSameTagCount' }, { taggedCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: tagsText }} />
    </span>
  )
}

export default TagsField
