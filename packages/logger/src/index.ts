import { createLogger, format, transports } from 'winston'

format.colorize()

interface LoggerType {
  debug: (functionName: string, message: string) => void,
  error: (functionName: string, message: string) => void,
  info: (functionName: string, message: string) => void,
  warn: (functionName: string, message: string) => void
}

/**
 * Returns a shared log writer configured for use within an application.
 * @param contextName  Name of the class, module, or function that this logger is logging messages for.
 * @param level Level of log messages to report.
 * @constructor
 */
const Logger = (contextName: string, level: string): LoggerType => {
  const logger = createLogger({
    transports: [new transports.Console({ level })]
  })
  return {
    debug: (functionName: string, message: string): void => {
      _debug(logger, contextName, functionName, message)
    },
    error: (functionName: string, message: string): void => {
      _error(logger, contextName, functionName, message)
    },
    info: (functionName: string, message: string): void => {
      _info(logger, contextName, functionName, message)
    },
    warn: (functionName: string, message: string): void => {
      _warn(logger, contextName,  functionName, message)
    }
  }
}

/**
 * Logs a debug message. Debug-level messages should contain diagnostic information that developers would look at if
 * they were running an application within a debugger. Add debug-level log statements to an application to output
 * information that developers need to see to in order to debug problems when they can't run the application within
 * a debugger. In production environments, you would never enable debug-level logging unless someone is trying to
 * fix problems in production.
 * @param logger A shared log writer configured for use within an application.
 * @param contextName  Name of the class, module, or function that this logger is logging messages for.
 * @param functionName Name of the function where messages are being logged at.
 * @param message A text message to log.
 */
const _debug = (logger: LoggerType, contextName: string, functionName: string, message: string): void => {
  logger.debug(_prefix(contextName, functionName), message);
}

/**
 * Logs an error message. Error-level log messages describe problems that prevent an application from continuing to
 * function correctly.
 * Error log messages should include the following information:
 *  . Cause - an explanation of an error's cause, for example: lost network connection.
 *  . Current state and location - add data that can help explain the error's cause, add a stack trace or at least
 *    show when and where the error was detected.
 *  . Error code - each type of error should have a unique error code.
 *  . Remediation -- error messages should include information telling readers how to fix or mitigate errors.
 * All applications should log error messages. For client-server applications, consider having the client application
 * send diagnostic information to its server when the client logs an error-level message.
 * @param logger A shared log writer configured for use within an application.
 * @param contextName  Name of the class, module, or function that this logger is logging messages for.
 * @param functionName Name of the function where messages are being logged at.
 * @param message A text message to log.
 */
const _error = (logger: LoggerType, contextName: string, functionName: string, message: string): void => {
 logger.error(_prefix(contextName, functionName), message)
}

/**
 * Logs an information message. Information-level log messages show the status of your application when it is
 * functioning properly. Information messages should indicate that your application is functioning without
 * error. Think of information log messages as your application's normal heartbeat. If people are monitoring your
 * application--perhaps in some type of dashboard--your application's information messages should let them know that
 * application is working as expected.
 * @param logger A shared log writer configured for use within an application.
 * @param contextName  Name of the class, module, or function that this logger is logging messages for.
 * @param functionName Name of the function where messages are being logged at.
 * @param message A text message to log.
 */
const _info = (logger: LoggerType, contextName: string, functionName: string, message: string): void => {
  logger.info(_prefix(contextName, functionName), message)
}

/**
 * Logs a warning-level message. Warning level messages should indicate that something may be about to go
 * wrong, or some anticipated, but erroneous, condition may have occurred. Log warning messages to indicate
 * that something happened that may be handled, but might also be a cause for concern if things go wrong.
 * @param logger A shared log writer configured for use within an application.
 * @param contextName  Name of the class, module, or function that this logger is logging messages for.
 * @param functionName Name of the function where messages are being logged at.
 * @param message A text message to log.
 */
const _warn = (logger: LoggerType, contextName: string, functionName: string, message: string): void => {
  logger.warn(_prefix(contextName, functionName), message)
}

/**
 * Returns a prefix (header) for log messages that provides context for where a log message was generated at
 * @param contextName The name of a top-level class, module, or function that is logging messages
 * @param functionName The name of a function that is logging messages
 * @return A string that this logger prepends to all log messages it generates
 */
const _prefix = (contextName: string, functionName: string): string => {
  let heading = ''
  if (contextName) {
    heading += contextName
    if (functionName) {
      heading += `.${functionName}`
    }
    heading += ': '
  } else if (functionName) {
      heading += `${functionName}: `
  }
  return heading
}

export default Logger
