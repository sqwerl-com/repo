import LoggerFactory from '@/logger'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a facet: information that is common to types of things.
 * @param props
 */
const FacetsSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['addedBy']
  const { state } = props
  const { configuration, thing } = props.state
  const logger = loggerFactory.create(FacetsSheet)

  logger.info('Render Facets property sheet')

  if (thing == null) {
    return (<></>)
  }

  const { name } = thing

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='facetsSheet.title'
        titleTextValues={{ name }}
      />
      {/* TODO - Implement facet property sheets. */}
      <ScrollableContent>Facet property sheet</ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(FacetsSheet)

export default FacetsSheet
