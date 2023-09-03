import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { MouseEventHandler } from 'react'
import * as React from 'react'

interface Props {
  children?: React.JSX.Element
  className: string
  isEnabled: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  titleId: string
  tooltipTextId: string
}

/**
 * Menu button user interface components. Users click on a menu button within an application's menu bar in order to
 * view or hide one of an application's menus.
 */
const MenuButton = (props: Props): React.JSX.Element => {
  const { children, className, isEnabled, onClick, tooltipTextId, titleId } = props
  const intl: IntlShape = useIntl()
  return (
    <nav>
      <button
        className={`sqwerl-menu-button ${className} ${isEnabled ? '' : 'disabled'}`}
        role='menu'
        onClick={onClick}
        tabIndex={isEnabled ? 0 : -1}
        title={tooltipText(intl, tooltipTextId)}
      >
        <div className='sqwerl-menu-button-text'>{renderTitleText(titleId)}</div>
      </button>
      {children}
    </nav>
  )
}

const renderTitleText = (titleId: string): React.ReactNode => {
  return (<><FormattedMessage id={titleId} /></>)
}

/**
 * Returns localized tool tip text for the given unique tool tip identifier.
 * @param intl Internationalization/localization support.
 * @param tooltipTextId Unique identifier for a button's tool tip text.
 * @returns A button's tool tip text. Text to display within a tool tip to describe a button.
 */
const tooltipText = (intl: IntlShape, tooltipTextId: string): string => {
  return intl.formatMessage({ id: tooltipTextId })
}

export default MenuButton
