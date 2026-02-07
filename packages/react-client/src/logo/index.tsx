import { CurrentThemeContext } from '@/context/current-theme'
import { IntlShape, useIntl } from 'react-intl'
import { useContext, useState } from 'react'
import * as React from 'react'

export interface Props {
  /** Base (starting) path within the URL that points to the application that contains this logo. */
  basePath: string

  /** This logo's child components. */
  children?: React.ReactNode

  /** If false, then this logo shouldn't respond to users' actions. */
  isEnabled: boolean
}

/**
 * User interface component that displays a website's home navigation logo: the site's logo that the a user can click
 * on to go to the site's Home (initial) page.
 */
const Logo = (props: Props): React.JSX.Element => {
  const { children, isEnabled } = props
  const intl = useIntl()
  const themeName = useContext(CurrentThemeContext).valueOf()
  const [tooltipTimer, setTooltipTimer] = useState(0)

  return (
    <div
      className={`sqwerl-logo ${isEnabled ? '' : 'disabled'}`}
      onBlur={(event) => onBlur(event, tooltipTimer)}
      onFocus={(event) => onFocus(event, tooltipTimer, setTooltipTimer)}
      tabIndex={0}
    >
      {isEnabled && /* TODO - The URL www.sqwerl.com should not be hard-coded. */
        <a href='https://www.sqwerl.com' title={intl.formatMessage({ id: 'sqwerl-logo-tooltip' })}>
          {renderImage(intl, themeName, props)}
        </a>}
      {!isEnabled && renderImage(intl, themeName, props)}
      {children}
    </div>
  )
}

/**
 * Returns the text for an application's logo's alternative text.
 * @param intl Internationalization support.
 * @returns This logo's ARIA (Accessible Rich Internet Applications) text description.
 */
const altText = (intl: IntlShape): string => {
  return intl.formatMessage({ id: 'sqwerlLogo.altText' })
}

/**
 * Returns an application's logo's ARIA text.
 * @param intl Internationalization support.
 * @returns This logo's ARIA (Accessible Rich Internet Applications) text label.
 */
const ariaLabel = (intl: IntlShape): string => {
  return intl.formatMessage({ id: 'sqwerlLogo.ariaLabel' })
}

/**
 * Called when this logo loses the keyboard focus.
 * @param event The event that caused this function to be called.
 * @param tooltipTimer  ID for a previously set timer.
 */
const onBlur = (event: object, tooltipTimer: number): void => {
  if (tooltipTimer !== null) {
    clearTimeout(tooltipTimer)
  }
}

/**
 * Called when this logo gains the keyboard input focus.
 * @param event
 * @param tooltipTimer ID for a previously set timer.
 * @param setTooltipTimer
 */
const onFocus = (
  event: object,
  tooltipTimer: number,
  setTooltipTimer: (timeout: number) => void): void => {
  clearTimeout(tooltipTimer)
  setTooltipTimer(setTimeout(() => {
    console.log('Show tooltip')
  }, 300))
}

/**
 * Renders an application's logo.
 * @param intl  Internalization support.
 * @param themeName Identifier for the current user interface theme.
 * @param props
 */
const renderImage = (intl: IntlShape, themeName: string, props: Props): React.ReactNode => {
  const { basePath } = props
  const label = ariaLabel(intl)
  const text = altText(intl)
  /* TODO - We need to prefix the file name for the PNG to the path of the target environment's folder
     that contains the png file.
   */
  return (
    <img alt={text} aria-label={label} src={`${basePath}small-sqwerl-logo-${themeName}.png`} tabIndex={-1} />
  )
}

export default Logo
