import { IntlShape, useIntl } from 'react-intl'
import { useState } from 'react'
import * as React from 'react'

interface Props {
  /** Base (starting) path within the URL that points to the application that contains this logo. */
  basePath: string

  /** This logo's child components. */
  children?: React.ReactNode

  /** If false, then this logo shouldn't respond to users' actions. */
  isEnabled: boolean
}

/**
 * User interface component that displays a website's home navigation logo: the site's logo the a user can click on
 * at any time to go back to the site's Home (initial) page.
 */
const Logo = (props: Props): React.JSX.Element => {
  const { children, isEnabled } = props
  const intl = useIntl()
  const [tooltipTimer, setTooltipTimer] = useState(null)
  return (
    <div
      className={`sqwerl-logo ${isEnabled ? '' : 'disabled'}`}
      onBlur={(event) => onBlur(event, tooltipTimer)}
      onFocus={(event) => onFocus(event, tooltipTimer, setTooltipTimer)}
      role='banner'
      tabIndex={0}
    >
      {isEnabled && /* TODO - The URL www.sqwerl.com should not be hard-coded. */
        <a href='https://www.sqwerl.com' title={intl.formatMessage({ id: 'sqwerl-logo-tooltip' })}>
          {renderImage(intl, props)}
        </a>}
      {!isEnabled && renderImage(intl, props)}
      {children}
    </div>
  )
}

/**
 * Returns the text for an application's logo's alternative text.
 * @param intl Internationalization support.
 * @param props
 * @returns This logo's ARIA (Accessible Rich Internet Applications) text description.
 */
const altText = (intl: IntlShape, props: Props): string => {
  return intl.formatMessage({ id: 'sqwerlLogo.altText' })
}

/**
 * Returns an application's logo's ARIA text.
 * @param intl Internationalization support.
 * @param props
 * @returns This logo's ARIA (Accessible Rich Internet Applications) text label.
 */
const ariaLabel = (intl: IntlShape, props: Props): string => {
  return intl.formatMessage({ id: 'sqwerlLogo.ariaLabel' })
}

/**
 * Called when the this logo loses the keyboard focus.
 * @param event The event that caused this function to be called.
 * @param tooltipTimer  ID for a previously set timer.
 */
const onBlur = (event: Object, tooltipTimer: number | null): void => {
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
const onFocus = (event: Object, tooltipTimer: number | null, setTooltipTimer: Function): void => {
  if (tooltipTimer !== null) {
    clearTimeout(tooltipTimer)
  }
  setTooltipTimer(setTimeout(() => {
    console.log('Show tooltip')
  }, 300))
}

/**
 * Renders an application's logo.
 * @param {IntlShape} intl  Internalization support.
 * @param {Props} props
 */
const renderImage = (intl: IntlShape, props: Props): React.ReactNode => {
  const { basePath } = props
  const label = ariaLabel(intl, props)
  const text = altText(intl, props)
  /* TODO - We need to prefix the file name for the PNG to the path of the target environment's folder
     that contains the png file.
   */
  return (
    <img alt={text} aria-label={label} src={`${basePath}small-sqwerl-logo.png`} tabIndex={-1} />
  )
}

export default Logo
