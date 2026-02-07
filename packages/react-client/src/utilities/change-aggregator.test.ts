import aggregateToChangesByDay from '@/utilities/change-aggregator'
import { ChangesShape } from '@/utilities/types'
import { it } from 'vitest'

it('Aggregates changes made to a thing within a day', () => {
  const changes: ChangesShape[] = [{
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
