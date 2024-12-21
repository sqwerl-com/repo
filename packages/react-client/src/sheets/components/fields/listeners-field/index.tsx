import { CollectionType, Thing } from '@/utils/types'
import Field from '@/sheets/components/fields/field'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import { IntlShape, useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  listeners: CollectionType<Thing>
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
    />
  )
}

/**
 * Renders hyperlinks to things people who have listened to things.
 * @param _intl
 * @param listener
 * @param state
 */
const listenersLink = (_intl: IntlShape, listener: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type } = listener
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

export default ListenersField
