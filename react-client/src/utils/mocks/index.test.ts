import { mockApplicationContext } from 'utils/mocks'

it('test mock application context', () => {
  const timestamp = new Date()
  expect(mockApplicationContext.distanceInTimeText(timestamp)).toEqual(timestamp.toString())
  const thingId = '/types/users/Tester Testly'
  expect(mockApplicationContext.thingIdToHref(thingId)).toEqual(thingId)
  const typeId = '/types/users'
  expect(mockApplicationContext.typeIdToTypeName(typeId)).toEqual(typeId)
})
