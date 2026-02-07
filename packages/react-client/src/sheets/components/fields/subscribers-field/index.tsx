import ApplicationContext from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import lowerCaseFirstLetter from '@/utilities/formatters/lower-case-first-letter'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  state: SheetState
  subscribers: CollectionType<Thing>
}

/**
 * Renders a read-only field that displays users who have subscribed to a feed.
 * @param props
 */
const SubscribersField = (props: Props): React.JSX.Element => {
  const { subscribers, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={subscribers}
      createLink={subscriberLink}
      fieldLabel={intl.formatMessage({ id: 'subscribers.field.label' }, { count: subscribers.totalCount })}
      property='subscribers'
      state={state}
    />
  )
}

/**
 * Renders hyperlinks to users who have subscribed to a feed.
 * @param intl
 * @param subscriber
 * @param state
 */
const subscriberLink = (intl: IntlShape, subscriber: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = subscriber

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
      {' ' + intl.formatMessage({ id: 'isA' }, { name: lowerCaseFirstLetter(typeName) })}
    </span>
  )
}

export default SubscribersField
