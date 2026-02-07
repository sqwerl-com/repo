import LoggerFactory from '@/logger'
import React from 'react'

export interface Props {
  isVisible: boolean
}

const SignInMenu = (props: Props): React.JSX.Element => {
  const { isVisible } = props
  const logger = loggerFactory.create(SignInMenu)

  logger.info('Rendering sign in menu')

  return (
    <div className='sqwerl-sign-in-menu-content'>
      {isVisible && <span>TODO</span>}
    </div>
  )
}

const loggerFactory = LoggerFactory(SignInMenu)

export default SignInMenu
