import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  state: SheetState
  things: CollectionType<BasicThing>
}

/**
 * Renders a read-only field with links to the things that a picture depicts.
 * @param props
 * @constructor
 */
const PictureOfField = (props: Props): React.JSX.Element => {
  const { state, things } = props
  const intl = useIntl()
  return (
    <Field
      collection={things}
      createLink={thingLink}
      fieldLabel={intl.formatMessage({ id: 'pictureOf.field.label' }, { count: things.totalCount })}
      property='pictureOf'
      state={state}
    />)
}

/**
 * Renders links to things that pictures depict.
 * @param intl
 * @param thing
 * @param state
 */
const thingLink = (intl: IntlShape, thing: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = thing
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentLibraryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default PictureOfField
