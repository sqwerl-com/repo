const logger = require('sqwerl-logger').newInstance('QueryContext')
const resource = require('./resource')
const security = require('./security')
const url = require('url')

/**
 * Checks if the given value is truthy, and throws an error if not.
 *
 * @param {*} value             Value to check.
 * @param {string} [message]    Error message for when the given value isn't truthy.
 */
function assertTrue (value, message) {
  if (!value) {
    throw new Error(message)
  }
}

/**
 * Returns a new, initialized context for a library query.
 * @param {ApplicationConfiguration} configuration  Application configuration settings.
 * @param {QueryResultsHandler} resultsHandler      Handler notified when a library returns query results.
 * @param request                                   A web request.
 * @param response                                  A response to the given web request.
 * @param {Library} library                         Library of persistent things.
 * @param {string} resourceId                       Unique resource identifier of a persistent thing to query.
 * @param {string} userId                           Unique resource identifier of the user performing a library query.
 * @param {boolean} isMetadataQuery                 Return information about types of things.
 * @param {boolean} isRepresentationQuery           Return a thing's digital representation.
 * @param {boolean} isSummaryQuery                  Summarize information about things.
 * @constructor
 */
function QueryContext (
  configuration,
  resultsHandler,
  request,
  response,
  library,
  resourceId,
  userId,
  isMetadataQuery,
  isRepresentationQuery,
  isSummaryQuery) {
  let components
  let decodedUri
  const methodName = 'QueryContext'
  logger.info(methodName, 'configuration: ' + configuration)
  logger.info(methodName, 'resultsHandler: ' + resultsHandler)
  logger.info(methodName, 'request: ' + request)
  logger.info(methodName, 'response: ' + response)
  logger.info(methodName, 'resourceId: ' + resourceId)
  logger.info(methodName, 'userId: ' + userId)
  logger.info(methodName, 'isMetadataQuery: ' + isMetadataQuery)
  logger.info(methodName, 'isRepresentationQuery: ' + isRepresentationQuery)
  logger.info(methodName, 'isSummaryQuery: ' + isSummaryQuery)
  assertTrue(library, 'A library is required.')
  assertTrue(request, 'A web request is required.')
  assertTrue(response, 'A web client response is required.')
  assertTrue(resultsHandler, 'A results handler is required.')
  if (resourceId) {
    decodedUri = decodeURI(resourceId)
    if (!resource.isValidResourceId(decodedUri)) {
      throw new Error(
        'The resource ID "' +
        resourceId +
        '" is invalid. It contains characters that are not allowed within resource identifiers.')
    }
  } else {
    throw new Error('A resource ID is required.')
  }
  assertTrue(userId, 'A user ID is required.')
  if (request.url === null) {
    throw new Error('The web request must have a URL')
  }
  components = request.url.split('/')
  this.applicationName = (components.length > 0) ? components[1] : ''
  this.configuration = configuration
  this.library = library
  this.externalizeReferences = true
  this.fileReadRequests = {}
  this.isMetadataQuery = isMetadataQuery
  this.isRepresentationQuery = isRepresentationQuery
  this.isSummaryQuery = isSummaryQuery
  this.isUserSignedIn = isUserSignedIn
  if (request.url) {
    this.queryParameters = url.parse(request.url, true).query
  }
  this.request = request
  this.response = response
  this.resourceId = resourceId
  this.result = null
  this.resultsHandler = resultsHandler
  this.user = null
  this.userId = userId
  this.createHref = function createHref () {
    return encodeURI(this.configuration.baseUrl +
      '/' + this.configuration.applicationName + '/' + this.library.name + this.resourceId)
  }
  // TODO - The library needs to populate this with the names of each of the thing's ancestors.
  this.path = this.resourceId
}

/**
 * Is the user making a query an authenticated, signed-in, non-anonymous user?
 *
 * @returns {boolean} True the the user performing a query has signed in.
 */
function isUserSignedIn () {
  return this.userId !== security.guestUserId
}

/**
 * Returns a new, initialized context for a library query.
 * @param {ApplicationConfiguration} configuration  Application configuration settings.
 * @param {QueryResultsHandler} resultsHandler      Handler notified when a library returns query results.
 * @param request                                   A web request.
 * @param response                                  Response to given web request.
 * @param {Library} library                         Library of persistent things.
 * @param {string} resourceId                       Unique resource identifier of a persistent thing to query.
 * @param {string} userId                           Unique resource identifier of the user performing a library query.
 * @param {boolean} isMetadataQuery                 Is the user querying type information (metadata: data about data)?
 * @param {boolean} isRepresentationQuery           Is the user requesting a binary representation of a thing?
 * @param {boolean} isSummaryQuery                  Is the user requesting summarized results?
 */
function newInstance (
  configuration, resultsHandler, request, response, library, resourceId, userId, isMetadataQuery, isRepresentationQuery, isSummaryQuery) {
  return new QueryContext(
    configuration,
    resultsHandler,
    request,
    response,
    library,
    resourceId,
    userId,
    isMetadataQuery,
    isRepresentationQuery,
    isSummaryQuery)
}

exports.newInstance = newInstance
