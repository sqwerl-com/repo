import { BasicThing, CollectionType } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import lowerCaseFirstLetter from 'utils/formatters/lower-case-first-letter'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  episodes: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to episodes.
 * @param props
 * @constructor
 */
const EpisodesField = (props: Props): React.JSX.Element => {
  const { episodes, state } = props
  const intl = useIntl()
  return (
    <Field
      collection={episodes}
      createLink={episodesLink}
      fieldLabel={intl.formatMessage({ id: 'episodes.field.label' }, { count: episodes.totalCount })}
      property='episodes'
      state={state}
    />)
}

/**
 * Renders hyperlinks to things that are episodes.
 * @param intl
 * @param episodes
 * @param state
 */
const episodesLink = (intl: IntlShape, episodes: BasicThing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = episodes
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {' ' + intl.formatMessage({ id: 'isA' }, { name: lowerCaseFirstLetter(typeName) })}
      </span>
    </span>
  )
}

export default EpisodesField
