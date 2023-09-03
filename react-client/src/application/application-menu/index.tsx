import * as React from 'react'

interface Props {
  /** This menu's child components. */
  children?: React.ReactNode

  /** Is this menu visible? */
  isVisible: boolean

  /** This menu's name. */
  name: string
}

/**
 * An application's top-level menu.
 * @param props
 */
const ApplicationMenu = (props: Props): React.JSX.Element => {
  const { children, isVisible, name } = props
  return (
    <nav
      className={`sqwerl-application-menu ${name} ${isVisible ? 'visible' : 'hidden'}`}
      role='menu'
      tabIndex={-1}
    >
      <div className='sqwerl-application-menu-background'>
        <div className='sqwerl-application-menu-top-left' />
        <div className='sqwerl-application-menu-top' />
        <div className='sqwerl-application-menu-top-right' />
        <div className='sqwerl-application-menu-left' />
        <div className='sqwerl-application-menu-middle' />
        <div className='sqwerl-application-menu-right' />
        <div className='sqwerl-application-menu-bottom-left' />
        <div className='sqwerl-application-menu-bottom-right' />
      </div>
      <div className='sqwerl-application-menu-content'>{children}</div>
    </nav>
  )
}

export default ApplicationMenu
