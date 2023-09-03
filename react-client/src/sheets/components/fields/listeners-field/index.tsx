import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import { IntlShape, useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  listeners: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field with links to people how have listened to things (like talks, podcasts, etc.)
 * @param props
 * @constructor
 */
const ListenersField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { listeners, state } = props
  return (
    <Field
      collection={listeners}
      createLink={listenersLink}
      fieldLabel={intl.formatMessage({ id: 'listeners.field.label' }, { count: listeners.totalCount })}
      property='listeners'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things people who have listned to things.
 * @param intl
 * @param listener
 * @param state
 */
const listenersLink = (intl: IntlShape, listener: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = listener
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

export default ListenersField
