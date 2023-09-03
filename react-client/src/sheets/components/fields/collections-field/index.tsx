import { ChevronRight } from 'react-feather'
import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  collections: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that shows the collections of things that a thing is a member of.
 * @param props
 */
const CollectionsField = (props: Props): React.JSX.Element => {
  const { collections, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={collections}
      createLink={collectionLink}
      fieldLabel={intl.formatMessage({ id: 'collection.field.label' }, { count: collections.totalCount })}
      property='collections'
      state={state}
    />)
}

/**
 * Renders links to collections of things.
 * @param intl
 * @param collection
 * @param state
 */
const collectionLink = (intl: IntlShape, collection: Thing, state: SheetState): React.ReactNode => {
  const { childrenCount, id } = collection
  const collectionCount = intl.formatMessage({ id: 'hasChildren' }, { count: childrenCount })
  const { configuration, currentLibraryName } = state
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        key={`collection-link-${id}`}
        to={`${state.context.parentThingIdToHref(id)}#/${configuration.applicationName}/` +
          `${currentLibraryName}/${state.context.encodeUriReplaceStringsWithHyphens(id)}`}
      >
        {collectionLinkAnchorText(collection)}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: collectionCount }} />
    </span>
  )
}

/**
 * Returns the HTML markup for an HTML anchor tag to a collection of things.
 * @param collection A collection of related things.
 */
const collectionLinkAnchorText = (collection: Thing): React.ReactNode => {
  const { path } = collection
  const pathComponents = path && path.split('/')
  const anchorText: React.ReactNode[] = []
  if (pathComponents && (pathComponents.length > 3)) {
    const length = pathComponents.length
    for (let i = 3; i < length; i += 1) {
      anchorText.push(<span>{pathComponents[i]}</span>)
      if (i < (length - 1)) {
        anchorText.push(<ChevronRight className='sqwerl-path-separator' />)
      }
    }
  }
  return (anchorText)
}

export default CollectionsField
