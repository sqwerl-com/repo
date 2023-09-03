import { thingIdToHref, typeIdToTypeName } from 'utils/formatters/ids'

test('thing id formatted to href', () => {
  expect(thingIdToHref('/types/collections/Things to Check Out')).toEqual(
    '/types/collections#Things-to-Check-Out'
  )
})

test('convert type id to name of type', () => {
  expect(typeIdToTypeName('/types/books')).toEqual('Book')
})

test('non-existent type id maps to default', () => {
  expect(typeIdToTypeName('/type/unknown')).toEqual('Thing')
})
