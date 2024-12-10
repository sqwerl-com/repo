"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
winston_1.format.colorize();
/**
 * Returns a shared log writer configured for use within an application.
 * @param contextName  Name of the class, module, or function that this logger is logging messages for.
 * @param level Level of log messages to report.
 * @constructor
 */
var Logger = function (contextName, level) {
    var logger = (0, winston_1.createLogger)({
        transports: [new winston_1.transports.Console({ level: level })]
    });
    return {
        debug: function (functionName, message) {
            _debug(logger, contextName, functionName, message);
        },
        error: function (functionName, message) {
            _error(logger, contextName, functionName, message);
        },
        info: function (functionName, message) {
            _info(logger, contextName, functionName, message);
        },
        warn: function (functionName, message) {
            _warn(logger, contextName, functionName, message);
        }
    };
};
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
var _debug = function (logger, contextName, functionName, message) {
    logger.debug(_prefix(contextName, functionName), message);
};
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
var _error = function (logger, contextName, functionName, message) {
    logger.error(_prefix(contextName, functionName), message);
};
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
var _info = function (logger, contextName, functionName, message) {
    logger.info(_prefix(contextName, functionName), message);
};
/**
 * Logs a warning-level message. Warning level messages should indicate that something may be about to go
 * wrong, or some anticipated, but erroneous, condition may have occurred. Log warning messages to indicate
 * that something happened that may be handled, but might also be a cause for concern if things go wrong.
 * @param logger A shared log writer configured for use within an application.
 * @param contextName  Name of the class, module, or function that this logger is logging messages for.
 * @param functionName Name of the function where messages are being logged at.
 * @param message A text message to log.
 */
var _warn = function (logger, contextName, functionName, message) {
    logger.warn(_prefix(contextName, functionName), message);
};
/**
 * Returns a prefix (header) for log messages that provides context for where a log message was generated at
 * @param contextName The name of a top-level class, module, or function that is logging messages
 * @param functionName The name of a function that is logging messages
 * @return A string that this logger prepends to all log messages it generates
 */
var _prefix = function (contextName, functionName) {
    var heading = '';
    if (contextName) {
        heading += contextName;
        if (functionName) {
            heading += ".".concat(functionName);
        }
        heading += ': ';
    }
    else if (functionName) {
        heading += "".concat(functionName, ": ");
    }
    return heading;
};
exports.default = Logger;
//# sourceMappingURL=index.js.map