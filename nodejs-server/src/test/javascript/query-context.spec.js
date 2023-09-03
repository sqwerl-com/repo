/* globals describe, expect, it */

const configuration = require('sqwerl-application-configuration').newInstanceFromFile('src/test/resources/test_configuration.json')

const libraryModule = require('../../main/javascript/library')

const queryContext = require('../../main/javascript/query_context')

const request = {
  'url': '/applicationName/libraryName/types'
}

const resourceId = '/types/users/Administrator'

const response = {}

/**
 * @type QueryResultsHandler
 */
const resultsHandler = {}

/**
 * @type {string}
 */
const userId = '/types/users/Administrator'

describe('query_context', function () {
  libraryModule.newInstance(
    'test',
    'test-db',
    null,
    'src/test/resources/sqwerl-catalog',
    'src/test/resources/sqwerl-catalog',
    function (library) {
      it('Can create and initialize a valid query context', function () {
        const context = queryContext.newInstance(
          configuration, resultsHandler, request, response, library, resourceId, userId, true, true)
        expect(context).not.toBeNull()
        expect(context.resultsHandler).toEqual(resultsHandler)
        expect(context.request).toEqual(request)
        expect(context.response).toEqual(response)
        expect(context.library).toEqual(library)
        expect(context.resourceId).toEqual(userId)
        expect(context.userId).toEqual(userId)
        expect(context.isMetadataQuery).toEqual(true)
        expect(context.isRepresentationQuery).toEqual(true)
        expect(context.isSummaryQuery).toEqual(true)
      })
      it('Can\'t construct a query context within a results handler', function () {
        const constructor = function () {
          queryContext.newInstance(configuration, null, request, response, library, userId, userId, true, true)
        }
        expect(constructor).toThrow()
      })
      it('Can\'t construct a query context without a Web request', function () {
        var constructor = function () {
          queryContext.newInstance(configuration, resultsHandler, null, response, library, resourceId, userId, true, true)
        }
        expect(constructor).toThrow()
      })
      it('Can\'t construct a query context without a Web response.', function () {
        var constructor = function () {
          queryContext.newInstance(configuration, resultsHandler, request, null, library, resourceId, userId, true, true)
        }
        expect(constructor).toThrow()
      })
      it('Can\'t construct a query context without a library', function () {
        var constructor = function () {
          queryContext.newInstance(configuration, resultsHandler, request, response, null, resourceId, userId, true, true)
        }
        expect(constructor).toThrow()
      })
      it('Can\'t construct a query context without a resource ID', function () {
        var constructor = function () {
          queryContext.newInstance(configuration, resultsHandler, request, response, library, null, userId, true, true)
        }
        expect(constructor).toThrow()
      })
      it('Can\'t construct a query context without a user ID', function () {
        var constructor = function () {
          queryContext.newInstance(
            configuration, resultsHandler, request, response, library, resourceId, null, true, true)
        }
        expect(constructor).toThrow()
      })
      it('Can\'t construct a query context with an invalid resource id', function () {
        var constructor = function () {
          queryContext.newInstance(
            configuration, resultsHandler, request, response, library, '..', userId, true, true)
        }
        expect(constructor).toThrow()
      })
    }
  )
})
