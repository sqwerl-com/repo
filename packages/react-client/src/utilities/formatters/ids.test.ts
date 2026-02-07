import { expect, it } from 'vitest'
import { thingIdToHref, typeIdToTypeName } from '@/utilities/formatters/ids'

it('thing id formatted to href', () => {
  expect(thingIdToHref('/types/collections/Things to Check Out')).toEqual(
    '/types/collections#Things-to-Check-Out'
  )
})

it('convert type id to name of type', () => {
  expect(typeIdToTypeName('/types/books')).toEqual('Book')
})

it('non-existent type id maps to default', () => {
  expect(typeIdToTypeName('/type/unknown')).toEqual('Thing')
})
