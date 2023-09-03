interface State {
  context: string
  isTesting: boolean
  moduleContext: Object | string
}

export interface LoggerType {
  assert: Function
  debug: Function
  error: Function
  info: Function
  setContext: Function
  warn: Function
  _context: () => string
  _isTesting: () => boolean
}

/**
 * Returns a message logger. A message logger outputs messages to the console by type (info, debug, error, or message)
 * prepended with information indicating where a message was logged at.
 *
 * @param module Constructor for a module or component.
 * @param functionName Function within a module or component.
 * @param isTesting Is the application running this logger being unit tested?
 */
const Logger = (module: Function, functionName: Function, isTesting?: boolean): LoggerType => {
  if (isTesting === undefined) {
    isTesting = !(process.env && (process.env.NODE_ENV === 'test'))
  }
  const context = buildContext(functionName || module)
  const state = {
    context,
    isTesting,
    moduleContext: buildContext(module)
  }
  const logger: LoggerType = {
    assert: (condition: boolean, assertionFailedMessage: string): LoggerType => {
      assert(state, condition, assertionFailedMessage)
      return logger
    },
    debug: (message: string): LoggerType => {
      debug(state, message)
      return logger
    },
    error: (message: string): LoggerType => {
      error(state, message)
      return logger
    },
    info: (message: string): LoggerType => {
      info(state, message)
      return logger
    },
    setContext: (context: Function): LoggerType => {
      state.context = buildContext(context)
      return logger
    },
    warn: (message: string): LoggerType => {
      warn(state, message)
      return logger
    },
    _context: () => state.context,
    _isTesting: () => state.isTesting
  }
  return logger
}

/**
 * Assert that a given condition is true, otherwise report an error.
 * @param state  A logger's state information.
 * @param condition Evaluates to true or false.
 * @param assertionFailedMessage Text message to output when the given condition is false.
 */
const assert = (state: State, condition: boolean, assertionFailedMessage: string) => {
  const { context, isTesting, moduleContext } = state
  if (!isTesting) {
    if (condition) {
      log('error', moduleContext.toString(), context, `Assertion failed: ${assertionFailedMessage}`)
    }
  }
}

const buildContext = (context: any): string => {
  return context && {}.hasOwnProperty.call(context, 'name') ? context.name : context.toString()
}

/**
 * Logs a debug message. Debug messages describe, at a low level, what an object is doing in a way that should be
 * useful when trying to debug issues. For example, debug messages should display input values and results, or
 * otherwise indicate what an object is doing.
 * @param state  A logger's state information.
 * @param message A text message that contains information that is useful when debugging an application.
 */
const debug = (state: State, message: string) => {
  const { context, isTesting, moduleContext } = state
  if (!isTesting) {
    console.debug(log('debug', moduleContext.toString(), context, message))
  }
}

/**
 * Logs an error message. Error messages describe problems that, when they occur, may prevent code from functioning
 * correctly. Use error log messages to indicate situations that must not be ignored.
 * @param state  A logger's state information.
 * @param message A text message that describes an error.
 */
const error = (state: State, message: string) => {
  const { context, isTesting, moduleContext } = state
  if (!isTesting) {
    console.error(log('error', moduleContext.toString(), context, message))
  }
}

/**
 * Logs an information message. Information messages describe, at a high-level, what an object is doing. Information
 * messages should indicate that an object is functioning properly. Information messages that an application
 * generates are like a heartbeat monitor that shows that an application is functioning properly.
 * @param state  A logger's state information.
 * @param message An informational text message.
 */
const info = (state: State, message: string) => {
  const { context, isTesting, moduleContext } = state
  if (!isTesting) {
    console.info(log('info', moduleContext.toString(), context, message))
  }
}

/**
 * Creates, and returns, a log entry.
 * @private
 * @param messageType The type of message to log (for example: info, debug, warn, or error).
 * @param moduleName The name of the module that the code that is creating a log message belongs to.
 * @param context Text that describes where, in code, a log message is being generated at.
 * @param message A message to log.
 * @returns A text message to place into a message log.
 */
const log = (messageType: string, moduleName: string, context: string, message: string): string => {
  let entry = `${messageType} `
  const hasModuleName = !!(moduleName && moduleName.length > 0)
  if (hasModuleName) {
    entry += moduleName
  }
  if (context) {
    entry += entry.length === 0 ? context : `${hasModuleName ? '.' : ''}${context}`
  }
  if (message) {
    entry += entry.length === 0 ? message : `: ${message}`
  }
  return entry
}

/**
 * Logs a warning message. Warning messages describe situations that occur that are not potentially abnormal but
 * are not unexpected. Warning messages indicate non-fatal situations that may be relevant to diagnose issues.
 * For example, a warning message might indicate that an expected file does not exist when there is a fallback
 * so that an application is able to continue without error despite the fact that the file wasn't found.
 * @param state  A logger's state information.
 * @param message A warning text message.
 */
const warn = (state: State, message: string) => {
  const { context, isTesting, moduleContext } = state
  if (!isTesting) {
    console.warn(log('warn', moduleContext.toString(), context, message))
  }
}

export default Logger
