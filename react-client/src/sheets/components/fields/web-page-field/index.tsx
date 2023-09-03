import { BasicThing } from 'utils/types'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  webPage: BasicThing
  state: SheetState
}

/**
 * Renders a read-only field that displays links to a web page.
 * @param props
 * @constructor
 */
const WebPageField = (props: Props): React.JSX.Element => {
  const { state, webPage } = props
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = webPage
  const intl = useIntl()
  return (
    <>
      <div className='sqwerl-properties-read-only-field'>
        <div className='sqwerl-properties-read-only-field-label'>
          {intl.formatMessage({
            id: 'webPage.label'
          })}
        </div>
        <div className='sqwerl-properties-read-only-field-value'>
          <span className='sqwerl-read-only-field-sub-item'>
            <Link
              className='sqwerl-hyperlink-underline-on-hover'
              to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
            >
              {name}
            </Link>
          </span>
        </div>
      </div>
    </>
  )
}

export default WebPageField
