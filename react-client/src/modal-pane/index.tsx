/* global HTMLElement */

import Logger, { LoggerType } from 'logger'
import { JSX, ReactNode } from 'react'

let logger: LoggerType

interface Props {
  children?: ReactNode

  /** If true, then indicate to users that clicking on this modal pane performs an action. */
  isClickable: boolean

  /** Should this modal pane be visible? */
  isVisible: boolean

  /** This modal pane's name. */
  name: string

  /** Function called when the user clicks on this modal pane. */
  onClick: Function
}

/**
 * A transparent pane user interface component that fills an entire application as a backdrop to a modal component
 * like a drop-down menu or modal dialog.
 * @param props
 */
const ModalPane = (props: Props): JSX.Element => {
  logger = Logger(ModalPane, ModalPane)
  const { children, isClickable, isVisible, name, onClick } = props
  const onClickCallback =
    (typeof onClick === 'function')
      ? onClick
      : () => {
          logger.warn(
            name === ''
              ? `The modal pane named "${name}" is missing an onClick function`
              : 'A modal pane is missing an onClick function')
        }
  const isClickableClassName = isClickable ? 'is-clickable' : ''
  const isVisibleClassName = isVisible ? 'visible' : 'hidden'
  return (
    <div
      className={`sqwerl-modal-pane ${name} ${isClickableClassName} ${isVisibleClassName}`}
      onClick={event => {
        event.preventDefault()
        logger.debug('Modal pane clicked')
        onClickCallback(event)
      }}
    >
      {children}
    </div>
  )
}

export default ModalPane
