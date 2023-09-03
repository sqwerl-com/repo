import { JSX, ReactNode, SVGProps } from 'react'
import { Thing } from 'utils/types'
import { timeDay } from 'd3-time'

interface DataPoint {
  changeCount: number
  time: number
}

interface ChangesThumbnailGraphProps {
  change: Thing
  index: number
  width: string
}

/**
 * A small graph (<a href="https://en.wikipedia.org/wiki/Sparkline">sparkline</a>) that depicts the number of
 * changes made to a library of things each day.
 * @param props
 * @constructor
 */
const ChangesThumbnailGraph = (props: ChangesThumbnailGraphProps): JSX.Element => {
  const { change, index } = props
  if (!change.recentChanges) {
    return (<></>)
  }
  const bins: number[] = Array.from({ length: 30 })
  const changesByDay: DataPoint[] = change.recentChanges.map(d => {
    return { changeCount: d.changesCount, time: new Date(d.date).getTime() }
  })
  let endTime = new Date()
  for (let i = 0; i < 31; i++) {
    bins[i] = 0
    const startTime = timeDay.offset(endTime, -1).getTime()
    changesByDay.forEach(change => {
      if ((change.time >= startTime) && (change.time <= endTime.getTime())) {
        bins[i] += change.changeCount
      }
    })
    endTime = timeDay.offset(endTime, -1)
  }
  const maximumNumberOfChangesPerDay: number = bins.reduce((max, value) => value > max ? value : max, 0)
  const daysWithChangesCount =
    (maximumNumberOfChangesPerDay > 0)
      ? bins.reduce((total: number, value) => value > 0 ? total + 1 : total)
      : 0
  return (<>{renderBars(bins, index, daysWithChangesCount, maximumNumberOfChangesPerDay)}</>)
}

/**
 * Renders the bars within a bar chart that shows the number of changes made in a day.
 * @param bins Number of changes per each day.
 * @param changeIndex Index of changes made during a day in a single commit
 * @param daysWithChangesCount Number of days in which at least one thing changed.
 * @param maximumNumberOfChangesPerDay The maximum number of changes made on any day.
 * @returns A bar chart's bars.
 */
const renderBars = (
  bins: number[],
  changeIndex: number,
  daysWithChangesCount: number,
  maximumNumberOfChangesPerDay: number): ReactNode => {
  const content: Array<SVGProps<SVGRectElement>> = []
  let daysWithChangesIndex = 0
  bins.forEach((count, index) => {
    if (count) {
      const currentBar = daysWithChangesIndex === changeIndex
      const currentClass = currentBar ? 'current' : ''
      const x = index * 2
      content.push(
        <rect
          className={`sqwerl-library-changes-thumbnail-bar ${currentClass}`}
          height={`${(count / maximumNumberOfChangesPerDay) * 30}`}
          key={`bar-${count}-${index}`}
          width={2}
          x={`${x}`}
          y={`${30 - ((count / maximumNumberOfChangesPerDay) * 30)}`}
        />
      )
      daysWithChangesIndex += 1
    }
  })
  return (<>{content}</>)
}

export default ChangesThumbnailGraph
