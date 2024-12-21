import { ConfigurationType } from '@/configuration'
import { connectionCount } from '@/sheets/components/connections-count'
import { NavigateFunction } from 'react-router-dom'
import OpenInNewTabOrWindowLink from '@/sheets/components/open-in-new-tab-or-window-link'
import ReactDOMServer from 'react-dom/server'
import type { SheetState } from '@/properties'
import { Thing } from '@/utils/types'
import { useIntl } from 'react-intl'
import * as React from 'react'
import { ChevronLeft } from 'react-feather'

interface Props {
  /** Application configuration. */
  configuration: ConfigurationType

  /** Names of a thing's properties whose values refer to other things. */
  connectionProperties: string[]

  /** The CSS class name for an icon that represents a thing. */
  icon: string

  /** Text that describes an icon that represents a thing. */
  iconDescription: string

  state: SheetState

  /** The thing whose title is displayed within this title bar. */
  thing: Thing

  /** Unique identifier for a title bar's text. */
  titleTextId: string

  /** Map of value names to values for the values to insert into the title format to form the title text. */
  titleTextValues: { [key: string]: string }
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
    state,
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
        <button
          className='sqwerl-property-sheet-title-bar-back-button'
          onClick={() => goBack(state.navigate, props)}
        >
          <ChevronLeft className='sqwerl-back-or-forward-icon' />
        </button>
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

const goBack = (navigate: NavigateFunction, props: Props) => {
  const { setAnimationState } = props.state

  navigate(-1)
  setAnimationState('slide-right')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

export default TitleBar
