import { CheckSquare, Copy } from 'react-feather'
import LoggerFactory from '@/logger'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import React, { useState } from 'react'
import { SheetState } from '@/properties'
import { useIntl } from 'react-intl'

export interface Props {
  descriptionId: string,
  labelId: string,
  state: SheetState
  url: string
}

/**
 * Renders a read-only field whose value is the URL for an RSS feed that people can subscribe to.
 * @param props
 */
const SubscriptionUrlField = (props: Props): React.JSX.Element => {
  const { descriptionId, labelId, url } = props
  const [error, setError] = useState(false)
  const intl = useIntl()
  const [wasClicked, setWasClicked] = useState(false)

  return (
    <div className='sqwerl-properties-read-only-field'>
      <details>
        <ReadOnlyFieldLabel
          description={intl.formatMessage({ id: descriptionId })}
          labelText={intl.formatMessage({ id: labelId })}
        />
        <div className='sqwerl-read-only-field-sub-item'>
          <span className='sqwerl-properties-read-only-field-value sqwerl-overflow-wrap-anywhere'>{url}</span>
            {error && renderError(setError, setWasClicked)}
            {wasClicked && renderCopiedToClipboard(setWasClicked)}
            {!error && !wasClicked && renderCopyToClipboard(setError, setWasClicked, url)}
        </div>
      </details>
    </div>
  )
}

/**
 * Copies the given text to the cut-and-paste clipboard.
 * @param text      The text to put in the clipboard.
 * @param setError  Call with true to indicate an error has occurred while copying to the clipboard.
 */
const copyToClipboard = (text: string, setError: (error: boolean) => void): Promise<void> => {
  const logger = loggerFactory.create(copyToClipboard)

  if (navigator?.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }

  const errorMessage =
    `Failed to copy the subscription url "${text}" to the clipboard.\n` +
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
  setError: (error: boolean) => void,
  setWasClicked: (wasClicked: boolean) => void,
  url: string) => {

  return (
    <button className='sqwerl-cut-and-paste' onClick={() => {
      setWasClicked(true)
      copyToClipboard( url, setError)
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
      <Copy /><span className='sqwerl-cut-and-paste-label'>Copy to clipboard</span>
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

const loggerFactory = LoggerFactory(SubscriptionUrlField)

export default SubscriptionUrlField
