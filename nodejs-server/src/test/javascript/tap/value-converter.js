const test = require('tap').test
const valueConverter = require('../../../main/javascript/value_converter')

const applicationName = 'testApplication'
const libraryName = 'testLibrary'
const library = {
  applicationName: applicationName,
  name: libraryName
}

test('Every member of an array gets converted', t => {
  let i
  let initial = [1, 2, 3]
  let results
  results = valueConverter.convertArray(
    (library, context, resourceId, value) => Number(value) + 1,
    null,
    null,
    null,
    initial)
  for (i = 0; i < initial.length; i += 1) {
    t.ok(results[i] === (initial[i] + 1))
  }
  t.end()
})

test('Boolean conversion works', t => {
  t.ok(valueConverter.convertBoolean(true))
  t.notOk(valueConverter.convertBoolean(false))
  t.equals(valueConverter.convertBoolean(''), false)
  t.equals(valueConverter.convertBoolean(0), false)
  t.end()
})

test('Converting an empty string returns an empty string', t => {
  t.equals('', valueConverter.convertString({}, '', ''))
  t.end()
})

test('Converting a string value that is an absolute reference to a thing returns a reference prepended with the library and application names', t => {
  const value = '</types/users/Test User>'
  console.log('******' + valueConverter.convertString(library, '', value))
  console.log('++++++' + `</${applicationName}/${libraryName}${value.substring(1, value.length - 1)}>`)
  const path = encodeURI(`${applicationName}/${libraryName}${value.substring(1, value.length - 1)}`)
  t.equals(valueConverter.convertString(library, '', value), `</${path}>`)
  t.end()
})

test('Converting a string value that is a relative reference to a thing returns a reference prepended with library, application, and resource names', t => {
  const resourceId = '/types/collectionsF'
  const value = '<projects>'
  t.equals(
    valueConverter.convertString(library, resourceId, value),
    `</${applicationName}/${libraryName}${resourceId}/${value.substring(1, value.length - 1)}>`)
  t.end()
})

test('Converting a string that is not a reference returns the string itself', t => {
  const value = 'test'
  t.equals(value, valueConverter.convertString({}, '', value))
  t.end();
})
