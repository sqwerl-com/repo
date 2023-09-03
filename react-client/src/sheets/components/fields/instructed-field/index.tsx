import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  instructed: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that displays links to things that an instructor has taught to students.
 * @param props
 * @constructor
 */
const InstructedField = (props: Props): React.JSX.Element => {
  const { instructed, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={instructed}
      createLink={instructedLink}
      fieldLabel={intl.formatMessage({ id: 'instructed.field.label' }, { count: instructed.totalCount })}
      property='instructed'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things that instructors teach.
 * @param intl
 * @param instructed
 * @param state
 */
const instructedLink = (intl: IntlShape, instructed: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = instructed
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {' ' + intl.formatMessage({ id: 'isA' }, { name: lowerCaseFirstLetter(typeName) })}
      </span>
    </span>
  )
}

export default InstructedField
