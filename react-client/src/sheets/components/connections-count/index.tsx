import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  /** Names of a thing's properties that refer to other things. */
  connectionProperties: string[]

  /** A thing. */
  thing: any
}

/**
 * Returns markup that specifies how many things a thing is connected to.
 * @param props
 */
const Index = (props: Props): React.JSX.Element => {
  const count = connectionCount(props)
  const intl = useIntl()
  const text = intl.formatMessage({ id: 'connectionsCount' }, { count })
  return (
    <span
      className='sqwerl-properties-title-bar-title-connection-count'
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

/**
 * Returns the number of things a thing is directly connected to.
 * @param props
 * @returns A non-negative integer.
 */
export const connectionCount = (props: Props): number => {
  const { connectionProperties, thing } = props
  let sum = 0
  if (connectionProperties && thing) {
    connectionProperties.forEach(property => {
      if ({}.hasOwnProperty.call(thing, property)) {
        if ({}.hasOwnProperty.call(thing[property], 'totalCount')) {
          sum += thing[property].totalCount
        } else {
          sum++
        }
      }
    })
  }
  return sum
}

export default Index
