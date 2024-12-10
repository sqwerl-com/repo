import Logger from '@/logger'
import * as React from 'react'

interface Props {
  isVisible: boolean
}

const SignInMenu = (props: Props): React.JSX.Element => {
  const logger = Logger(SignInMenu, SignInMenu)
  logger.info('Rendering sign in menu')
  const { isVisible } = props
  return (
    <div className='sqwerl-sign-in-menu-content'>
      {isVisible && <span>TODO</span>}
    </div>
  )
}

export default SignInMenu
