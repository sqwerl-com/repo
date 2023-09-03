import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  state: SheetState
  webPages: CollectionType<BasicThing>
}

/**
 * Renders a read-only field that contains links to web pages.
 * @param props
 * @constructor
 */
const WebPagesField = (props: Props): React.JSX.Element => {
  const { webPages, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={webPages}
      createLink={webPagesLink}
      fieldLabel={intl.formatMessage({ id: 'webPages.field.label' }, { count: webPages.totalCount })}
      property='webPages'
      state={state}
    />)
}

/**
 * Renders hyperlinks to web pages.
 * @param intl
 * @param webPages
 * @param state
 */
const webPagesLink = (intl: IntlShape, webPages: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = webPages
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

export default WebPagesField
