import { ChevronLeft } from 'react-feather'
import { ConfigurationType } from '@/configuration'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import type { SheetState } from '@/properties'
import { Thing } from '@/utils/types'
import { useIntl } from 'react-intl'
import * as React from 'react'

interface Props {
  configuration: ConfigurationType

  count: number

  state: SheetState

  /** The thing whose title is displayed within this title bar. */
  thing: Thing

  /** The name to display for the thing whose properties are being displayed. */
  thingName: string

  /** Unique identifier for format for a title bar's text. */
  titleTextId: string

  /** Map of value names to values for the values to insert into the title format to form the title text. */
  titleTextValues: { [key: string]: number | string }
}

/**
 * Renders a property sheet's title bar for a property sheet that shows the value of a thing's property.
 * @param props
 */
const PropertyTitleBar = (props: Props): React.JSX.Element => {
  const navigate = useNavigate()
  const { titleTextId, titleTextValues } = props
  const intl = useIntl()
  const formattedMessage = intl.formatMessage({ id: titleTextId }, { ...titleTextValues })
  const text = formattedMessage ? formattedMessage.toString() : ''
  return (
    <header className='sqwerl-properties-title-bar'>
      <div className='sqwerl-properties-title-bar-title'>
        <button
          className='sqwerl-property-sheet-title-bar-back-button'
          onClick={() => goBack(navigate, props)}
        >
          <ChevronLeft className='sqwerl-back-or-forward-icon' />
        </button>
        {titleTextId &&
          <div className='sqwerl-properties-title-text' dangerouslySetInnerHTML={{ __html: text }} />}
      </div>
    </header>
  )
}

const goBack = (navigate: NavigateFunction, props: Props) => {
  const { setAnimationState } = props.state
  navigate(-1)
  setAnimationState('slide-right')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

export default PropertyTitleBar
