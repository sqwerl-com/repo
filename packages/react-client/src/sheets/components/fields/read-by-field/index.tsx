import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import { useContext} from 'react'

export interface Props {
  readBy: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that lists who have read a thing (like a book or a web page).
 * @param props
 */
const ReadByField = (props: Props): React.JSX.Element => {
  const context = useContext(ApplicationContext)
  const { readBy, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={readBy}
      createLink={(intl, readBy, state) => readByLink(context, intl, readBy, state)}
      fieldLabel={intl.formatMessage({ id: 'readBy.field.label' }, { count: readBy.totalCount })}
      property='readBy'
      state={state}
    />
  )
}

/**
 * Renders hyperlinks to things that have been read.
 * @param context
 * @param intl
 * @param readBy
 * @param state
 */
const readByLink = (context: ApplicationContextType, intl: IntlShape, readBy: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const { hasReadCount, id, name, type } = readBy
  const hasReadText = intl.formatMessage({ id: 'hasReadCount' }, { hasReadCount })

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
      {/* TODO - Sanitize the value to make sure it's not an XSS threat. */}
      <span dangerouslySetInnerHTML={{ __html: hasReadText }} />
    </span>
  )
}

export default ReadByField
