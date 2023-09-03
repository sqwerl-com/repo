const test = require('tap').test

test('Can encode base 64', t => {
  const plainText = 'A man a plan a canal Panama'
  const encodedText = new Buffer(plainText, 'utf8').toString('base64')
  t.equals(encodedText, 'QSBtYW4gYSBwbGFuIGEgY2FuYWwgUGFuYW1h')
  t.end()
})
