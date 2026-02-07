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
  tagged: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that displays things that have been tagged with the same text tag.
 * @param props
 */
const TaggedField = (props: Props): React.JSX.Element => {
  const { tagged, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={tagged}
      createLink={taggedLink}
      fieldLabel={intl.formatMessage({ id: 'tagged.field.label' }, { count: tagged.totalCount })}
      property='tagged'
      state={state}
    />
  )
}

/**
 * Renders hyperlinks to thing that have been tagged with a text string.
 * @param intl
 * @param tagged
 * @param state
 */
const taggedLink = (intl: IntlShape, tagged: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = tagged

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
      {' ' + intl.formatMessage({ id: 'isA' }, { name: lowerCaseFirstLetter(typeName) })}
    </span>
  )
}

export default TaggedField
