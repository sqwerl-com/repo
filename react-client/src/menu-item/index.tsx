import { FormattedMessage } from 'react-intl'
import Logger, { LoggerType } from 'logger'
import * as React from 'react'

let logger: LoggerType

interface Props {
  /** This menu item's child components. */
  children?: React.ReactNode

  /** Called to hide the menu that contains this menu item. */
  hideMenu: Function

  /** Called when the user clicks on this menu item. */
  onClick: Function

  /** Unique identifier for text to display as this menu item's subtitle. */
  subtitleId: string

  /** Unique identifier for the text to display as this menu item's title (label). */
  titleId: string
}

/**
 * Menu item user interface components. Menu items appear within menu user interface components. A menu presents a
 * user with a list of choices. When a menu appears, the user must pick one of the choices or dismiss the menu
 * without making a choice.
 * @param props
 */
const MenuItem = (props: Props): React.JSX.Element => {
  logger = Logger(MenuItem, MenuItem)
  const { children, subtitleId, titleId } = props
  return (
    <button
      className='sqwerl-menu-item'
      onClick={() => onClick(props, logger)}
      role='menuitem'
      tabIndex={0}
    >
      <div className='sqwerl-menu-item-title'>
        <FormattedMessage id={titleId} />
      </div>
      <div className='sqwerl-menu-item-subtitle'>
        <FormattedMessage id={subtitleId} />
      </div>
      {children}
    </button>
  )
}

/**
 * Hides the menu that contains a menu item.
 * @param props
 * @param logger
 */
const hideMenu = (props: Props, logger: LoggerType): void => {
  logger.setContext('hideMenu').info('Menu item is requesting to close its menu')
  const { hideMenu } = props
  hideMenu()
}

/**
 * Called when the user clicks on a menu item. Hides the menu that contains the menu item and calls the menu item's
 * click handler.
 * @param props
 * @param logger
 */
const onClick = (props: Props, logger: LoggerType): void => {
  const { onClick } = props
  logger.setContext('onClick').info('Menu item clicked on')
  hideMenu(props, logger)
  onClick(props, logger)
}

export default MenuItem
