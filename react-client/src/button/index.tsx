/* globals HTMLButtonElement */

import { IntlShape, useIntl } from 'react-intl'
import React, { MouseEventHandler } from 'react'

interface Props {
  /** Unique identifier for this button's Accessible Rich Internet Application (ARIA) label. */
  ariaLabelId: string

  children?: React.ReactNode

  /** Names for a buttons' CSS classes. */
  className: string

  /** Unique identifier for a button's icon. */
  iconId: string

  /** Called when the user clicks on a button. */
  onClick: MouseEventHandler<HTMLButtonElement>

  /** A function that renders a button's icon. */
  renderIcon: Function

  /** The name for a button's Accessible Rich Internet Application (ARIA) role. */
  role: string

  /** Unique identifier for a button's tool tip text. Unique identifier for the text to display in a tooltip
      when the user hovers over a button. */
  tooltipTextId: string

  /** Unique identifier for a button's text. */
  titleId: string
}

/**
 * Button user interface components that support internationalization and localization.
 * @param props
 */
const Button = (props: Props): React.JSX.Element => {
  const {
    ariaLabelId, children, className, iconId, onClick, renderIcon, role, tooltipTextId, titleId
  } = props
  const intl = useIntl()
  const localizedText = (intl: IntlShape, id: string): string => {
    return intl.formatMessage({ id })
  }
  return (
    <button
      aria-label={ariaLabelId !== '' ? localizedText(intl, ariaLabelId) : ''}
      className={`sqwerl-button ${className}`}
      onClick={onClick}
      role={role !== '' ? 'button' : ''}
      title={tooltipTextId !== '' ? localizedText(intl, tooltipTextId) : ''}
    >
      {(iconId !== '') &&
        <span
          className='sqwerl-button-icon'
          dangerouslySetInnerHTML={{ __html: localizedText(intl, iconId) }}
        />}
      <div className='sqwerl-button-text-and-icon'>
        {typeof renderIcon === 'function' && renderIcon()}
        {(titleId !== '') &&
          <span
            className='sqwerl-button-text'
            dangerouslySetInnerHTML={{ __html: localizedText(intl, titleId) }}
          />}
      </div>
      {children}
    </button>
  )
}

export default Button
