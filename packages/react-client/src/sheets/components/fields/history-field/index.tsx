import ApplicationContext from '@/context/application'
import { BasicThing, Thing } from '@/utils/types'
import { format, parseISO } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import lowerCaseFirstLetter from '@/utils/formatters/lower-case-first-letter'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { SheetState } from '@/properties'
import { useContext } from 'react'
import * as React from 'react'

interface AddedByValueProps {
  addedByLink: string
  addedByName: string
  addedOn: string
  intl: IntlShape
  repositoryName: string
  thing: Thing | null
  typeNameIsPlural: boolean
}

interface Props {
  addedBy: BasicThing
  addedOn: string
  state: SheetState
}

/**
 * Renders the history of changes made to a thing.
 * @param props
 */
const HistoryField = (props: Props): React.JSX.Element => {
  const { addedBy, addedOn, state } = props
  const { configuration, currentRepositoryName, thing } = state
  const { applicationName } = configuration
  const intl = useIntl()
  const context = useContext(ApplicationContext)
  const addedByLink =
    `${context.parentThingIdToHref(currentRepositoryName, addedBy.type)}#/${applicationName}/` +
      `${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(addedBy.id)}`
  const typeNameIsPlural =
    (thing != null) && {}.hasOwnProperty.call(thing, 'typeNameIsPlural') && thing.typeNameIsPlural

  return (
    <div className='sqwerl-properties-read-only-field'>
      <ReadOnlyFieldLabel labelText={intl.formatMessage({ id: 'history.field.label' })} />
      <div className='sqwerl-properties-read-only-field-value sqwerl-history-field-value'>
        <AddedByValue
          addedByLink={addedByLink}
          addedByName={addedBy.name}
          addedOn={addedOn}
          intl={intl}
          repositoryName={currentRepositoryName}
          thing={thing}
          typeNameIsPlural={typeNameIsPlural}
        />
      </div>
    </div>
  )
}

/**
 * Returns content to render to describe the type of thing whose history is being displayed.
 * @param intl Internationalization support.
 * @param thing The thing whose history we are displaying.
 */
const formatTypeName = (intl: IntlShape, thing: Thing | null): string => {
  if (thing == null) {
    return ''
  }

  const { isType, typeName } = thing

  return isType
    ? intl.formatMessage({ id: 'typeOfThing' })
    : (typeName ? lowerCaseFirstLetter(typeName) : '')
}

/**
 * Renders HTML that describes who added a thing to a repository and when the thing was added.
 * @param props
 * @constructor
 */
const AddedByValue = (props: AddedByValueProps) => {
  const { addedByLink, addedByName, addedOn, intl, repositoryName, thing, typeNameIsPlural } = props

  // Content that follows the link to the contributor who added a thing to a repository.
  const postfix = intl.formatMessage(
    {
      id: 'dateContributorAddedThingPostfix'
    },
    {
      name: thing ? thing.name : '',
      repositoryName,
      typeName: formatTypeName(intl, thing),
      typeNameIsPlural
    }
  )

  // Content that precedes the link to the contributor who added a thing to a repository.
  const prefix = intl.formatMessage(
    {
      id: 'dateContributorAddedThingPrefix'
    },
    {
      addedOn: format(parseISO(addedOn), 'MMMM d, yyyy')
    }
  )

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      {prefix}
      <Link
        className='sqwerl-hyperlink-underline-on-hover sqwerl-inline-hyperlink sqwerl-single-line'
        to={addedByLink}
      >
        {addedByName}
      </Link>
      {postfix}
    </span>
  )
}

export default HistoryField
