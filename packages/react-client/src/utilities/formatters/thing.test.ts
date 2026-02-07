import { expect, it } from 'vitest'
import shouldShowPath from '@/utilities/formatters/things'

it('should show path', () => {
  expect(shouldShowPath('/1/2/3/4')).toBe(true)
})

it('should not show path', () => {
  expect(shouldShowPath('/1/2/3')).toBe(false)
})
