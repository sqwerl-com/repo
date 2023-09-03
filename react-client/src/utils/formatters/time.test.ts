import { distanceInTimeText, shouldShowRelativeTime } from 'utils/formatters/time'
import { subDays } from 'date-fns'

it('Distance in time text', () => {
  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000))
  expect(distanceInTimeText(twoDaysAgo)).toEqual('2 days')
})

it('Should show relative time', () => {
  const fiveDaysAgo = subDays(new Date(), 5)
  const fifteenDaysAgo = subDays(new Date(), 15)
  expect(shouldShowRelativeTime(fiveDaysAgo)).toEqual(true)
  expect(shouldShowRelativeTime(fifteenDaysAgo)).toEqual(false)
})
