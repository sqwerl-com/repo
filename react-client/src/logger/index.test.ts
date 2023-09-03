import Logger from 'logger'

const module = () => {
  return {
    testFunction: () => {}
  }
}

it('Test assertions', () => {
  const logger = Logger(module, module().testFunction, false)
  logger.assert(true, 'assertion is true')
  logger.assert(false, 'assertion is false')
})

it('Test debug', () => {
  const logger = Logger(module, module().testFunction)
  logger.debug('Debug message')
})

it('Test info', () => {
  const logger = Logger(module, module().testFunction)
  logger.info('This is an informative message')
})

it('Test error', () => {
  const logger = Logger(module, module().testFunction)
  logger.error('Error message')
})

it('Test warning', () => {
  const logger = Logger(module, module().testFunction)
  logger.warn('This is a warning')
})

it('Test isTesting default', () => {
  const logger = Logger(module, module().testFunction)
  expect(logger._isTesting()).toEqual(false)
})

it('Test set context', () => {
  const logger = Logger(module, module().testFunction)
  const context = 'test'
  logger.setContext(context)
  expect(logger._context()).toEqual(context)
})
