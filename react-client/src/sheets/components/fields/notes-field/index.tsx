import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  notes: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to notes about a thing.
 * @param props
 * @constructor
 */
const NotesField = (props: Props): React.JSX.Element => {
  const { notes, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={notes}
      createLink={notesLink}
      fieldLabel={intl.formatMessage({ id: 'notes.field.label' }, { notesCount: notes.totalCount })}
      property='notes'
      state={state}
    />)
}

/**
 * Renders hyperlinks to a thing's notes.
 * @param intl
 * @param notes
 * @param state
 */
const notesLink = (intl: IntlShape, notes: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = notes
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default NotesField
