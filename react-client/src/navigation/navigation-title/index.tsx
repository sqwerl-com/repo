import { Home } from 'react-feather'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  /** Are we currently navigating from the Home (initial) navigation location? */
  isHome: boolean

  /** Number of items at the current level of a hierarchy. */
  itemCount: number

  /** Text to indicate where the user is currently navigating from. */
  title: string
}

/**
 * Displays the title text for a hierarchical navigator. Tells users their current location within a hierarchy.
 */
const NavigationTitle = (props: Props): React.JSX.Element => {
  const { isHome, itemCount, title } = props
  const intl = useIntl()
  const numberOfItems =
    intl.formatMessage({ id: 'navigationTitleBarText.count' }, { itemCount: isNaN(itemCount) ? '' : itemCount })
  return (
    <div className='sqwerl-navigation-title' role='columnheader'>
      {isHome &&
        <>
          <Home className='sqwerl-navigation-title-home-icon' />
          <span className='sqwerl-navigation-title-text'>{title || ''}</span>
          <span className='sqwerl-navigation-title-item-count'>
            <span className='sqwerl-read-only-field-label-count'>{!isNaN(itemCount) ? itemCount : ''}</span>
          </span>
        </>}
      {!isHome &&
        <>
          <span className='sqwerl-navigation-title-text'>{title || ''}</span>
          <span className='sqwerl-navigation-title-item-count'>
            <span className='sqwerl-read-only-field-label-count'>{numberOfItems}</span>
          </span>
        </>}
    </div>
  )
}

export default NavigationTitle
