import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  /** Number of children. */
  count: number

  /** A thing. */
  thing: Object
}

/**
 * Returns markup that specifies how many children a thing has.
 * @param props
 */
const Index = (props: Props): React.JSX.Element => {
  const { count } = props
  const intl = useIntl()
  const text = intl.formatMessage({ id: 'childrenCount' }, { count })
  return (
    <span
      className='sqwerl-properties-title-bar-title-children-count'
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

export default Index
