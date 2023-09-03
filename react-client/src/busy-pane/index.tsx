import Logger, { LoggerType } from 'logger'
import * as React from 'react'

let logger: LoggerType

interface Props {
  children?: React.ReactNode

  /** Should this busy pane be visible? */
  isVisible: boolean

  /** This busy pane's name. */
  name: string
}

/**
 * A transparent pane user interface component that blocks input and notifies the user that the application is
 * busy.
 *
 * An application should make this busy pane visible as soon as a request or process that will take time to finish
 * starts. In this way, the user gets instant feedback (less than 0.5ms) that the application is responding to the
 * user's latest action.
 */
const BusyPane = (props: Props): React.JSX.Element => {
  logger = Logger(BusyPane, BusyPane)
  const { children, isVisible, name } = props
  logger.debug(`isVisible = ${isVisible.toString()}`)
  const isVisibleClassName = isVisible ? 'visible' : 'hidden'
  return (<div className={`sqwerl-busy-pane ${name} ${isVisibleClassName}`}>{children}</div>)
}

export default BusyPane
