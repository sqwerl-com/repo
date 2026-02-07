import ApplicationContext from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import lowerCaseFirstLetter from '@/utilities/formatters/lower-case-first-letter'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  notesFor: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that display links from notes to the things the notes are about.
 * @param props
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
    />
  )
}

/**
 * Renders hyperlinks to things that have notes.
 * @param intl
 * @param notesFor
 * @param state
 */
const notesForLink = (intl: IntlShape, notesFor: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = notesFor

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
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
