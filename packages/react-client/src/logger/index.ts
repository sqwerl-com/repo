/* globals process */

// Unicode characters to use as icons for different types of log messages.
const MESSAGE_ICONS = {
  debug: '\u2713',
  error: '\u274C',
  info: '\u24D8',
  warn: '\u26A0'
}

// Names for the types of log messages.
enum MessageType {
  debug = 'debug',
  error = 'error',
  info = 'info',
  warn = 'warn'
}

/**
 * Objects passed to this logger that we can derive a name for. This includes modules,
 * classes, and functions.
 */
export interface Named {
  name?: string,
  toString: () => string
}

/**
 * Type for additional context information, like a function name, that indicates where a log message was published.
 */
type ContextType = Named | string | undefined

/**
 * This logger factory's public interface.
 */
export interface LoggerFactoryType {
  create: (context: ContextType) => LoggerType,
  readonly _moduleName: string
}

/**
 * Message logger public interface.
 */
export interface LoggerType {
  assert: (condition: boolean, message: string) => LoggerType,
  debug: (message: string, context?: ContextType) => LoggerType,
  error: (message: string, context?: ContextType ) => LoggerType,
  info: (message: string, context?: ContextType) => LoggerType,
  warn: (message: string, context?: ContextType) => LoggerType,
  readonly _moduleName: string
}

/**
 * Returns a message logger factory. A message logger outputs messages by type (info, debug, error, or message)
 * prepended with information indicating where in an application's code a message was logged at.
 *
 * @param module Constructor function for a module or a component's render function. Used to provide
 *               the name for the module, class, or component to log messages for.
 * @constructor
 */
const LoggerFactory = (module: Named): LoggerFactoryType => {
  let isRunningInTest = false
  const moduleName = _buildContext(module)

  const factory: LoggerFactoryType = {
    create: (context: ContextType): LoggerType => {
      return _createLogger(factory, context)
    },

    _moduleName: moduleName
  }

  return factory
}

/**
 * Asserts that a given condition is true, otherwise report an error.
 * @param module The name of the module that the code that is making an assertion belongs to.
 * @param condition Evaluates to true or false.
 * @param assertionFailedMessage Text message to output when the given condition is false.
 * @param context The context, like the name of the function, where an assertion was made at.
 * @private
 */
const _assert = (module: string, condition: boolean, assertionFailedMessage: string, context?: ContextType) => {
  if (condition) {
    _log(MessageType.error, module, context, `Assertion failed: ${assertionFailedMessage}`)
  }
}

/**
 * Returns a string that indicates the location where a message was logged at.
 * @param context A function to call to get the context name or the name itself.
 * @private
 */
const _buildContext = (context: Named | string): string => {
  const name =
    context && {}.hasOwnProperty.call(context, 'name') ? (context as Named)['name'] : context.toString()
  return name || ''
}

/**
 * Creates and returns a new logger for a given local context, like for use within a function.
 * @param factory A logger factory.
 * @param context Additional contextual information like the name of function where logging occurs.
 * @return A new logger.
 * @constructor
 * @private
 */
const _createLogger = (factory: LoggerFactoryType, context: ContextType): LoggerType => {
  const logger: LoggerType = {
    assert: (condition: boolean, message: string): LoggerType => {
      _assert(factory._moduleName, condition, message, context)
      return logger
    },

    debug: (message: string): LoggerType => {
      _debug(factory._moduleName, message, context)
      return logger
    },

    error: (message: string): LoggerType => {
      _error(factory._moduleName, message, context)
      return logger
    },

    info: (message: string): LoggerType => {
      _info(factory._moduleName, message, context)
      return logger
    },

    warn: (message: string): LoggerType => {
      _warn(factory._moduleName, message, context)
      return logger
    },

    _moduleName: factory._moduleName
  }

  return logger
}

/**
 * Returns a string representation of a logging context that indicates where a log message was generated at.
 * @param context The context, like the name of the function, where a log message was generated at.
 */
const _contextToString = (context: ContextType | undefined): string | undefined => {
  if (context) {
    if (context.hasOwnProperty('name')) {
      return (context as Named).name
    }

    return context.toString()
  }

  return undefined
}

/**
 * Logs a debug message. Debug messages describe, at a low level, what an object is doing in a way that should be
 * useful when trying to debug issues. For example, debug messages should display input values and results, or
 * otherwise indicate what an object is doing.
 * @param module The name of the module that is logging a debug message.
 * @param message A text message that contains information that is useful when debugging an application.
 * @context The context, like the name of the function, where a debug log message was generated at.
 * @private
 */
const _debug = (module: string, message: string, context: ContextType) => {
  console.debug(_log(MessageType.debug, module, context, message), "color: blue")
}

/**
 * Logs an error message. Error messages describe problems that, when they occur, may prevent code from functioning
 * correctly. Use error log messages to indicate situations that must not be ignored.
 * @param module The name of the module that is logging an error message.
 * @param message A text message that describes an error.
 * @context The context, like the name of the function, where an error log message was generated at.
 * @private
 */
const _error = (module: string, message: string, context: ContextType) => {
  console.error(_log(MessageType.error, module, context, message), "color: red")
}

/**
 * Logs an information message. Information messages describe, at a high-level, what an object is doing. Information
 * messages should indicate that an object is functioning properly. Information messages that an application
 * generates are like a heartbeat monitor that shows that an application is functioning properly.
 * @param module The name of the module that is logging an information message.
 * @param message An informational text message.
 * @context The context, like the name of the function, where an informational log message was generated at.
 */
const _info = (module: string, message: string, context?: ContextType) => {
  console.info(_log(MessageType.info, module, context, message), 'color: green')
}

/**
 * Logs a warning message. Warning messages describe situations that occur that are not potentially abnormal but
 * are not unexpected. Warning messages indicate non-fatal situations that may be relevant to diagnose issues.
 * For example, a warning message might indicate that an expected file does not exist when there is a fallback
 * so that an application is able to continue without error despite the fact that the file wasn't found.
 * @param module The name of the module that is logging a warning message.
 * @param state  A logger's state information.
 * @param message A warning text message.
 * @context The context, like the name of the function, where a warning log message was generated at.
 */
const _warn = (module: string, message: string, context?: ContextType) => {
  console.warn(_log(MessageType.warn, module, context, message), 'color: yellow')
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
const _log = (messageType: MessageType, moduleName: string, context: Named | string | undefined, message: string): string => {
  let entry = `%c${MESSAGE_ICONS[messageType]} `;
  const hasModuleName = !!(moduleName && moduleName.length > 0)

  if (hasModuleName) {
    entry += moduleName
  }


  const contextName = _contextToString(context)

  if (contextName) {
    entry += entry.length === 0 ? contextName : `${hasModuleName ? '.' : ''}${contextName}`
  }

  if (message) {
    entry += entry.length === 0 ? message : `: ${message}`
  }

  return entry
}

export default LoggerFactory
