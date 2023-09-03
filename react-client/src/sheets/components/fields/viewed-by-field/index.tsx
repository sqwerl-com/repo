import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  state: SheetState
  viewedBy: CollectionType<BasicThing>
}

/**
 * Renders read-only fields that list who has viewed a thing.
 * @param props
 * @constructor
 */
const ViewedByField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { state, viewedBy } = props
  return (
    <Field
      collection={viewedBy}
      createLink={viewedByLink}
      fieldLabel={intl.formatMessage({ id: 'viewedBy.field.label' }, { count: viewedBy.totalCount })}
      property='viewedBy'
      state={state}
    />)
}

/**
 * Renders links to things that have viewed a thing.
 * @param intl
 * @param viewedBy
 * @param state
 */
const viewedByLink = (intl: IntlShape, viewedBy: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { hasViewedCount, id, name, type } = viewedBy
  const hasViewedText = intl.formatMessage({ id: 'hasViewedCount' }, { count: hasViewedCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: hasViewedText }} />
    </span>
  )
}

export default ViewedByField
