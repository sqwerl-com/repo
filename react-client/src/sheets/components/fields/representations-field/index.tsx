import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import OpenInNewTabOrWindowLink from '../../open-in-new-tab-or-window-link'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  fieldTitleId: string
  representations: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to files that contain binary representations of things. For example:
 * a PDF file that contains a book's content.
 * @param props
 * @constructor
 */
const RepresentationsField = (props: Props): React.JSX.Element => {
  const { fieldTitleId, representations, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={representations}
      createLink={representationLink}
      fieldLabel={intl.formatMessage({ id: fieldTitleId }, { count: representations.totalCount })}
      property='representations'
      state={state}
    />)
}

/**
 * Renders a hyperlink to a thing's digital representation.
 * @param intl
 * @param representation
 */
const representationLink = (intl: IntlShape, representation: Thing): React.ReactNode => {
  const { href, name, title } = representation
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      {/* TODO - Add an icon for the type of file (for example: PDF, Word, etc.). Add a icon to open in new window/tab */}
      <a className='sqwerl-hyperlink-underline-on-hover' href={href}>{title || name}</a>
      <OpenInNewTabOrWindowLink url={href} />
    </span>
  )
}

export default RepresentationsField
