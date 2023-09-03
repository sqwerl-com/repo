import { BasicThing } from 'utils/types'
import { ConfigurationType } from 'configuration'
import { connectionCount } from 'sheets/components/connections-count'
import OpenInNewTabOrWindowLink from 'sheets/components/open-in-new-tab-or-window-link'
import ReactDOMServer from 'react-dom/server'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  /** Application configuration. */
  configuration: ConfigurationType

  /** Names of a thing's properties whose values refer to other things. */
  connectionProperties: string[]

  /** The CSS class name for an icon that represents a thing. */
  icon: string

  /** Text that describes an icon that represents a thing. */
  iconDescription: string

  /** The thing whose title is displayed within this title bar. */
  thing: BasicThing

  /** Unique identifier for a title bar's text. */
  titleTextId: string

  /** Map of value names to values for the values to insert into the title format to form the title text. */
  titleTextValues: any
}

/**
 * Renders a property sheet's title bar.
 * @param props
 */
const TitleBar = (props: Props): React.JSX.Element => {
  const {
    connectionProperties,
    icon,
    iconDescription,
    thing,
    titleTextId,
    titleTextValues
  } = props
  const hasEmbeddedLink = titleTextValues && titleTextValues.url
  const intl = useIntl()
  const connectionsText = intl.formatMessage(
    {
      id: 'connectionsCount'
    },
    { count: connectionCount({ connectionProperties, thing }) }
  )
  const linkText = intl.formatMessage(
    { id: titleTextId },
    {
      connections: connectionsText,
      count: titleTextValues.count,
      linkIcon: ReactDOMServer.renderToString(<OpenInNewTabOrWindowLink url={titleTextValues.url} />),
      name: titleTextValues.name,
      thingCount: titleTextValues.thingCount,
      url: titleTextValues.url
    }).replace(/url/, titleTextValues.url)
  return (
    <header className='sqwerl-properties-title-bar'>
      <div className='sqwerl-properties-title-bar-title'>
        {icon && (<img alt={iconDescription} className='sqwerl-properties-title-icon' src={icon} />)}
        {titleTextId && hasEmbeddedLink &&
          <div className='sqwerl-properties-title-text' dangerouslySetInnerHTML={{ __html: linkText }} />}
        {titleTextId && (!hasEmbeddedLink) &&
          <div
            className='sqwerl-properties-title-text'
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({
                id: titleTextId
              }, {
                connections: connectionsText,
                ...titleTextValues
              })
            }}
          />}
      </div>
    </header>
  )
}

export default TitleBar
