import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  readers: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists the users who are currently reading a thing.
 * @param props
 * @constructor
 */
const ReadersField = (props: Props): React.JSX.Element => {
  const { readers, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={readers}
      createLink={readersLink}
      fieldLabel={intl.formatMessage({ id: 'readers.field.label' }, { count: readers.totalCount })}
      property='readers'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things that are being read.
 * @param intl
 * @param readers
 * @param state
 */
const readersLink = (intl: IntlShape, readers: Thing, state: SheetState) => {
  const { configuration, context, currentLibraryName } = state
  const { isReadingCount, id, name, type } = readers
  const isReadingText = intl.formatMessage({ id: 'isReading' }, { count: isReadingCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: isReadingText }} />
    </span>
  )
}

export default ReadersField
