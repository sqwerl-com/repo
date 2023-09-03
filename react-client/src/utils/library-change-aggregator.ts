import { LibraryChangesShape } from 'utils/types'

export interface AggregatedLibraryChange {
  by: string[]
  changesCount: number
  date: string
  hasMoreThanOne: boolean
  id: string
  ids: string[]
  idsAsList: string
  isCollapsed: boolean
  index: number
  who: string[]
}

/**
 * Aggregates the given changes to a library of things to the days that the changes were made on.
 * @param changes Recent changes made to a library of things.
 */
export const aggregateToChangesByDay = (changes: LibraryChangesShape[]): AggregatedLibraryChange[] => {
  const changesByDay: AggregatedLibraryChange[] = []
  if (changes) {
    let index = 0
    let lastChangeDate: string
    changes.forEach(change => {
      // Get the day the change was made minus the time of day.
      const changeDate = change.date.slice(0, 10)
      if (lastChangeDate && (lastChangeDate === changeDate)) {
        const lastChange = changesByDay[changesByDay.length - 1]
        lastChange.changesCount += change.changesCount
        lastChange.hasMoreThanOne = lastChange.hasMoreThanOne ? true : change.hasMoreThanOne
        lastChange.ids.push(change.id)
        lastChange.idsAsList = lastChange.ids.join(',')
        if (!lastChange.by.find((author: string) => author === change.by)) {
          lastChange.by.push(change.by)
        }
      } else {
        lastChangeDate = changeDate
        changesByDay.push({
          by: [change.by],
          changesCount: change.changesCount,
          date: change.date,
          hasMoreThanOne: change.hasMoreThanOne,
          id: '',
          ids: [change.id],
          idsAsList: change.id,
          index: index++,
          isCollapsed: true,
          who: [change.by]
        })
      }
    })
  }
  return changesByDay
}

export default aggregateToChangesByDay
