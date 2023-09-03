import aggregateToChangesByDay from 'utils/library-change-aggregator'
import { LibraryChangesShape } from 'utils/types'

test('Aggregates changes made to a library of things within a day', () => {
  const changes: LibraryChangesShape[] = [{
    by: 'Tester Testly',
    changesCount: 1,
    date: new Date().toISOString(),
    hasMoreThanOne: false,
    id: '1',
    ids: ['1'],
    idsAsList: '1',
    isCollapsed: true,
    index: 1,
    who: ['Tester Testly']
  }, {
    by: 'Tester Testly Jr',
    changesCount: 1,
    date: new Date().toISOString(),
    hasMoreThanOne: false,
    id: '2',
    ids: ['2'],
    idsAsList: '2',
    isCollapsed: true,
    index: 2,
    who: ['Tester Testly Jr']
  }]
  aggregateToChangesByDay(changes)
})
