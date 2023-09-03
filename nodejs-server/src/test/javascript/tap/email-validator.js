const emailValidator = require('../../../main/javascript/email_validator')
const test = require('tap').test

const validEmailAddress = 'joe.blow@foobar.com'

test('Validates valid email address', t => {
  t.ok(emailValidator.validate(validEmailAddress))
  t.end()
})

test('Invalidates email address that contains invalid characters', t => {
  t.notOk(emailValidator.validate('\u00A9'))
  t.end()
})

test('Invalidates empty email address', t => {
  t.notOk(emailValidator.validate(''))
  t.end()
})

test('Invalidates email addresses that begin with periods.', t => {
  t.notOk(emailValidator.validate('.joe.blow@foobar.com'))
  t.end()
})

test('Invalidates email addresses that end with periods', t => {
  t.notOk(emailValidator.validate('joe.blow.@foobar.com'))
  t.end()
})

test('Invalidates email addresses that contain two consecutive periods', t => {
  t.notOk(emailValidator.validate('joe..blow@foobar.com'))
  t.end()
})
