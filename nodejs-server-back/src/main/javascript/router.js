/**
 * Routes HTTP requests for processing.
 */

/**
 * The name of the catalog library that contains information about other libraries.
 * @type {String}
 */
let catalogLibraryName;

/**
 * Path to the Javascript code for the web client user interface.
 * @type {String}
 */
let clientSourcePath = null;

const fs = require('fs');

/**
 * Path to online help information.
 * @type {String}
 */
let helpSourcePath = null;

const logger = require('sqwerl-logger').newInstance('Router');

/**
 * Libraries to route queries to.
 * @type {Object}
 */
let libraries = null;

const library = require('./library');

const LibraryConfiguration = require('./library-configuration').LibraryConfiguration;

/**
 * The name of a resource that is metadata (information about data) for a type of thing.
 * @type {string}
 */
const metadataResourceName = 'schema';

/**
 * Default network port this router's host server listens to for requests.
 * This can be overridden in a configuration file.
 * @type {number}
 */
let port = 8080;

const queryContext = require('./query_context');

/**
 * The name of resource that is a representation (binary version) of a thing.
 * @type {string}
 */
const representationResourceName = 'representation'

/**
 * The name of a resource that is a summary of information about a thing.
 * @type {string}
 */
const summaryResourceName = 'summary';

/**
 * Asynchronously constructs a web application request router.
 *
 * @param {ApplicationConfiguration} configuration  A web application's configuration information.
 * @param {function} [callback]                     Callback function that is passed a new router.
 * @constructor Constructs a web application's router that accepts web requests and routes them for processing.
 */
function Router(configuration, callback) {
  const catalogLibraryConfiguration = LibraryConfiguration(
    configuration.applicationName,
    configuration.catalogLibraryName,
    null,
    configuration.catalogLibraryPath,
    configuration.catalogLibraryRepositoryPath,
    configuration.catalogLibraryWritablePath
  );
  const methodName = 'Router';
  logger.info(methodName, 'Creating router');
  const router = this;
  this.addUserToken = (token, userId) => addUserToken(this, token, userId);
  this.baseUrl = configuration.baseUrl;
  this.catalogLibraryName = configuration.catalogLibraryName;
  this.clientSourcePath = configuration.clientSourcePath;
  this.configuration = configuration;
  this.libraries = {};
  this.defaultLibraryName = configuration.defaultLibraryName;
  this.helpSourcePath = configuration.helpSourcePath;
  this.port = configuration.port;
  this.removeUserToken = (token) => removeUserToken(this, token);
  this.route = route;
  this.tokenToUserId = (userId) => tokenToUserId(this, userId);
  this.tokensToUserIds = {};
  library.newInstance(
    catalogLibraryConfiguration,
    function (catalogLibrary) {
      router.catalogLibrary = catalogLibrary;
      router.libraries[router.catalogLibraryName] = catalogLibrary;
      const defaultLibraryConfiguration = LibraryConfiguration(
        configuration.applicationName,
        configuration.defaultLibraryName,
        catalogLibrary,
        configuration.defaultLibraryPath,
        configuration.defaultLibraryRepositoryPath,
        configuration.defaultLibraryWritablePath
      );
      library.newInstance(
        defaultLibraryConfiguration,
        function (publicLibrary) {
          router.libraries[configuration.defaultLibraryName] = publicLibrary;
          catalogLibrary.initializeSecurity(catalogLibrary, (error) => {
            if (error) {
              if (callback) {
                logger.warn(
                  methodName,
                  `Failed to initialize security for library named: "${catalogLibrary.name}". ${error}`);
                callback(error, null);
              }
            } else {
              publicLibrary.initializeSecurity(publicLibrary, (error) => {
                if (callback) {
                  if (error) {
                    logger.error(
                      methodName,
                      `Failed to initialize security for library named "${publicLibrary.name}. ${error}`);
                    callback(error, null);
                  } else {
                    logger.info(methodName, 'Router successfully configured.');
                    callback(null, router);
                  }
                }
              });
            }
          });
        }
      );
    }
  );
}

/**
 * Adds a user security token. Adds a relationship between a security token that a client sends and the user
 * associated with that security session. Calling this method essentially logs a user.
 *
 * @param {Router} router  This router.
 * @param {string} token   A security token.
 * @param {string} userId  The unique identifier for the user granted the given security token.
 */
function addUserToken(router, token, userId) {
  const methodName = 'addUser';
  if (router && token && userId) {
    logger.info(methodName, 'Adding security token for user: "' + userId + '"');
    router.tokensToUserIds[token] = userId;
  } else {
    logger.warn(methodName, 'Missing required argument: router, token, and user id are required');
  }
}

/**
 * Removes a security token. Removes the mapping from a security token to the user granted that security token.
 * Calling this function effectively logs a user out.
 *
 * @param {Router} router  This router.
 * @param {string} token   A security token.
 */
function removeUserToken(router, token) {
  const methodName = 'removeUserToken';
  if (router && token) {
    logger.info(methodName, 'Removing security token: "' + token + '"');
    delete router.tokensToUserIds.token;
  } else {
    logger.warn(methodName, 'Missing required argument: router and token must are required');
  }
}

/**
 * Handles a web request.
 *
 * @param {QueryResultsHandler} resultsHandler  Handles when a library returns query results.
 * @param {String} userId                       The unique id of the user making the request.
 * @param {Router} router                       This router (must not be null).
 * @param {String} [pathName]                   Path to a resource.
 * @param request                               Non-null client request.
 * @param response                              A non-null response to send back to client.
 */
function route(resultsHandler, router, userId, pathName, request, response) {
  let components = pathName ? pathName.split('/') : null;
  let context;
  let count = components ? components.length : 0;
  let library;
  let libraryName = '';
  let isMetadataQuery;
  let isRepresentationQuery;
  let isSummaryQuery;
  let lastComponent;
  const methodName = 'route';
  let resourceId;
  logger.info(methodName, 'Routing request for "' + pathName + '"');
  if (count > 1) {
    if ((count > 2) && (components[1] !== 'search')) {
      libraryName = components[2] || this.defaultLibraryName;
      logger.info(methodName, 'accept: ' + request.headers.accept);
      logger.info(methodName, 'libraryName: ' + libraryName);
      logger.info(methodName, 'libraries: ' + router.libraries);
      library = router.libraries[libraryName];
      if (library) {
        logger.info(methodName, 'library: ' + library.name);
        lastComponent = components[components.length - 1];
        isMetadataQuery = (lastComponent === metadataResourceName);
        isRepresentationQuery = (lastComponent === representationResourceName);
        isSummaryQuery = (lastComponent === summaryResourceName);
        resourceId = '/' +
          components.slice(3, components.length - ((isMetadataQuery || isSummaryQuery) ? 1 : 0)).join('/');
        resourceId = resourceId.replace(/-/g, '%20');
        logger.info(methodName, 'Resource ID: "' + resourceId + '"');
        try {
          context = queryContext.newInstance(
            router.configuration,
            resultsHandler,
            request,
            response,
            library,
            decodeURI(resourceId),
            userId,
            isMetadataQuery,
            isRepresentationQuery,
            isSummaryQuery);
          library.query(context);
        } catch (error) {
          logger.error(methodName, 'Query execution failed: ' + error.message);
          response.writeHead(400, { 'Content-Type': 'text/plain' });
          response.write(error.message);
          response.end();
        }
      } else {
        console.log('Asked to retrieve home information')
        logger.info(methodName, 'No library named "' + libraryName + '".');
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        if (libraryName.length === 0) {
          response.write('Missing library name.');
        } else {
          response.write('There is no library named "' + libraryName + '".');
        }
        response.end();
      }
    }
  } else {
    logger.info(methodName, 'Missing application name.');
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Missing application name.');
    response.end();
  }
}

/**
 * Returns the unique id of the user granted the given security token.
 *
 * @param {Router} router  This router.
 * @param {string} token   A security token.
 * @returns {string}       A user's unique ID if there is a user who was granted the given security token.
 */
function tokenToUserId(router, token) {
  return router.tokensToUserIds[token];
}

exports.clientSourcePath = clientSourcePath;
exports.helpSourcePath = helpSourcePath;
exports.route = route;
exports.Router = Router;
