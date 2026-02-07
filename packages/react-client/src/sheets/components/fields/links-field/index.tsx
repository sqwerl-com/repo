import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import lowerCaseFirstLetter from '@/utilities/formatters/lower-case-first-letter'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  links: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field with hyperlinks to things a thing is liked to.
 * @param props
 */
const LinksField = (props: Props): React.JSX.Element => {
  const context = useContext(ApplicationContext)
  const intl = useIntl()
  const { links, state } = props

  return (
    <Field
      collection={links}
      createLink={(intl, link, state) => linkLink(context, intl, link, state)}
      fieldLabel={intl.formatMessage({ id: 'links.field.label' }, { count: links.totalCount })}
      property='links'
      state={state}
    />
  )
}

/**
 * Renders hyperlinks to things.
 * @pqarm context
 * @param intl
 * @param link
 * @param state
 */
const linkLink = (context: ApplicationContextType, intl: IntlShape, link: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const { applicationName } = configuration
  const { id, linksCount, name, type, typeName } = link
  const linkCountText = intl.formatMessage({ id: 'linksCount' }, { count: linksCount })

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={`${context.parentThingIdToHref(currentRepositoryName, type)}#/${applicationName}/` +
          `${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(id)}`}
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
