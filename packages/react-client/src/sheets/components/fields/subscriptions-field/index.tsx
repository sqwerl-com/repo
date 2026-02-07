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
  subscriptions: CollectionType<Thing>
}

/**
 * Renders a read-only field that displays information about data sources that individuals subscribe to in order
 * to be notified when new content is posted.
 * @param props
 */
const SubscriptionsField = (props: Props): React.JSX.Element => {
  const { subscriptions, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={subscriptions}
      createLink={subscriptionLink}
      fieldLabel={intl.formatMessage({ id: 'subscriptions.field.label' }, { count: subscriptions.totalCount })}
      property='subscriptions'
      state={state}
    />
  )
}

/**
 * Renders hyperlinks to feeds a user has subscribed to.
 * @param intl
 * @param subscription
 * @param state
 */
const subscriptionLink = (intl: IntlShape, subscription: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = subscription
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

export default SubscriptionsField
