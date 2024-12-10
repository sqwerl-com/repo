import * as React from 'react'

interface Props {
  labelText: string
}

/**
 * Renders a label for a field that displays the value of a thing's property.
 * @param props
 * @constructor
 */
const ReadOnlyFieldLabel = (props: Props): React.JSX.Element => {
  const { labelText } = props
  return (
      <div className='sqwerl-properties-read-only-field-label'>
        <div
          className='sqwerl-properties-read-only-field-label-text'
          dangerouslySetInnerHTML={{ __html: labelText }}
        />
        <div className='sqwerl-properties-read-only-field-spacer' />
      </div>
  )
}

export default ReadOnlyFieldLabel
