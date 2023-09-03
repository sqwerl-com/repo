import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  readBy: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists who have read a thing (like a book or a web page).
 * @param props
 * @constructor
 */
const ReadByField = (props: Props): React.JSX.Element => {
  const { readBy, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={readBy}
      createLink={readByLink}
      fieldLabel={intl.formatMessage({ id: 'readBy.field.label' }, { count: readBy.totalCount })}
      property='readBy'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things that have been read.
 * @param intl
 * @param readBy
 * @param state
 */
const readByLink = (intl: IntlShape, readBy: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { hasReadCount, id, name, type } = readBy
  const hasReadText = intl.formatMessage({ id: 'hasReadCount' }, { hasReadCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      {/* TODO - Sanitize the value to make sure it's not an XSS threat. */}
      <span dangerouslySetInnerHTML={{ __html: hasReadText }} />
    </span>
  )
}

export default ReadByField
