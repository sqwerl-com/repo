import Logger, { LoggerType } from 'logger'
import type { SheetProps, SheetState } from 'properties'
import { IntlShape, useIntl } from 'react-intl'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information that describes this application.
 * @param props
 * @constructor
 */
const HomeSheet: React.FC<SheetProps> = (props: SheetProps): React.JSX.Element => {
  logger = Logger(HomeSheet, HomeSheet)
  const { isUserSignedIn } = props.state
  const intl = useIntl()
  logger.info('Render Home property sheet')
  return isUserSignedIn ? renderSignedInUsersHome(/* TODO props */) : renderGuestHome(props, intl)
}

/**
 * Renders a greeting to a guest user (user who hasn't signed in).
 * @param props
 * @param intl Internationalization support.
 */
const renderGuestHome = (props: Props, intl: IntlShape): JSX.Element => {
  const createAccountLinkText = intl.formatMessage({ id: 'homeSheet.createAccountLinkText' })
  const createAccountLinkTooltipText = intl.formatMessage({ id: 'createAccountMenu.tooltipText' })
  const createAccountLink =
    '<a class=\'sqwerl-home-view-create-account-link sqwerl-hyperlink inline\' href=\'#\'' +
    ` title='${createAccountLinkTooltipText}'>${createAccountLinkText}</a>`
  const youText = intl.formatMessage({ id: 'homeSheet.you' })
  return (
    <>
      <div
        className='sqwerl-property-sheet-title-text'
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
            id: 'homeSheet.guestWelcome'
          }, {
            you: youText
          })
        }}
      />

      <div className='sqwerl-property-sheet-text'>
        Sqwerl allows you to store, manage, and share the things that make you smart. Things like:
      </div>

      <ul className='sqwerl-home-sheet-list'>
        <li className='sqwerl-home-sheet-list-item'>Books</li>
        <li className='sqwerl-home-sheet-list-item'>Notes</li>
        <li className='sqwerl-home-sheet-list-item'>Web pages</li>
        <li className='sqwerl-home-sheet-list-item'>Feeds</li>
        <li className='sqwerl-home-sheet-list-item'>Videos</li>
        <li className='sqwerl-home-sheet-list-item'>Documents</li>
      </ul>

      <div className='sqwerl-property-sheet-text'>
        and more.
      </div>

      <div className='sqwerl-property-sheet-text'>
        Sqwerl lets you collect things into libraries that you can share.
      </div>

      <div className='sqwerl-property-sheet-text'>
        On the left, there is a list of libraries you can visit.
      </div>

      <div className='sqwerl-property-sheet-text'>
        Select a library to see the things it contains.
      </div>
    </>
  )
}

const renderSignedInUsersHome = (/* TODO props: Props */): JSX.Element => {
  // TODO - Implement
  return (
    <div>Welcome back signed-in user</div>
  )
}

export default HomeSheet
