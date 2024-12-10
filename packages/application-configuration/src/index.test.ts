import { expect, test } from 'bun:test'
import { loadFromObject } from '@/index'

test('Application configuration from object works', () => {
  const defaultValue = 'default'
  const value1 = 'value1'
  const configuration = loadFromObject({
    property1: value1
  }, [{
    isRequired: true,
    name: 'property1'
  }, {
    defaultValue,
    name: 'property2'
  }])
  expect(configuration).not.toBe(undefined)
  expect(configuration['property1']).toEqual(value1)
  expect(configuration['property2']).toEqual(defaultValue)
})
