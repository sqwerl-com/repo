import { CollectionType, Thing } from '@/utils/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import * as React from 'react'

interface Props {
  state: SheetState
  webPages: CollectionType<Thing>
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
 * @param _intl
 * @param webPages
 * @param state
 */
const webPagesLink = (_intl: IntlShape, webPages: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type } = webPages
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default WebPagesField
