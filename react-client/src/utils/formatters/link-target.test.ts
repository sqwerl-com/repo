import { linkTargetToCollection, linkTargetToLeaf } from 'utils/formatters/link-target'
import { mockApplicationConfiguration, mockApplicationContext } from 'utils/mocks'

test('creates link to a collection of things', () => {
  const libraryName = 'Library'
  expect(linkTargetToCollection(
    '/types/collections/Things to Check Out',
    mockApplicationConfiguration,
    mockApplicationContext,
    libraryName)).toEqual(
      `${mockApplicationConfiguration.basePath}/types/collections/Things to Check Out#` +
        `/${mockApplicationConfiguration.applicationName}/${libraryName}/types/collections/Things to Check Out`)
})

test('create a link to a single thing', () => {
  const libraryName = 'Library'
  expect(linkTargetToLeaf(
    '/types/users/Tester Testly',
    mockApplicationConfiguration,
    mockApplicationContext,
    libraryName)).toEqual(
      `${mockApplicationConfiguration.basePath}/types/users#/` +
        `${mockApplicationConfiguration.applicationName}/${libraryName}/types/users/Tester Testly`)
})
