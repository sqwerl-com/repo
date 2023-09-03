import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  attendedBy: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to things, like talks or courses, that a user has attended.
 * @param props
 * @constructor
 */
const AttendedByField = (props: Props): React.JSX.Element => {
  const { attendedBy, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={attendedBy}
      createLink={attendedByLink}
      fieldLabel={
        intl.formatMessage({ id: 'attendedBy.field.label' }, { count: attendedBy.totalCount })
      }
      property='attendedBy'
      state={state}
    />)
}

/**
 * Renders a hyperlink to a thing a user has attended.
 * @param intl
 * @param attendedBy
 * @param state
 */
const attendedByLink = (intl: IntlShape, attendedBy: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { hasAttendedCount, id, name, type } = attendedBy
  const hasReadText = intl.formatMessage({ id: 'hasAttendedCount' }, { count: hasAttendedCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: hasReadText }} />
    </span>
  )
}

export default AttendedByField
