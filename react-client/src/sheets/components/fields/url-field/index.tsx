import { SheetState } from 'properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  labelId: string,
  state: SheetState
  url: string
}

/**
 * Renders a read-only field whose value is a hyperlink (Uniform Resource Locator).
 * @param props
 * @constructor
 */
const UrlField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { labelId, url } = props
  return (
    <>
      <div className='sqwerl-properties-read-only-field'>
        <div className='sqwerl-properties-read-only-field-label'>
          {intl.formatMessage({ id: labelId })}
        </div>
        <div className='sqwerl-properties-read-only-field-value'>
          <span className='sqwerl-read-only-field-sub-item'>
            <a className='sqwerl-hyperlink-underline-on-hover' href={url}>{url}</a>
            <a className='sqwerl-hyperlink-icon' href={url} target='_blank'>
              <svg
                className='icon'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth="2"
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </>
  )
}

export default UrlField
