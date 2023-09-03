import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  feeds: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that contains hyperlinks to a thing's RSS feeds.
 * @param {Props} props
 * @returns {JSX.Element}
 * @constructor
 */
const FeedsField = (props: Props): React.JSX.Element => {
  const { feeds, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={feeds}
      createLink={feedLink}
      fieldLabel={intl.formatMessage({ id: 'feeds.field.label' }, { count: feeds.totalCount })}
      property='feeds'
      state={state}
    />)
}

/**
 * Renders a hyperlink to an RSS feed.
 * @param {IntlShape} intl
 * @param {BasicThing} feed
 * @param {SheetState} state
 * @returns {React.ReactNode}
 */
const feedLink = (intl: IntlShape, feed: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = feed
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

export default FeedsField
