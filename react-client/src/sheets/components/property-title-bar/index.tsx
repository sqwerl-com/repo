/* global history, History */

import { ChevronLeft } from 'react-feather'
import { ConfigurationType } from 'configuration'
import type { SheetState } from 'properties'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  configuration: ConfigurationType

  count: number

  state: SheetState

  thing: Object

  /** The thing whose title is displayed within this title bar. */
  thingName: string

  /** Unique identifier for format for a title bar's text. */
  titleTextId: string

  /** Map of value names to values for the values to insert into the title format to form the title text. */
  titleTextValues: any
}

/**
 * Renders a property sheet's title bar for a property sheet that shows the value of a thing's property.
 * @param props
 */
const PropertyTitleBar = (props: Props): React.JSX.Element => {
  const { titleTextId, titleTextValues } = props
  const intl = useIntl()
  const formattedMessage = intl.formatMessage({ id: titleTextId }, { ...titleTextValues })
  const text = formattedMessage ? formattedMessage.toString() : ''
  return (
    <header className='sqwerl-properties-title-bar'>
      <div className='sqwerl-properties-title-bar-title'>
        <button
          className='sqwerl-property-sheet-title-bar-back-button'
          onClick={() => goBack(history, props)}
        >
          <ChevronLeft className='sqwerl-back-or-forward-icon' />
        </button>
        {titleTextId &&
          <div className='sqwerl-properties-title-text' dangerouslySetInnerHTML={{ __html: text }} />}
      </div>
    </header>
  )
}

const goBack = (history: History, props: Props) => {
  const { setAnimationState, setThing } = props.state
  history.back()
  setThing(null)
  setAnimationState('slide-right')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

export default PropertyTitleBar
