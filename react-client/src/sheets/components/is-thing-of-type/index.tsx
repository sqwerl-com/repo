import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  typeName: string
}

/**
 * Renders text that describes a thing's type.
 * @param props
 * @constructor
 */
const IsThingOfType = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { typeName } = props
  return (
    <>
      {typeName &&
        ' ' + intl.formatMessage({ id: `is${typeName}` }, { typeName: lowerCaseFirstLetter(typeName) })}
    </>
  )
}

export default IsThingOfType
