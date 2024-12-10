import { Thing } from '@/utils/types'
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
  if (connectionProperties && thing) {
    connectionProperties.forEach(property => {
      if (Object.hasOwn(thing, property)) {
        // @ts-expect-error We test that the thing has the property, ignore error.
        if (Object.hasOwn(thing[property],'totalCount')) {
          // @ts-expect-error We test that the property contains the totalCount property, ignore error.
          sum += thing[property]['totalCount']
        }
        /* TODO - Make sure this can be removed.
        else {
          sum++
        }
        */
      }
    })
  }
  return sum
}

export default Index
