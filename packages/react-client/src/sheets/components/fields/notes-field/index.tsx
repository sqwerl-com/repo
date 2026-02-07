import ApplicationContext from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  notes: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to notes about a thing.
 * @param props
 */
const NotesField = (props: Props): React.JSX.Element => {
  const { notes, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={notes}
      createLink={notesLink}
      fieldLabel={intl.formatMessage({ id: 'notes.field.label' }, { count: notes.totalCount })}
      property='notes'
      state={state}
    />
  )
}

/**
 * Renders hyperlinks to a thing's notes.
 * @param _intl
 * @param notes
 * @param state
 */
const notesLink = (_intl: IntlShape, notes: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type } = notes

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default NotesField
