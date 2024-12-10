const resource = require('../../../main/javascript/resource')
const test = require('tap').test

test('Empty resource id is invalid', t => {
  t.notOk(resource.isValidResourceId(''))
  t.end()
})

test('Valid resource id', t => {
  t.ok(resource.isValidResourceId('types'))
  t.end()
})

test('Resource ids cannot contain dollar signs', t => {
  t.notOk(resource.isValidResourceId('$'))
  t.end()
})

test('Resource ids can contain a single period not immediately followed by another period', t => {
  t.ok(resource.isValidResourceId('.'))
  t.end();
})

test('Resource ids cannot contain two periods in a row', t => {
  t.notOk(resource.isValidResourceId('..'))
  t.end()
})

test('Resource ids cannot contain more than one period in a row', t => {
  t.notOk(resource.isValidResourceId('...'))
  t.end()
})

test('Resource ids cannot contain tildes', t => {
  t.notOk(resource.isValidResourceId('~'))
  t.end()
})

test('Resource ids cannot contain hash marks', t => {
  t.notOk(resource.isValidResourceId('#'))
  t.end()
})

test('Resource ids cannot contain colons', t => {
  t.notOk(resource.isValidResourceId(':'))
  t.end()
})

test('Resource ids cannot contain semi-colons', t => {
  t.notOk(resource.isValidResourceId(';'))
  t.end()
})

test('Resource ids cannot contain backslashes', t => {
  t.notOk(resource.isValidResourceId('\\'))
  t.end()
})

test('Resource ids cannot contain percent signs', t => {
  t.notOk(resource.isValidResourceId('%'))
  t.end()
})

test('Resource ids cannot contain pipe symbols', t => {
  t.notOk(resource.isValidResourceId('|'))
  t.end()
})

test('Resource ids cannot contain left curly brackets', t => {
  t.notOk(resource.isValidResourceId('{'))
  t.end()
})

test('Resource ids cannot contain right curly braces', t => {
  t.notOk(resource.isValidResourceId('}'))
  t.end()
})

test('Resource ids cannot contain grave accents', t => {
  t.notOk(resource.isValidResourceId('`'))
  t.end()
})

test('Resource ids cannot contain single quotes', t => {
  t.notOk(resource.isValidResourceId('\''))
  t.end()
})

test('Resource ids cannot contain double quotes', t => {
  t.notOk(resource.isValidResourceId('"'))
  t.end()
})

test('Resource ids cannot contain plus signs', t => {
  t.notOk(resource.isValidResourceId('+'))
  t.end()
})

test('Resource ids cannot contain exclamation points', t => {
  t.notOk(resource.isValidResourceId('!'))
  t.end()
})

test('Resource ids cannot contain commercial at symbols', t => {
  t.notOk(resource.isValidResourceId('@'))
  t.end()
})

test('Resource ids cannot contain circumflexes', t => {
  t.notOk(resource.isValidResourceId('^'))
  t.end()
})

test('Resource ids cannot contain ampersands', t => {
  t.notOk(resource.isValidResourceId('&'))
  t.end()
})

test('Resource ids cannot contain asterisks', t => {
  t.notOk(resource.isValidResourceId('*'))
  t.end()
})

test('Resource ids cannot contain equals signs', t => {
  t.notOk(resource.isValidResourceId('='))
  t.end()
})

test('Resource ids cannot contain left square brackets', t => {
  t.notOk(resource.isValidResourceId('['))
  t.end()
})

test('Resource ids cannot contain right square brackets', t => {
  t.notOk(resource.isValidResourceId(']'))
  t.end()
})

test('Resource ids cannot contain commas', t => {
  t.notOk(resource.isValidResourceId(','))
  t.end()
})

test('Resource ids cannot contain question marks', t => {
  t.notOk(resource.isValidResourceId('?'))
  t.end()
})

test('Resource ids cannot contain left angle brackets (less than signs)', t => {
  t.notOk(resource.isValidResourceId('<'))
  t.end()
})

test('Resource ids cannot contain right angle brackets (greater than signs)', t => {
  t.notOk(resource.isValidResourceId('>'))
  t.end()
})

test('Resource ids cannot contain hyphens', t => {
  t.notOk(resource.isValidResourceId('-'))
  t.end()
})
