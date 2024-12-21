import { CollectionType, Thing } from '@/utils/types'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  /** Names of a thing's properties that refer to other things. */
  connectionProperties: string[]

  /** A thing. */
  thing: Thing
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

  if ((connectionProperties !== undefined) && (thing !== undefined)) {
    connectionProperties.forEach(property => {
      if (Object.hasOwn(thing, property)) {
        // @ts-expect-error During execution, a thing can have properties we don't have defined in code.
        const target: Thing = thing[property] as Thing
        if (Object.hasOwn(target, 'totalCount')) {
          sum += target['totalCount']
        }
      }
    })
  }

  return sum
}

export default Index
