const resultsHandler = require('../../../main/javascript/query_results_handler')
const test = require('tap').test

test('Can create and initialize new query results handler with no parameters', t => {
  const handler = resultsHandler.newInstance()
  t.ok(handler)
  t.end()
})
