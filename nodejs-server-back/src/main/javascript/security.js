/**
 * Authenticates users.
 */

const bcrypt = require('bcryptjs')

/**
 * The guest account's unique identifier. Unless a user has authenticated his or her identity, we treat the user
 * as being this guest user with all the rights granted to the guest user account.
 * @type {string}
 */
const guestUserId = '/types/users/guest'

/**
 * The guest account's unique identifier.
 * @type {String}
 */
const guestUserName = 'guest@sqwerl.org'

const logger = require('sqwerl-logger').newInstance('Security')

/**
 * Authenticates a user's ability to interact with a Sqwerl server.
 * @param router                Web service request router (handler).
 * @param {string} email        User's email address.
 * @param {string} password     User's password.
 * @param {Library} catalog     Catalog library that contains user accounts.
 * @param {function} onSuccess  Function invoked if the user with the given name and password is allowed to interact
 *                              with a Sqwerl server.
 * @param {function} onFailure  Function invoked if the user with the given name and password is not allowed to
 *                              interact with a Sqwerl server.
 */
function authenticate (router, email, password, catalog, onSuccess, onFailure) {
  if (!router) {
    throw new Error('Router is required.')
  }
  if (!email) {
    throw new Error('Email address is required.')
  }
  if (!password) {
    throw new Error('Missing password.')
  }
  if (!catalog) {
    throw new Error('Catalog library required.')
  }
  if (!onSuccess) {
    throw new Error('Function to call when authentication succeeds is required.')
  }
  if (!onFailure) {
    throw new Error('Function to call when authentication fails is required.')
  }
  catalog.fetchAccount(catalog, email, password, onAccountFetched, onSuccess, onFailure)
}

/**
 * Invoked when a response to retrieve a user's account has been received.
 * @param {Library} catalog     Catalog library that contains user accounts.
 * @param account               A user's account.
 * @param {string} email        User's email address.
 * @param {string} password     A user's password.
 * @param {function} onSuccess  Called if the user with the given name and password is allowed to connect.
 * @param {function} onFailure  Called if the user with the given name and password is not allowed to connect.
 */
function onAccountFetched (catalog, account, email, password, onSuccess, onFailure) {
  let authenticatedUser
  let id
  const methodName = 'onAccountFetched'
  if (account && account.isEnabled && (!account.isLocked)) {
    id = account.user.split('/').pop()
    authenticatedUser = {
      id: account.user.slice(1, account.user.length - 1),
      lastSignedInTime: account.lastSignedInTime,
      name: account.name
    }
    if (id === 'guest') {
      logger.info(methodName, `Succesfully authenticated user with ID "${account.user}".`)
      onSuccess(authenticatedUser)
    } else {
      if (account.password) {
        bcrypt.compare(password, account.password, (error, result) => {
          if (result && (!error)) {
            catalog.updateLastSignedInTime(catalog, account, error => {
              if (error) {
                logger.error(
                  methodName, `Updating last signed in time for user with ID "${account.user}" failed. ${error}`)
              } else {
                logger.info(methodName, `Successfully authenticated user with ID "${account.user}".`)
                onSuccess(authenticatedUser)
              }
            })
          } else {
            logger.error(methodName, `Could not fetch account for user with ID "${account.user}". ${error}`)
            onFailure()
          }
        })
      } else {
        logger.warn(methodName, `User with ID "${account.user} does not have a password.`)
        onFailure()
      }
    }
  }
}

exports.authenticate = authenticate
exports.guestUserId = guestUserId
exports.guestUserName = guestUserName
