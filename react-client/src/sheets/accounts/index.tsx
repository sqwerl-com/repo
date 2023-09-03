import Logger, { LoggerType } from 'logger'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetProps } from 'properties'
import * as React from 'react'

let logger: LoggerType

/**
 * Renders a read-only form that displays a user account.
 * @param props
 * @constructor
 */
const AccountsSheet: React.FC<SheetProps> = (props: SheetProps): React.JSX.Element => {
  logger = Logger(AccountsSheet, AccountsSheet)
  logger.info('Rendering Accounts property sheet')
  const { thing } = props.state
  return (
    <>
      <header className='sqwerl-properties-title-bar'>
        {/* TODO - <button onClick={this.toggleNavigation} /> */}
        <div className='sqwerl-title-bar-title'>{(thing != null) ? thing.name : ''}</div>
        <div className='sqwerl-title-bar-type'>is an account</div>
        <span className='sqwerl-title-bar-links' />
        <span className='sqwerl-title-bar-right' />
      </header>
      {/* TODO - Implement account property sheet. */}
      <ScrollableContent>Account property sheet</ScrollableContent>
    </>
  )
}

export default AccountsSheet
