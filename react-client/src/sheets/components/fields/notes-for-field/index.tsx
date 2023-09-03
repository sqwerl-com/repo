import Field from 'sheets/components/fields/field'
import { CollectionType, Thing } from 'utils/types'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  notesFor: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that display links from notes to the things the notes are about.
 * @param props
 * @constructor
 */
const NotesForField = (props: Props): React.JSX.Element => {
  const { notesFor, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={notesFor}
      createLink={notesForLink}
      fieldLabel={intl.formatMessage({ id: 'notesFor.field.label' }, { count: notesFor.totalCount })}
      property='notesFor'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things that have notes.
 * @param intl
 * @param notesFor
 * @param state
 */
const notesForLink = (intl: IntlShape, notesFor: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = notesFor
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

export default NotesForField
