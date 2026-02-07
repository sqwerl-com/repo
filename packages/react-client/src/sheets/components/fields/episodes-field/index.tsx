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
  episodes: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to episodes.
 * @param props
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
    />
  )
}

/**
 * Renders hyperlinks to things that are episodes.
 * @param intl
 * @param episodes
 * @param state
 */
const episodesLink = (intl: IntlShape, episodes: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type, typeName } = episodes

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

export default EpisodesField
