/**
 * NodeJS script that encrypts a user's password.
 */

const bcrypt = require('bcrypt')

const logger = require('sqwerl-logger').newInstance('EncryptCredentials')

const moduleName = 'encrypt_credentials'

if (process.argv.length > 2) {
  const saltRounds = 13
  bcrypt.hash(process.argv[2], saltRounds, (error, hash) => {
    if (error) {
      logger.debug(moduleName, 'error: ' + error)
    } else {
      console.log(moduleName, `password = "${hash}"`)
    }
  })
} else {
  logger.error(moduleName, 'Usage: node encrypt_credentials.js <password>');
  logger.error(moduleName, '          Where <password> is the user\'s password.');
}
