import shouldShowPath from './things'

test('should show path', () => {
  expect(shouldShowPath('/1/2/3/4')).toBe(true)
})

test('should not show path', () => {
  expect(shouldShowPath('/1/2/3')).toBe(false)
})
