import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  instructors: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field with links to instructors who have taught a thing.
 * @param props
 * @constructor
 */
const InstructorsField = (props: Props): React.JSX.Element => {
  const { instructors, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={instructors}
      createLink={instructorLink}
      fieldLabel={intl.formatMessage({ id: 'instructor.field.label' }, { count: instructors.totalCount })}
      property='instructors'
      state={state}
    />)
}

/**
 * Renders links to instructors (entities who have taught something).
 * @param intl
 * @param instructor
 * @param state
 */
const instructorLink = (intl: IntlShape, instructor: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { instructedCount, id, name, type } = instructor
  const instructedText = intl.formatMessage({ id: 'instructed' }, { count: instructedCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: instructedText }} />
    </span>
  )
}

export default InstructorsField
