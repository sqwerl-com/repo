import { useIntl } from 'react-intl'
import * as React from 'react'

/**
 * Renders text that specifies that a thing is a definition of a type of thing.
 * @constructor
 */
const IsTypeOfThing = (): React.JSX.Element => {
  const intl = useIntl()
  return (<>{' ' + intl.formatMessage({ id: 'isTypeOfThing' })}</>)
}

export default IsTypeOfThing
