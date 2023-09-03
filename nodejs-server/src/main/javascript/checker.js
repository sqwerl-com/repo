/**
 * Tests the validity and integrity of a library of things. Run this script to check that libraries of things
 * are valid.
 */

/**
 * Loads this application's configuration information.
 */
const configuration = require('sqwerl-application-configuration')

/**
 * Logs messages.
 */
const logger = require('sqwerl-logger').newInstance('Checker')

/**
 * Tests the integrity of libraries of things.
 */
const tester = require('./tester')

if (process.argv.length > 2) {
  const configurationFile = process.argv[2]
  logger.info('checker', 'configuration file: \'' + configurationFile + '\'')
  tester.test(configuration.newInstanceFromFile(configurationFile))
} else {
  logger.error('', 'Usage: node checker <configuration file>')
  logger.error('         Where <configuration file> is a JSON file that specifies this application\'s configuration.')
}
