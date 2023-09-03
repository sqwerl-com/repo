import ChildrenCount from 'sheets/components/children-count'
import { ConfigurationType } from 'configuration'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  configuration: ConfigurationType

  /** Number of children a type of thing has. */
  childrenCount: number

  /** The CSS class name for an icon that represents a thing. */
  icon: string

  /** Text that describes an icon that represents a thing. */
  iconDescription: string

  /** The thing whose title is displayed within this title bar. */
  thing: Object

  /** Unique identifier for format for a title bar's text. */
  titleTextId: string

  /** Map of value names to values for the values to insert into the title format to form the title text. */
  titleTextValues: Record<string, string>
}

/**
 * Renders a property sheet's title bar for a property sheet that describes a type of thing.
 * @param props
 */
const TypeTitleBar = (props: Props): React.JSX.Element => {
  const { childrenCount, icon, iconDescription, thing, titleTextId, titleTextValues } = props
  const intl = useIntl()
  const childrenText = <ChildrenCount count={childrenCount} thing={thing} />
  const formattedText =
    intl.formatMessage({ id: titleTextId }, { children: childrenText, ...titleTextValues })
  const text = formattedText ? formattedText.toString() : ''
  return (
    <header className='sqwerl-properties-title-bar'>
      {/* TODO - <button onClick={this.toggleNavigation} /> */}
      <div className='sqwerl-properties-title-bar-title'>
        {icon && (<img alt={iconDescription} className='sqwerl-properties-title-icon' src={icon} />)}
        {titleTextId &&
          <div
            className='sqwerl-properties-title-text'
            dangerouslySetInnerHTML={{ __html: text }}
          />}
      </div>
    </header>
  )
}

export default TypeTitleBar
