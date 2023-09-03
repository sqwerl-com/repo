/* globals JSX */

import { BasicThing, CollectionType, ThumbnailShape } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  authorOf: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that displays links to the things an author has authored.
 * @param {Props} props
 * @returns {JSX.Element}
 * @constructor
 */
const AuthorOfField = (props: Props): React.JSX.Element => {
  const { authorOf, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={authorOf}
      createLink={authorOfLink}
      fieldLabel={intl.formatMessage({ id: 'authorOf.field.label' }, { count: authorOf.totalCount })}
      property='authorOf'
      state={state}
    />)
}

/**
 * Renders a hyperlink to an authored thing.
 * @param {IntlShape} intl
 * @param {BasicThing} authorOf
 * @param {SheetState} state
 * @returns {React.ReactNode}
 */
const authorOfLink = (intl: IntlShape, authorOf: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = authorOf
  const lowerCaseTypeName = lowerCaseFirstLetter(typeName)
  const thumbnails = authorOf.thumbnails
  const thumbnail = retrieveThumbnail(thumbnails)
  const typeMessageKey = `is${typeName}`
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {(thumbnail != null) &&
          <span className='sqwerl-read-only-field-value-thumbnail'>
            <img data-testid='sqwerl-thumbnail' src={thumbnail.href} />
          </span>}
        <span className='sqwerl-read-only-field-label-text'>{name}</span>
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {typeName && (' ' +
            intl.formatMessage(
              { id: typeMessageKey },
              { name: lowerCaseTypeName, typeName: lowerCaseTypeName }
            ))}
      </span>
    </span>
  )
}

const retrieveThumbnail = (thumbnails?: ThumbnailShape[]): ThumbnailShape | undefined => {
  if (thumbnails != null) {
    if (thumbnails.length === 1) {
      return thumbnails[0]
    } else {
      return thumbnails.find(t => t.name && t.name.includes('medium'))
    }
  }
  return undefined
}

export default AuthorOfField
