import { BasicThing, CollectionType, Thing } from 'utils/types'
import Field from 'sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import type { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  speakers: CollectionType<BasicThing>
  state: SheetState
}

/**
 * Renders a read-only field that lists a thing's speakers.
 * @param props
 * @constructor
 */
const SpeakersField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { speakers, state } = props
  return (
    <Field
      collection={speakers}
      createLink={speakerLink}
      fieldLabel={intl.formatMessage({ id: 'speakers.field.label' }, { count: speakers.totalCount })}
      property='speakers'
      state={state}
    />)
}

/**
 * Renders hyperlinks to speakers.
 * @param intl
 * @param speaker
 * @param state
 */
const speakerLink = (intl: IntlShape, speaker: Thing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type } = speaker
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

export default SpeakersField
