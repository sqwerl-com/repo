import * as React from 'react'

interface Props {
  title: string
}

/**
 * Renders a read-only field whose value is a thing's title text.
 * @param props
 * @constructor
 */
const TitleField = (props: Props): React.JSX.Element => {
  const { title } = props
  return (
    <>
      {title &&
        <div className='sqwerl-properties-read-only-field'>
          <div className='sqwerl-properties-read-only-field-label'>Title</div>
          {/* TODO - Make sure the value is scrubbed so this isn't an XSS attack vector. */}
          <div className='sqwerl-properties-read-only-field-value' dangerouslySetInnerHTML={{ __html: title }} />
        </div>}
    </>
  )
}

export default TitleField
