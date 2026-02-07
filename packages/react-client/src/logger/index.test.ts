import { expect, it } from 'vitest'
import LoggerFactory from '@/logger'

const module = () => {
  return {
    testFunction: () => {}
  }
}

const loggerFactory = LoggerFactory(module)

it('Test assertions', () => {
  const logger = loggerFactory.create('Test assertions')
  logger.assert(true, 'assertion is true')
  logger.assert(false, 'assertion is false')
})

it('Test debug', () => {
  const logger = loggerFactory.create('Test debug')
  logger.debug('Debug message')
})

it('Test info', () => {
  const logger = loggerFactory.create('Test info')
  logger.info('This is an informative message')
})

it('Test error', () => {
  const logger = loggerFactory.create('Test error')
  logger.error('Error message')
})

it('Test warning', () => {
  const logger = loggerFactory.create('Test warning')
  logger.warn('This is a warning')
})
