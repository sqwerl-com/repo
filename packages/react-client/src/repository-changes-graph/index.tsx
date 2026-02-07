import { AnimatedLineSeries, XYChart } from '@visx/xychart'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Bar } from '@visx/shape'
import { Grid } from '@visx/grid'
import { Group } from '@visx/group'
import LoggerFactory from '@/logger'
import { scaleLinear, scaleTime } from '@visx/scale'
import { timeDay } from 'd3-time'
import { useMemo } from 'react'
import * as React from 'react'

export interface DataType {
  changesCount: number
  date: string
}

export interface Props {
  data: DataType[]
  height: number
  margins: { bottom: number, left: number, right: number, top: number }
  width: number
}

/** Number of past days to display changes for. */
/* TODO - This value needs to be retrieved--and not hard-coded--from the server. */
const NUMBER_OF_DAYS_PAST_TO_VIEW: number = -30

const RepositoryChangesGraph = (props: Props) => {
  const logger = loggerFactory.create(RepositoryChangesGraph)
  logger.debug('Rendering repository change graph')

  const changesByDay: Array<{ date: Date, changeCount: number }> = []
  const { data, height, margins, width } = props
  const startTime = new Date().setHours(0, 0, 0, 0)
  const xMax = width - Number(margins.left) - Number(margins.right)
  const yMax = height - (margins.bottom + margins.top)
  const endTime = timeDay.offset(new Date(startTime), NUMBER_OF_DAYS_PAST_TO_VIEW).getTime()
  const xScale = useMemo(
    () => {
      return scaleTime<number>({
        domain: [endTime, startTime],
        range: [xMax, 0],
        round: false
      })
    },
    [endTime, startTime, xMax]
  )

  data.forEach(d => {
    changesByDay.push({ date: new Date(d.date), changeCount: d.changesCount })
  })

  const dayInMilliseconds = 60 * 60 * 1000 * 24
  const pastDate = timeDay.round(timeDay.offset(new Date(startTime), NUMBER_OF_DAYS_PAST_TO_VIEW)).getTime()
  const now = new Date().getTime()
  const bins = []
  const points: { x: number, y: number }[] = []
  let changeIndex = 0
  let maxCount = 0

  for (let i = now; i >= pastDate; i -= dayInMilliseconds) {
    let changeCount = 0

    if (changeIndex < changesByDay.length) {
      const timeOfChange = changesByDay[changeIndex].date.getTime()

      if ((timeOfChange >= (i - dayInMilliseconds)) && (timeOfChange <= i)) {
        changeCount = changesByDay[changeIndex].changeCount

        if (changeCount > maxCount) {
          maxCount = changeCount
        }

        ++changeIndex
      }
    }

    /* TODO - set the x value's time to the day's midpoint */
    points.push({ x: xScale(i), y: changeCount })
    bins.push(changeCount)
  }

  const yScale = useMemo(
    () => scaleLinear<number>({
      domain: [0, maxCount],
      range: [yMax, 0],
      round: false
    }),
    [maxCount, yMax]
  )

  const periodInDays = Math.abs(NUMBER_OF_DAYS_PAST_TO_VIEW)
  const barWidth = (width - margins.left - margins.right) / (periodInDays > 0 ? periodInDays : 30)
  const accessors = {
    xAccessor: (d: { x: number, y: number }): number => d.x,
    yAccessor: (d: { x: number, y: number }): number => d.y
  }

  return (
    <>
    <XYChart
      height={height}
      margin={margins}
      width={width}
      xScale={{ type: 'time' }}
      yScale={{ type: 'linear' }}
    >
      <span>Chart</span>
      <Grid
        left={margins.left}
        height={height - margins.top - margins.bottom}
        numTicksColumns={30}
        top={margins.top}
        width={width - margins.left - margins.right}
        xScale={xScale}
        yScale={yScale}
      />
      {/*
      <Group>
        <AnimatedLineSeries
          data={bins}
          dataKey='Changes'
          {...accessors}
        />
      </Group>
      */}

      <Group>
        {bins.map((v, index) => {
          const barHeight = yMax - (yScale(v) ?? 0)
          const barX = margins.left + (barWidth * index) + 1
          const barY = yMax + margins.top - barHeight

          return (
            <Bar
              fill='rgba(23, 233, 217, 0.5)'
              height={barHeight}
              key={`bar-${index}`}
              width={barWidth - 1}
              x={barX}
              y={barY}
            />
          )
        })}
      </Group>
      <AxisLeft
        hideAxisLine
        hideTicks={false}
        hideZero
        key='sqwerl-repository-changes-y-axis'
        left={margins.left}
        scale={yScale}
        top={margins.top}
      />
      <AxisBottom
        hideAxisLine
        hideTicks={false}
        hideZero={false}
        key='sqwerl-repository-changes-x-axis'
        numTicks={4}
        scale={xScale}
        top={height - margins.bottom}
      />
    </XYChart>
    </>
  )
}

const loggerFactory = LoggerFactory(RepositoryChangesGraph)

export default RepositoryChangesGraph
