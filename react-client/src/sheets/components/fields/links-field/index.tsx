import { CollectionType, LinksShape } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  links: CollectionType<LinksShape>
  state: SheetState
}

/**
 * Renders a read-only field with hyperlinks to things a thing is liked to.
 * @param props
 * @constructor
 */
const LinksField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { links, state } = props
  return (
    <Field
      collection={links}
      createLink={linkLink}
      fieldLabel={intl.formatMessage({ id: 'links.field.label' }, { count: links.totalCount })}
      property='links'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things.
 * @param intl
 * @param link
 * @param state
 */
const linkLink = (intl: IntlShape, link: LinksShape, state: SheetState): React.ReactNode => {
  const { configuration, currentLibraryName } = state
  const { id, linksCount, name, type, typeName } = link
  const linkCountText = intl.formatMessage({ id: 'linksCount' }, { count: linksCount })
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={`${state.context.parentThingIdToHref(type)}#/${configuration.applicationName}/` +
          `${currentLibraryName}${state.context.encodeUriReplaceStringsWithHyphens(id)}`}
      >
        {name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {' ' + intl.formatMessage({ id: 'isA' }, { name: lowerCaseFirstLetter(typeName) })}
        {/* TODO - Make sure the text is sanitized so there is no possibility of XSS vulnerability. */}
        {linksCount && <span dangerouslySetInnerHTML={{ __html: linkCountText }} />}
      </span>
    </span>
  )
}

export default LinksField
