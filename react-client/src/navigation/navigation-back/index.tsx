import { ChevronLeft } from 'react-feather'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from 'logger'
import * as React from 'react'

let logger: LoggerType

interface Props {
  /** Path that consists of names of things to traverse to go back to a previously visited thing. */
  goBackUrl: string

  /** Call to go back to a previously visited thing. */
  popPath: Function

  /** Sets the CSS class name used to animate navigation items. */
  setAnimationClassName: Function

  setSelectedItemId: Function

  /** Shows a thing's properties. */
  showProperties: Function

  /** The text that this back button displays. */
  title: string
}

/**
 * Hyperlink back to the previous thing that the user last navigated to.
 * @param props
 */
const NavigationBack = (props: Props): React.JSX.Element => {
  logger = Logger(NavigationBack, NavigationBack)
  const { goBackUrl, setAnimationClassName, setSelectedItemId, title } = props
  const intl = useIntl()
  return (
    <>
      <Link
        className='sqwerl-navigation-back-text'
        onClick={() => {
          logger.debug(`User requested to go back to "${goBackUrl ? goBackUrl.toString() : ''}"`)
          setAnimationClassName('slide-right')
          const hashIndex = goBackUrl.indexOf('#')
          if ((hashIndex > 1) && (hashIndex < (goBackUrl.length - 2))) {
            setSelectedItemId(goBackUrl.slice(hashIndex + 1))
          }
        }}
        to={goBackUrl}
      >
        <ChevronLeft className='sqwerl-navigation-back-icon' />
        <span className='sqwerl-navigation-back-label'>{title || defaultText(intl)}</span>
      </Link>
    </>
  )
}

/**
 * Returns default text for a Navigation Go Back button.
 * @param intl  Internationalization support.
 * @returns Localized text for a navigation browser's Back button.
 */
const defaultText = (intl: IntlShape) => {
  return intl.formatMessage({ id: 'navigationBack.defaultText' })
}

export default NavigationBack
