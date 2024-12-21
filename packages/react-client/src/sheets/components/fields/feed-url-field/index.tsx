import { CheckSquare, Copy } from 'react-feather'
import Logger, { LoggerType } from '@/logger'
import React from 'react'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { SheetState } from '@/properties'
import { useIntl } from 'react-intl'
import { useState } from 'react'

interface Props {
  labelId: string,
  state: SheetState
  url: string
}

/**
 * Renders a read-only field whose value is an RSS feed's URL.
 * @param props
 * @constructor
 */
const FeedUrlField = (props: Props): React.JSX.Element => {
  const logger= Logger(FeedUrlField, FeedUrlField)
  const intl = useIntl()
  const { labelId, url} = props
  const [error, setError] = useState(false)
  const [wasClicked, setWasClicked] = useState(false)

  return (
    <>
      <div className='sqwerl-properties-read-only-field'>
        <details>
          <ReadOnlyFieldLabel labelText={intl.formatMessage({ id: labelId })} />
          <div className='sqwerl-read-only-field-sub-item'>
            <span className='sqwerl-properties-read-only-field-value sqwerl-overflow-wrap-anywhere'>{url}</span>
              {error && renderError(setError, setWasClicked)}
              {wasClicked && renderCopiedToClipboard(setWasClicked)}
              {!error && !wasClicked && renderCopyToClipboard(logger, setError, setWasClicked, url)}
          </div>
        </details>
      </div>
    </>
  )
}

/**
 * Copies the given text to the cut-and-paste clipboard.
 * @param logger    A logger
 * @param text      The text to put in the clipboard.
 * @param setError  Call with true to indicate an error has occurred while copying to the clipboard.
 */
const copyToClipboard = (logger: LoggerType, text: string, setError: (error: boolean) => void): Promise<void> => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }

  const errorMessage =
    `Failed to copy the feed url "${text}" to the clipboard.\n` +
    'Perhaps due to an older browser that doesn\'t provide clipboard access.'
  logger.error(errorMessage)

  return new Promise((resolve, reject) => {
    setError(true)
    reject();
  });
}

const renderCopiedToClipboard = (setWasClicked: (wasClicked: boolean) => void) => {
  setInterval(() => setWasClicked(false), 5000)

  return (
    <div className='sqwerl-cut-and-paste-status'>
      <CheckSquare/><span className='sqwerl-cut-and-paste-label'>Copied to clipboard</span>
    </div>
  )
}

const renderCopyToClipboard = (
  logger: LoggerType,
  setError: (error: boolean) => void,
  setWasClicked: (wasClicked: boolean) => void,
  url: string) => {
  return (
    <button className='sqwerl-cut-and-paste' onClick={() => {
      setWasClicked(true)
      copyToClipboard(logger, url, setError)
      .then(() => {
        const timeout = setTimeout(() => {
          setWasClicked(false)
          clearTimeout(timeout)
        }, 2000)
      })
      .catch(() => {
        setError(true)
        const timeout = setTimeout(() => {
          setError(false)
          clearTimeout(timeout)
        }, 3000)
      })
    }}
    >
      <Copy/><span className='sqwerl-cut-and-paste-label'>Copy to clipboard</span>
    </button>
  )
}

const renderError = (setError: (error: boolean) => void, setWasClicked: (wasClicked: boolean) => void) => {
  setTimeout(() => {
    setError(false)
    setWasClicked(false)
  }, 5000)

  return (<span className='sqwerl-cut-and-paste-label'>Copy to clipboard failed</span>)
}

export default FeedUrlField
