import Logger, { LoggerType } from '@/logger'
import type { SheetProps, SheetState } from '@/properties'
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
  const { isContributorSignedIn } = props.state
  const intl = useIntl()
  logger.info('Render Home property sheet')
  return isContributorSignedIn ? renderSignedInContributorsHome(/* TODO props */) : renderGuestHome(props, intl)
}

/**
 * Renders a greeting to a guest contributor (contributor who hasn't signed in).
 * @param _props
 * @param intl Internationalization support.
 */
const renderGuestHome = (_props: Props, intl: IntlShape): React.JSX.Element => {
  /* TODO - Use these, or delete them. Originally, the home sheet for guest contributors had a link for creating an account.
  const createAccountLinkText = intl.formatMessage({ id: 'homeSheet.createAccountLinkText' })
  const createAccountLinkTooltipText = intl.formatMessage({ id: 'createAccountMenu.tooltipText' })
  const createAccountLink =
    '<a class=\'sqwerl-home-view-create-account-link sqwerl-hyperlink inline\' href=\'#\'' +
    ` title='${createAccountLinkTooltipText}'>${createAccountLinkText}</a>`
  */
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
        Sqwerl allows you to manage and share the things that make you smart. Things like:
      </div>

      <ul className='sqwerl-home-sheet-list'>
        <li className='sqwerl-home-sheet-list-item'>Books</li>
        <li className='sqwerl-home-sheet-list-item'>Notes</li>
        <li className='sqwerl-home-sheet-list-item'>Web pages</li>
        <li className='sqwerl-home-sheet-list-item'>Feeds</li>
        <li className='sqwerl-home-sheet-list-item'>Videos</li>
        <li className='sqwerl-home-sheet-list-item'>Documents</li>
        <li className='sqwerl-home-sheet-list-item'>and more</li>
      </ul>

      <div className='sqwerl-property-sheet-text'>
        Sqwerl lets you collect things within repositories that you can share with others.
      </div>

      <div className='sqwerl-property-sheet-text'>
        To the left, there is a list of repositories you can visit.
      </div>

      <div className='sqwerl-property-sheet-text'>
        {/* TODO - Internationalize */}
        Go ahead, select a repository to view its things,
      </div>
    </>
  )
}

const renderSignedInContributorsHome = (/* TODO props: Props */): React.JSX.Element => {
  // TODO - Implement
  return (
    <div>Welcome back signed-in contributor</div>
  )
}

export default HomeSheet
