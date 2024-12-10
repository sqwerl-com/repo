/**
 * Handles when a user signs up (request to create an account).
 */
const logger = require('sqwerl-logger').newInstance('SignUpHandler')

function SignUpHandler (response, failureRate) {
  this.failureRate = failureRate
  this.onFailure = onFailure.bind(this)
  this.onSuccess = onSuccess.bind(this)
  this.response = response
}

/**
 * Creates and returns a new sign up handler.
 * @param response               An HTTP response to send back to the client that requested a new account.
 * @param {number} [failureRate] Percentage of time (expressed as an integer from 0 to 100) that this handler will
 *                               report that a create account request failed. Use this value to simulate network
 *                               errors. This parameter defaults to zero.
 */
function newInstance (response, failureRate) {
  if (!response) {
    throw new Exception('A HTTP response is required')
  }
  return new SignUpHandler(response, isNaN(failureRate) ? 0 : failureRate)
}

function onFailure (error, message) {
  const functionName = 'onFailure'
  const response = this.response
  let previous
  logger.warn(
    functionName,
    'Sign up (create account) request failed. ' + error + ' Message: ' + JSON.stringify(message))
  if (error.previous) {
    previous = error.previous
    logger.warn(
      functionName,
      '\n Address: "' + previous.address +
      '",\n Code: "' + previous.code +
      '",\n Message: "' + previous.message +
      '",\n Port: "' + previous.port + '"'
    )
  }
  response.writeHead(500, { 'Content-type': 'text/plain' })
  response.write('Unable to confirm sign up (create account) request.')
  response.end()
}

function onSuccess () {
  const functionName = 'onSuccess'
  const response = this.response
  let failureRate = this.signUpFailureRate || 0
  logger.info(functionName, failureRate
    ? (functionName + ': Sign up (create account) failure rate set to ' + (failureRate * 100) + '%')
    : (functionName + ': Sign up (create account) failure rate not set'))
  if (failureRate && simulateFailure(failureRate)) {
    logger.warn(functionName, 'Sign up (create account) request failed.')
    response.writeHead(500, { 'Content-type': 'text/plain' })
    response.write('Unable to confirm sign up (create account) request.')
    response.end()
  } else {
    logger.info(functionName, 'Sign up (create account) request confirmed and forwarded')
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.write('OK. Sign up (create account) request has successfully been forwarded.')
    response.end()
  }
}

function simulateFailure (probability) {
  const functionName = 'simulateFailure'
  let shouldFail = ((probability >= 1.0) ? true : Math.random() < probability)
  if (shouldFail) {
    logger.info(
      functionName,
      'Failing sign up (create account) request in order to simulate a failure rate of ' +
      (probability * 100) +
      '%')
  }
  return shouldFail
}

exports.newInstance = newInstance
