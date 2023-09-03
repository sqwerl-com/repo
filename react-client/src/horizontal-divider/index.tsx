/* global HTMLElement */

import { Children, isValidElement, MouseEvent, ReactNode, useEffect, useState } from 'react'
import Logger, { LoggerType } from 'logger'
import * as React from 'react'

let logger: LoggerType

interface Props {
  children?: ReactNode
  percentage: number
  width: number
}

interface State {
  dragOriginX: number
  isArmed: boolean
  isDragging: boolean
  logger: LoggerType
  setDragOriginX: Function
  setIsArmed: Function
  setIsDragging: Function
  setPercentage: Function
  setWidth: Function
  width: number
}

/**
 * Horizontal divider user interface components. Users drag a horizontal split bar to resize the components to the
 * left and right of the split bar.
 */
const HorizontalDivider = (props: Props): React.JSX.Element => {
  logger = Logger(HorizontalDivider, HorizontalDivider)
  const { children } = props
  const [dragOriginX, setDragOriginX] = useState(0)
  const [isArmed, setIsArmed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [minimumWidth] = useState(768)
  const [percentage, setPercentage] = useState(props.percentage)
  const [width, setWidth] = useState(props.width)
  const state = {
    dragOriginX,
    isArmed,
    isDragging,
    logger,
    setDragOriginX,
    setIsArmed,
    setIsDragging,
    setPercentage,
    width,
    setWidth
  }
  useEffect(() => {
    const listener = (): void => updateWidth(state.setWidth)
    window.addEventListener('resize', listener) // () => updateWidth(state.setWidth))
    return () => window.removeEventListener('resize', listener)
  }, [state.setWidth])
  useEffect(() => {
    updateWidth(state.setWidth)
  }, [state.setWidth, width])
  let isSplitVisible = true
  let p = percentage
  const rightWidth = 100 - percentage
  const hasLeftChild = (Children.count(children) > 0) ? isValidElement(Children.toArray(children)[0]) : false
  const hasRightChild = (Children.count(children) > 1) ? isValidElement(Children.toArray(children)[1]) : false
  if (minimumWidth > 0) {
    if (document.documentElement.clientWidth < minimumWidth) {
      isSplitVisible = false
      p = 100
    }
  }
  return (
    <div className='sqwerl-horizontal-split'>
      <div className='sqwerl-horizontal-split-content'>
        {hasLeftChild && (
          <div className='sqwerl-horizontal-split-left-child' style={{ width: `calc(${p}%)` }}>
            {Children.count(children) > 0 ? Children.toArray(children)[0] : ''}
          </div>
        )}
        {isSplitVisible && (
          <div
            className={`sqwerl-horizontal-divider ${(isArmed || isDragging) ? 'active' : ''}`}
            id='horizontal-divider'
            onMouseDown={(event) => handleOnMouseDown(event, state)}
            style={{ left: `calc(${p}%)`, width: `${props.width}px` }}
          />
        )}
        {hasRightChild && isSplitVisible && (
          <div
            className='sqwerl-horizontal-split-right-child'
            style={{ left: `calc(${p}%)`, width: `${rightWidth}%` }}
          >
            {Children.count(children) > 1 ? Children.toArray(children)[1] : ''}
          </div>
        )}
      </div>
      {(isArmed || isDragging) && (
        <div
          className='sqwerl-horizontal-split-overlay'
          onMouseLeave={() => handleOnMouseLeave(state)}
          onMouseMove={(event) => handleOnMouseMove(event, state)}
          onMouseUp={() => handleOnMouseUp(state)}
        />
      )}
    </div>
  )
}

/**
 * Called when the user presses the primary mouse button while the mouse pointer is over the split bar.
 * @param event A mouse event.
 * @param state
 */
const handleOnMouseDown = (event: MouseEvent<HTMLElement>, state: State): void => {
  const { dragOriginX, isArmed, isDragging, logger, setDragOriginX, setIsArmed } = state
  logger.setContext(handleOnMouseDown)
  if (!(isArmed || isDragging)) {
    // @ts-expect-error
    const left = event?.target?.offsetLeft
    setDragOriginX(event.clientX - left)
    logger.debug(`Armed at x: ${dragOriginX}`)
    setIsArmed(true)
  }
}

/**
 * Called when the mouse pointer's hot spot leaves this horizontal divider.
 */
const handleOnMouseLeave = (state: State): void => {
  stopDragging(state)
}

/**
 * Called when the mouse pointer moves over this horizontal divider while the user is allowed to drag this
 * divider's split bar.
 * @param event A mouse event.
 * @param state
 */
const handleOnMouseMove = (event: MouseEvent<HTMLElement>, state: State): void => {
  const { dragOriginX, isArmed, isDragging, logger, setIsArmed, setIsDragging, setPercentage } = state
  logger.setContext(handleOnMouseMove)
  const currentTarget = event.currentTarget
  if (currentTarget.parentElement !== null) {
    const parentElement = currentTarget.parentElement
    const newWidth = parentElement.offsetWidth
    const delta = event.clientX - event.currentTarget.offsetLeft - dragOriginX
    const x = Math.min(event.currentTarget.offsetLeft + delta, newWidth)
    logger.debug(`Moved to x: ${x}`)
    if (isDragging) {
      const newPercentage = Math.max((newWidth > 0) ? (x / newWidth) * 100 : 0, 0)
      logger.debug(`Setting percentage: ${Number(newPercentage).toFixed(2)}%`)
      setPercentage(newPercentage)
    } else if (isArmed) {
      logger.debug(`Armed and dragged to ${delta}`)
      if (Math.abs(delta) > 5) {
        logger.info('Started dragging')
        setIsArmed(false)
        setIsDragging(true)
      }
    }
  }
}

/**
 * Called when the user releases the mouse pointer while dragging this divider's split bar.
 */
const handleOnMouseUp = (state: State): void => {
  stopDragging(state)
}

/**
 * Stops dragging this divider's split bar.
 */
const stopDragging = (state: State): void => {
  const { isDragging, logger, setIsDragging } = state
  logger.setContext(stopDragging).info('Stopped dragging')
  if (isDragging) {
    setIsDragging(false)
  }
}

/**
 * Updates this component's width.
 */
const updateWidth = (setWidth: Function): void => {
  const body = document.getElementsByTagName('body')[0]
  const width = (window.innerWidth > 0) || (document.documentElement.clientWidth > 0) || body.clientWidth
  setWidth(width)
}

export default HorizontalDivider
