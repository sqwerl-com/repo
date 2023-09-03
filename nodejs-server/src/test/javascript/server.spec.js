/* globals describe, it */

const converter = require('../../main/javascript/converter')

const r = require('../../main/javascript/router')

const resultsHandler = require('../../main/javascript/query_results_handler')

describe('server', function () {
  let mockRequest = {
    headers: { accept: 'vnd.sqwerl.org.types+json; version=0.1' },
    session: { data: { user: { id: '/types/users/guest' } } },
    url: '/test/libraries/types'
  }

  let mockResponse = {
    end: function () { },

    write: function (content) {
      console.log('CONTENT: ' + content)
    },

    writeHead: function (headerCode, content) {
      var p
      console.log('STATUS: ' + headerCode)
      console.log('CONTENT: ')
      for (p in content) {
        if (content.hasOwnProperty(p)) {
          console.log('  ' + p + ': ' + content.p)
        }
      }
    }
  }

  it('Can get types of things', function () {
    let handler = resultsHandler.newInstance(
      /**
       * @param {QueryContext} context
       * @param [error]
       */
      function resourceNotFound (context, error) {
        throw new Error('Couldn\'t find the resource \'' + context.resourceId + '\', Error = ' + error)
      },

      null, /* returnFileCallback */

      /**
       * @param {QueryContext} context
       */
      function returnObject (context) {
        // TODO
        console.log('Result: ' + converter.asJson(context.result))
      },

      /**
       * @param {QueryContext} context
       */
      function userCannotRead (context) {
        throw new Error('User \'' + context.userId + '\' could not read the resource \'' + context.resourceId + '\'')
      }
    )

    let router = new r.Router({
      'applicationName': 'test',
      'catalogLibraryName': 'catalog',
      'cataloglibraryPath': 'src/test/resources/sqwerl-catalog',
      'catalogLibraryRepositoryPath': 'src/test/resources/sqwerl-catalog',
      'clientSourcePath': '../../../../sqwerl-sproutcore-client/client/builds',
      'defaultLibraryName': 'default',
      'defaultLibraryPath': 'src/test/resources/sqwerl-catalog',
      'defaultLibraryRepositoryPath': 'src/test/resources/sqwerl-catalog'
    })
    router.route(handler, router, '/types/users/Administrator', '/test/default/types', mockRequest, mockResponse)
  })
})
