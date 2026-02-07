import { FormattedMessage } from 'react-intl'
import LoggerFactory from '@/logger'
import * as React from 'react'

export interface Props {
  /** This menu item's child components. */
  children?: React.JSX.Element

  /** Called to hide the menu that contains this menu item. */
  hideMenu: () => void

  /** Called when the user clicks on this menu item. */
  onClick: (props: Props) => void

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
  const { children, subtitleId, titleId } = props

  return (
    <button
      className='sqwerl-menu-item'
      onClick={() => onClick(props)}
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
 */
const hideMenu = (props: Props): void => {
  const logger = loggerFactory.create('hideMenu')
  logger.info('Menu item is requesting to close its menu')
  const { hideMenu } = props
  hideMenu()
}

/**
 * Called when the user clicks on a menu item. Hides the menu that contains the menu item and calls the menu item's
 * click handler.
 * @param props
 */
const onClick = (props: Props): void => {
  const { onClick } = props
  const logger = loggerFactory.create('onClick')
  logger.info('Menu item clicked on')
  hideMenu(props)
  onClick(props)
}

const loggerFactory = LoggerFactory(MenuItem)

export default MenuItem
