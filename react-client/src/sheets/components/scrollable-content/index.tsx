import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

/**
 * Renders a property sheet's scrollable content beneath the property sheet's title bar.
 * @param props
 */
const ScrollableContent = (props: Props): React.JSX.Element => {
  const { children } = props
  return (
    <div className='sqwerl-properties-scrollable-content'>
      <div className='sqwerl-properties-read-only-form'>
        {children}
      </div>
    </div>
  )
}

export default ScrollableContent
