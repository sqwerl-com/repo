import { CollectionType, Thing } from '@/utils/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import * as React from 'react'

interface Props {
  speakers: CollectionType<Thing>
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
 * @param _intl
 * @param speaker
 * @param state
 */
const speakerLink = (_intl: IntlShape, speaker: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, context, currentRepositoryName } = state
  const { id, name, type } = speaker
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default SpeakersField
