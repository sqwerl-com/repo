import ApplicationContext from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  capabilities: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the capabilities granted to users.
 * @param props
 */
const CapabilitiesField = (props: Props): React.JSX.Element => {
  const { capabilities, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={capabilities}
      createLink={capabilitiesLink}
      fieldLabel={intl.formatMessage({ id: 'capabilities.field.label' }, { count: capabilities.totalCount })}
      property='capabilities'
      state={state}
    />
  )
}

/**
 * Renders links to security capabilities (permissions granted to users to perform secured operations).
 * @param _intl
 * @param capabilities
 * @param state
 */
const capabilitiesLink = (_intl: IntlShape, capabilities: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type } = capabilities

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

export default CapabilitiesField
