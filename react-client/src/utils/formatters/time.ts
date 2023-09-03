/**
 * Is the given date close enough to now to display a relative time description (one hour ago, a week ago, etc.)?
 * @param timestamp The time when a changes were made to a library of things.
 * @return True if the given time should be described relative to now.
 */
import { formatDistanceToNow, isAfter, subDays } from 'date-fns'

/**
 * Returns a text string that describes the difference in time from a point in the past to the present.
 * @param timestamp
 */
export const distanceInTimeText = (timestamp: Date): string => {
  const text = formatDistanceToNow(timestamp)
  if (text.length > 0) {
    return text[0].toUpperCase() + text.slice(1)
  }
  return text
}

export const shouldShowRelativeTime = (timestamp: Date): boolean => {
  return isAfter(timestamp, subDays(new Date(), 14))
}
