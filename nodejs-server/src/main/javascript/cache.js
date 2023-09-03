// TODO - Replace this implementation. You have an article with an example, consult it, and redesign.
/**
 * Caches persistent objects in memory.
 */
const converter = require('./converter')

const logger = require('sqwerl-logger').newInstance('Cache')

let resources = {}

/**
 * Caches a value.
 * @param {string}  libraryName  The non-null name of the library that contains the value to cache.
 * @param {string}  resourceId   The cached data's non-null, non-empty unique identifier within the given library.
 * @param {Object}  [value]      A value to cache.
 */
function cache (libraryName, resourceId, value) {
  const libraryCache = resources[libraryName]
  if (!libraryCache) {
    resources[libraryName] = {}
  }
  resources[libraryName][resourceId] = value
}

/**
 * Executes a query against a given resource.
 * @param  user        The user requesting to execute a query.
 * @param  library     The non-null library to query.
 * @param  request     The non-null client request.
 * @param  response    The response to return to the user.
 * @param  {string} resourceId  The unique identifier of the resource to query.
 */
function query (user, library, request, response, resourceId) {
  let cachedObject
  const libraryCache = resources[library.name]
  let methodName = 'query'
  if (libraryCache) {
    cachedObject = libraryCache[resourceId]
  }
  if (cachedObject) {
    logger.info(methodName, 'Found cached object for library "' + library.name + '" with ID "' + resourceId + '".')

    // ***********************************************
    // TODO: Test that the user can read the resource.
    // ***********************************************

    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.write(converter.asJson(resources[library.name][resourceId]))
    response.end()
  } else {
    library.query(library, user, request, response, resourceId)
  }
}

exports.cache = cache
exports.query = query
