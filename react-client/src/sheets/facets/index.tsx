import Logger, { LoggerType } from 'logger'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TitleBar from 'sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a facet: information that is common to types of things.
 * @param props
 * @constructor
 */
const FacetsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(FacetsSheet, FacetsSheet)
  logger.info('Render Facets property sheet')
  const connectionProperties = ['addedBy']
  const { configuration, thing } = props.state
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
        thing={thing}
        titleTextId='facetsSheet.title'
        titleTextValues={{ name }}
      />
      {/* TODO - Implement facet property sheets. */}
      <ScrollableContent>Facet property sheet</ScrollableContent>
    </>
  )
}

export default FacetsSheet
