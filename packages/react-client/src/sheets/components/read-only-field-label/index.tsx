import * as React from 'react'

export interface Props {
  /**
   * Text to display--often in a tooltip--to describe a field.
   */
  description: string | undefined,

  /**
   * Text to display to label a field.
   */
  labelText: string
}

/**
 * Renders a label for a field that displays the value of a thing's property.
 * @param props
 */
const ReadOnlyFieldLabel = (props: Props): React.JSX.Element => {
  const { description, labelText } = props

  return (
      <div className='sqwerl-properties-read-only-field-label'>
        <div
          className='sqwerl-properties-read-only-field-label-text'
          dangerouslySetInnerHTML={{ __html: labelText }}
          title={description === undefined ? '' : description}
        />
        <div className='sqwerl-properties-read-only-field-spacer' />
      </div>
  )
}

export default ReadOnlyFieldLabel
