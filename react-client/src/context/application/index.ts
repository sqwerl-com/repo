/**
 * Application-wide context information that can be used anywhere within the Sqwerl client application.
 */

import { distanceInTimeText, shouldShowRelativeTime } from 'utils/formatters/time'
import { EventGenerator } from 'context/application/events'
import NavigateToPropertyEvents from 'context/application/navigate-to-property-events'
import NavigateToThingEvents from 'context/application/navigate-to-thing-events'
import { encodeUriReplaceStringsWithHyphens, parentThingIdToHref, thingIdToHref, typeIdToTypeName }
  from 'utils/formatters/ids'
import PropertiesRetrievedEvents from 'context/application/properties-retrieved-events'
import SelectThingEvents from 'context/application/select-thing-events'
import shouldShowPath from 'utils/formatters/things'
import UrlChangedEvents from 'context/application/url-changed-events'
import * as React from 'react'

export interface ApplicationContextType {
  applicationContentHorizontalSliderPercentage: number
  applicationContentHorizontalSplitterWidthInPixels: number
  distanceInTimeText: (timestamp: Date) => string
  encodeUriReplaceStringsWithHyphens: (path: string) => string
  navigateToPropertyEvents: EventGenerator
  navigateToThingEvents: EventGenerator
  parentThingIdToHref: (thingId: string) => string
  propertiesRetrievedEvents: EventGenerator
  rowHeightInPixels: number,
  selectThingEvents: EventGenerator
  shouldShowPath: (id: string) => boolean
  shouldShowRelativeTime: (timestamp: Date) => boolean
  thingIdToHref: (thingId: string) => string
  typeIdToTypeName: (typeId: string) => string
  urlChangedEvents: EventGenerator
}

/**
 * Global application state and functions.
 */
export const ApplicationState: ApplicationContextType = {
  applicationContentHorizontalSliderPercentage: 35,

  applicationContentHorizontalSplitterWidthInPixels: 5,

  distanceInTimeText,

  encodeUriReplaceStringsWithHyphens,

  navigateToPropertyEvents: NavigateToPropertyEvents(),

  navigateToThingEvents: NavigateToThingEvents(),

  parentThingIdToHref,

  propertiesRetrievedEvents: PropertiesRetrievedEvents([]),

  /**
   * The hard-coded height, in pixels, for this list's rows. The CSS variable $sqwerl-row-height-pixels
   * needs to match this value.
   *
   * TODO - This value shouldn't be hard-coded. This app should get this height value from an HTML element so that
   * the height set in CSS is the source of truth. That way, the height can change based on font size and CSS
   * media queries.
   */
  rowHeightInPixels: 50,

  selectThingEvents: SelectThingEvents(),

  shouldShowPath,

  shouldShowRelativeTime,

  thingIdToHref,

  typeIdToTypeName,

  urlChangedEvents: UrlChangedEvents()
}

const ApplicationContext = React.createContext(ApplicationState)

export const ApplicationContextProvider = ApplicationContext.Provider
export const ApplicationContextConsumer = ApplicationContext.Consumer

export default ApplicationContext
