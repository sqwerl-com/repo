const converter = require('../../../main/javascript/converter')
const test = require('tap').test

test('asJson is the same as JSON.stringify', t => {
  let object = { name: 'foo' }
  console.log('converter.asJson(object): ' + converter.asJson(object))
  t.equals(JSON.stringify(object), converter.asJson(object))
  t.end()
})

test('asObject library must be truthy', t => {
  t.throws(() => {
    converter.asObject(null, '/types/users/guest', '')
  })
  t.end()
})

test('asObject library.applicationName must be truthy', t => {
  t.throws(() => {
    converter.asObject({}, '/types/users/guest', '')
  })
  t.end()
})

test('asObject library.name is truthy', t => {
  t.throws(() => {
    const library = {
      applicationName: 'test'
    }
    converter.asObject(library, '/types/users/guest', '')
  })
  t.end()
})

test('strip application and library from id works', t => {
  const applicationName = 'testApplication'
  const libraryName = 'testLibrary'
  const path = '/types/users/Test User'
  t.equals(converter.stripApplicationAndLibrary(`/${applicationName}/${libraryName}/${path}`, path))
})

test('strip reference marks returns path inside a reference string', t => {
  const path = '/types/users/Test User'
  t.equals(converter.stripReferenceMarks(`</${path}>`), path)
})
