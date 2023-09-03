/**
 * Sqwerl server application. Initial execution point for a NodeJS server application that allows users to
 * manage what they know.
 */
const converter = require('./converter');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const logger = require('sqwerl-logger').newInstance('Server');
const path = require('path');
const queryResultsHandler = require('./query_results_handler');
const searcher = require('./search_index');
const security = require('./security');
const signUp = require('sqwerl-sign-up');
const signUpHandler = require('./sign_up_handler');
const staticFileServer = require('../../../node_modules/node-static');
const url = require('url');

/**
 * Handles when a library returns results from performing a query.
 * @type {QueryResultsHandler}
 */
let resultsHandler = queryResultsHandler.newInstance(
  /**
   * Notifies the client that a library could not find a queried resource.
   *
   * @param {QueryContext} context    Query context.
   * @param [error]                   An error object that describes why a resource wasn't found.
   */
  function resourceNotFound(context, error) {
    let libraryName = context.library.name;
    const methodName = 'resourceNotFound';
    let response = context.response;
    let resourceId = context.resourceId;
    if (error) {
      logger.info(methodName, 'Error: ' + error);
    }
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    if (error.description) {
      response.write(error.description);
    } else {
      response.write('Can\'t find the resource with the ID "' +
        resourceId +
        '" in the library "' +
        libraryName +
        '".');
    }
    response.end();
    logger.info(methodName,
      'Sent HTTP 404 result code to client. Couldn\'t find resource with ID "' +
        resourceId +
        '" in the library "' +
        libraryName +
        '"');
  },

  /**
   * Returns the contents of a file to a requesting client.
   *
   * @param {QueryContext} context        Query context.
   * @param {String} qualifiedFileName    A fully-qualified (absolute) path to a file.
   */
  function returnFile(context, qualifiedFileName) {
    const methodName = 'returnFile';
    let response = context.response;
    const url = context.request.url
    context.request.url = qualifiedFileName
    context.library.fileServer.serve(context.request, context.response, function (error) {
      context.request.url = url
      if (error) {
        logger.error(
          methodName,
          'Error returning file "' +
            qualifiedFileName +
            '" for the URL "' +
            context.request.url +
            '"');
        logger.error(methodName, 'Error: ' + error.message);
        response.writeHead(error.status, error.headers);
        response.end();
      }
    });
  },

  /**
   * Returns contents of a file located under a given directory to a requesting client.
   * @param request            Request from client.
   * @param response           Response to client.
   * @param router        An object that routes client web requests sent to this server to request handlers.
   * @param {string} baseName  Root name in request url for the type of data to return.
   * @param {string} basePath  Path on local file system to look for content in.
   */
  function returnLocalContent (context, baseName, basePath) {
    serveLocalContent(context.request, context.response, baseName, basePath)
  },

  /**
   * Returns to a requesting client information that describes a resource.
   *
   * @param {QueryContext} context    Query context.
   */
  function returnObject(context) {
    const methodName = 'returnObject';
    let response = context.response;
    let result;
    if (context.result) {
      context.result.href = context.configuration.baseUrl +
        '/' +
        context.configuration.applicationName +
        '/' +
        context.library.name +
        context.resourceId;
      context.result.id = context.resourceId;
      context.result.path = context.result.path || context.path;
    }
    result = converter.asJson(context.result);
    response.writeHead(200, {'Content-Type': 'application/vnd.sqwerl-v0.1+json', 'Vary': 'Content-Type'});
    response.write(result);
    response.end();
    logger.info(methodName, 'Returning object: ' + result);
  },

  /**
   * Notifies the user that he or she is not allowed to read a resource.
   *
   * @param {QueryContext} context    Query context.
   */
  function userCannotRead(context) {
    let libraryName = context.library.name;
    const methodName = 'userCannotRead';
    let response = context.response;
    let resourceId = context.resourceId;
    response.writeHead(403, { 'Content-Type': 'text/plain' });
    response.write(
      'Unable to query the resource with the ID "' +
        resourceId +
        '" from the library "' +
        libraryName +
        '".');
    response.end();
    logger.info(
      methodName,
      'Sent 403 to client. The user "' +
        context.userId +
        '" is not allowed to read the resource "' +
        resourceId +
        '" in the library "' +
        libraryName +
        '"');
  }
);

/**
 * Verifies a user's identity.
 *
 * @param {String} email      The user's email address.
 * @param {String} password   The user's password.
 * @param request             A web client's request to authenticate a user.
 * @param response            Response to client.
 * @param router              Client request router.
 */
function authenticateUser(email, password, request, response, router) {
  const methodName = 'authenticateUser';
  security.authenticate(
    router,
    email,
    password,
    router.catalogLibrary,
    function onSuccess(user) {
      let token;
      logger.info(
        methodName,
        'Authenticated user with id = "' +
          user.id +
          '", ' +
          'alias = "' +
          user.alias +
          '", ' +
          'last sign in time = "' +
          user.lastSignedInTime +
          '"');
      token = jwt.sign({ id: user.id }, router.configuration.securityTokenEncryptionKey, { expiresIn: '24h' });
      router.addUserToken(token, user.id);
      const result = JSON.stringify({
        userId: user.id,
        userName: user.name,
        token: token,
        lastSignedInTime: user.lastSignedInTime
      });
      response.setHeader('Set-Cookie', ['sqwerl-session=' + result]);
      response.writeHead(200, { 'Content-Type': 'text/json' });
      response.write(result);
      response.end();
    },
    function onFailure() {
      logger.info(methodName, 'Could not authenticate the user with the email address: "' + email + '"');
      response.writeHead(403, { 'Content-Type': 'text/plain' });
      response.write('Invalid user name or password.');
      response.end();
    }
  );
}

/**
 * Handles requests to create Sqwerl user accounts.
 *
 * @param router        An object that routes client web requests sent to this server to request handlers.
 * @param request       A web request.
 * @param response      Response to a web request.
 */
function confirmSignUp(router, request, response) {
  const functionName = 'confirmSignUp';
  const configuration = router.configuration;
  logger.info(functionName, 'User is requesting to create an account');
  processPostData(request, response, function (data) {
    const handler = signUpHandler.newInstance(response, configuration.signUpFailureRate);
    signUp.confirmSignUp(configuration.signUpConfiguration, data, handler.onSuccess, handler.onFailure);
  });
}

/**
 * Does the given URL contain characters that this server doesn't allow within URLs. This server has strict
 * guidelines to prevent users from accessing information that they aren't allowed to.
 *
 * @param {String} url      A url (Universal Resource Locator).
 * @returns {boolean}       True if the given URL contains at least one invalid character.
 */
function containsInvalidCharacters(url) {
  let c;
  let i;
  let isValid = true;
  const methodName = 'server.containsInvalidCharacters';
  for (i = 0; i < url.length; i += 1) {
    c = url.charAt[i];
    if ((c === '.') && (i < url.length) && (url.charAt[i + 1] === '.')) {
      logger.info(methodName, 'Double periods detected at index ' + i);
      isValid = false;
      break;
    }
    if ((c === '!') ||
      (c === '~') ||
      (c === '*') ||
      (c === '\'') ||
      (c === '(') ||
      (c === ')') ||
      (c === '{') ||
      (c === '}') ||
      (c === '|') ||
      (c === '^') ||
      (c === '[') ||
      (c === ']') ||
      (c === '`') ||
      (c === '<') ||
      (c === '>') ||
      (c === '#') ||
      (c === '%') ||
      (c === '"') ||
      (c === '\\')) {
      isValid = false;
      logger.info(methodName, 'The character \'' + c + '\' at index ' + i + ' is not allowed');
      break;
    }
  }
  return !isValid;
}

/**
 * Returns a security token, granted by this server, to an authenticated user so the user can prove his or her
 * identity with each request they make to this server. This server returns security tokens as cookies: data stored
 * within the client that is sent back to this server with each request.
 *
 * @param request       Request from client.
 * @returns {*}         A unique string token or null if no token could be found.
 */
function getTokenCookie(request) {
  const methodName = 'getTokenCookie';
  let token = null;
  if (request && request.headers.cookie) {
    let cookies = request.headers.cookie.split(';').reduce(
      (previous , current) => {
        let m = / *([^=]+)=(.*)/.exec(current);
        let key = m[1];
        previous[key] = decodeURIComponent(m[2]);
        return previous;
      },
      {}
    );
    let session = cookies['sqwerl-session'];
    try {
      token = JSON.parse(session).token;
    } catch (exception) {
      logger.warn(methodName, 'Could not parse the sqwerl session cookie "' + session + '" as JSON');
      logger.warn(methodName, exception);
    }
  }
  return token;
}

/**
 * Handles HTTP POST requests sent to this server.
 *
 * @param {string} path   First component of a URL's path posted to this server.
 * @param {string} token  String that uniquely identifies a user's open session with this server.
 * @param router          An object that routes client web requests sent to this server to request handlers.
 * @param request         Request from client.
 * @param response        Response to client.
 */
function handlePostRequests(path, token, router, request, response) {
  switch(path) {
    case 'confirm-sign-up':
      confirmSignUp(router, request, response);
      break;
    case 'feedback':
      postFeedback(router, request, response);
      break;
    case 'sign-in':
      signIn(router, request, response);
      break;
    case 'sign-out':
      signOut(token, request, response, router);
      break;
    default:
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('Not found: ' + request.url);
      response.end();
      break;
  }
}

/**
 * Forwards user-supplied feedback to the people who designed and built Sqwerl.
 *
 * @param router        An object that routes client web requests sent to this server to request handlers.
 * @param request       Request from client.
 * @param response      Response to client.
 */
function postFeedback(router, request, response) {
  const functionName = 'postFeedback';
  logger.info(functionName, 'User is sending feedback');
  processPostData(request, response, function (data) {
    signUp.sendFeedback(
      router.configuration.signUpConfiguration,
      data,
      function onSuccess() {
        logger.info(functionName, 'User feedback successfully sent via email.');
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write('OK. User feedback has been received.');
      },
      function onFailure(error, message) {
        logger.info(functionName, 'Unable to email user feedback.');
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write('Unable to send feedback. ' + error + ' Message: ' + JSON.stringify(message));
        response.end();
      }
    );
  });
}

/**
 * Captures data send by an HTTP POST and passes it to a callback. Returns an error to the client if
 * the data in the HTTP POST is too large.
 *
 * @param request               Request from client.
 * @param response              Response to client.
 * @param {function} [callback] Callback to pass the HTTP POST data to.
 */
function processPostData(request, response, callback) {
  const methodName = 'processPostData';
  let data = '';
  request.setEncoding('utf8');
  request.on('data', function (postDataChunk) {
     data += postDataChunk;
     if (data.length > 1e6) {
       logger.error(methodName, 'Data sent within HTTP POST request is too long. Sending HTTP status 413 to client.');
       response.writeHead(413, { 'Content-Type': 'text/plain' }).end();
       request.connection.destroy();
     }
  });
  request.on('end', function () {
    if (typeof callback === 'function') {
      callback(data);
    }
  });
}

/**
 * Returns static online help content from files on the server's file system.
 *
 * @param request           Request from client.
 * @param response          Response to client.
 * @param {Router} router   Client request router.
 */
function serveHelpContent(request, response, router) {
  serveLocalContent(request, response, router, 'help', router.helpSourcePath);
}

/**
 * Returns static content located on the local file system to a client.
 *
 * @param request            Request from client.
 * @param response           Response to client.
 * @param {string} baseName  Root name in request url for the type of data to return.
 * @param {string} basePath  Path on local file system to look for content in.
 */
function serveLocalContent(request, response, baseName, basePath) {
  const methodName = 'serveLocalContent';
  const fileName = baseName + basePath
  const fileNotFound = () => {
    logger.info(methodName, `Could not find local file "${fileName}"`);
    response.writeHead(404, 'Not found');
    response.write(`404 - Could not find local file "${fileName}"`);
    response.end();
  }
  fs.stat(fileName, function (error, stats) {
    if (error) {
      fileNotFound();
    } else {
      fs.readFile(fileName, 'binary', function (error) {
        if (error && (error.code === 'ENOENT')) {
          fileNotFound();
        } else {
          const fileServer = new staticFileServer.Server(baseName, {});
          request.url = basePath
          fileServer.serve(request, response, function (error) {
            if (error) {
              logger.info(methodName, 'Error returning file for URL: "' + request.url + '".');
              logger.error(methodName, 'Error: ' + error.message);
              response.writeHead(error.status, error.headers);
              response.write(error.message);
              response.end();
            }
          });
        }
      });
    }
  });
}

/**
 * Returns static content from files on the server's file system. Returns the JavaScript, HTML, and CSS code that
 * makes up this server's web client application.
 *
 * @param request           Request from client.
 * @param response          Response to client.
 * @param {Router} router   Client request router.
 */
function serveStaticContent(request, response, router) {
  serveLocalContent(request, response, router, 'static', router.clientSourcePath);
}

/**
 * Validates a user's identity, and grants the user a unique security token.
 *
 * @param {Router} router   Client request router.
 * @param request           Request from client.
 * @param response          Response to client.
 */
function signIn(router, request, response) {
  let data = '';
  request.setEncoding('utf8');
  request.on('data', function (postDataChunk) {
    data += postDataChunk;
    if (data.length > 1e6) {
      data = '';
      response.writeHead(413, { 'Content-Type': 'text/plain' }).end();
      request.connection.destroy();
    }
  });
  request.on('end', function () {
    let email;
    let password;
    let properties = data.split('&');
    properties.forEach(function (property) {
      let components = property.split('=');
      if (components[0] === 'email') {
        email = decodeURIComponent(components[1]);
      } else if (components[0] === 'password') {
        password = decodeURIComponent(components[1]);
      }
    });
    if (email && password) {
      authenticateUser(email.toLowerCase(), password, request, response, router);
    } else {
      response.writeHead(413, { 'Content-Type': 'text/plain' });
      response.write('Missing email address or password. The user\'s email address and password are required');
      response.end();
      request.connection.destroy();
    }
  });
}

/**
 * Signs a user out (unathenticates a user). Removes a user's security token so that the user is no longer authenticated
 * and will have to sign in again to prove his or her identity.
 *
 * @param {string} token    A security token.
 * @param request           Request from client.
 * @param response          Response to client.
 * @param {Router} router   Client request router.
 */
function signOut(token, request, response, router) {
  jwt.verify(token, router.configuration.securityTokenEncryptionKey, function (error, decoded) {
    if (error) {
      response.writeHead(412, { 'Content-Type': 'text/plain' });
      response.write('Not signed in');
      response.end();
    } else {
      router.removeUserToken(token);
      let guestToken = jwt.sign(
        { id: security.guestUserId },
        router.configuration.securityTokenEncryptionKey,
        { expiresIn: Number.MAX_SAFE_INTEGER });
      let result = JSON.stringify({
        userId: security.guestUserId,
        userName: 'guest',
        token: guestToken,
        lastSignedIn: null
      });
      response.setHeader('Set-Cookie', ['sqwerl-session=' + result]);
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.write('Signed out.');
      response.end();
    }
  });
}

/**
 * Starts execution of this web application.
 *
 * @param router        An object that routes client web requests sent to this server to request handlers.
 * @param searchIndex   An object that searches for data.
 */
function start(router, searcher) {
  let guestToken;
  let methodName = 'start';
  if (!router) {
    throw new Error('A non-null route function is required.');
  }
  function onRequest(request, response) {
    let components;
    let data = '';
    const functionName = 'server.onRequest';
    let parsedUrl;
    let pathName;
    let pathStart;
    let token = getTokenCookie(request) ||
        (request.body && request.body.token) ||
        (request.query && request.query.token) ||
        request.headers['x-access-token'];
    let uri = request.url;
    let userId = security.guestUserId;
    logger.info(functionName, 'request.url: ' + uri);
    if (containsInvalidCharacters(request.url)) {
      logger.info(methodName, 'The url \'' + uri + '\' contains illegal characters');
      response.writeHead(400, 'Illegal characters');
      response.write('400 - The address \'' + uri + '\' contains characters not allowed by server.');
      response.end();
    } else {
      parsedUrl = url.parse(uri, true);
      pathName = parsedUrl.pathname;
      logger.info(methodName, 'pathName: ' + pathName);
      components = uri.split('/');
      if (components && (components.length > 0)) {
        pathStart = components[1];
        logger.info(functionName, 'pathStart: ' + pathStart);
        if (pathStart === 'static') {
          serveStaticContent(request, response, router);
        } else if (pathStart === 'help') {
          serveHelpContent(request, response, router);
        } else if (request.method === 'POST') {
          handlePostRequests(pathStart, token, router, request, response);
        } else if (components.length > 2) {
          pathStart = components[2];
          logger.info(functionName, 'pathStart: ' + pathStart);
          if (pathStart.slice(0, 6) === 'search') {
            if (parsedUrl.query.q) {
              searcher.search(userId, parsedUrl.query, request, response);
            } else {
              // TODO - Missing search string, return 404 not found.
              console.log('Search request received, but no search text was provided.');
            }
          } else {
            if (token) {
              userId = router.tokenToUserId(token);
            }
            if ((!token) || (!userId)) {
              if (guestToken) {
                token = guestToken;
              } else {
                guestToken = token = jwt.sign(
                  { id: security.guestUserFFId },
                  router.configuration.securityTokenEncryptionKey,
                  { expiresIn: Number.MAX_SAFE_INTEGER });
                router.addUserToken(token, userId);
              }
              userId = security.guestUserId;
            }
            if (token) {
              logger.info(
                functionName,
                'Received a request for "' +
                pathName +
                '" from the user with the ID "' +
                userId +
                '"');
              request.setEncoding('utf8');
              request.addListener('data', function (postDataChunk) {
                data += postDataChunk;
                logger.info(functionName, 'Received POST data chunk "' + postDataChunk + '".');
              });
              request.addListener('end', function () {
                router.route(resultsHandler, router, userId, pathName, request, response, data);
              });
            } else {
              logger.info(methodName, 'Invalid web token');
              response.writeHead(440, 'Invalid user token');
              response.write('440 - Invalid user token or user\'s session has expired. Please sign in.');
              response.end();
            }
          }
        }
      }
    }
  }
  if (router.configuration.useHttps) {
    let options = {};
    options.cert = fs.readFileSync(router.configuration.certificateFile);
    options.key = fs.readFileSync(router.configuration.keyFile);
    logger.info(methodName, 'Starting secured server');
    require('https').createServer(options, function (request, response) {
      onRequest(request, response);
    }).listen(router.port);
  } else {
    logger.warn(methodName, 'HTTPS not set: Using non-secure HTTP protocol.');
    require('http').createServer(function (request, response) {
      onRequest(request, response);
    }).listen(router.port);
  }
  logger.info(methodName, 'Server has started on port ' + router.port + '.');
}

exports.start = start;
