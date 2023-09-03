import ApplicationContext from 'context/application'
import { BasicThing, Thing } from 'utils/types'
import { format, parseISO } from 'date-fns'
import { IntlShape, useIntl } from 'react-intl'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import { SheetState } from 'properties'
import { useContext } from 'react'
import * as React from 'react'

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
  const { configuration, currentLibraryName, thing } = state
  const intl = useIntl()
  const context = useContext(ApplicationContext)
  const addedByLink =
    `/${context.parentThingIdToHref(addedBy.type)}#/${configuration.applicationName}/` +
      `${currentLibraryName}${context.encodeUriReplaceStringsWithHyphens(addedBy.id)}`
  const typeNameIsPlural = (thing != null) && {}.hasOwnProperty.call(thing, 'typeNameIsPlural') && thing.typeNameIsPlural
  const addedByLinkText =
    intl.formatMessage(
      {
        id: 'dateUserAddedThing'
      },
      {
        addedBy: addedBy.name,
        addedByLink,
        addedOn: format(parseISO(addedOn), 'MMMM d, yyyy'),
        typeName: formatTypeName(intl, thing),
        typeNameIsPlural
      }
    ).replace(/addedByLink/, addedByLink)
  return (
    <>
      <div className='sqwerl-properties-read-only-field'>
        <div className='sqwerl-properties-read-only-field-label'>
          {intl.formatMessage({ id: 'history.field.label' })}
        </div>
        <div className='sqwerl-properties-read-only-field-value'>
          <span
            className='sqwerl-read-only-field-sub-item'
            dangerouslySetInnerHTML={{ __html: addedByLinkText }}
          />
        </div>
      </div>
    </>
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

export default HistoryField
