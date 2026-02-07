/**
 * Application-wide context information that can be used anywhere within the Sqwerl client application.
 */

import { distanceInTimeText, shouldShowRelativeTime } from '@/utilities/formatters/time'
import { EventGenerator } from '@/context/application/events'
import { IntlShape } from 'react-intl'
import { NavigateToPropertyEvents } from '@/context/application/navigate-to-property-events'
import { NavigateToThingEvents } from '@/context/application/navigate-to-thing-events'
import {
  encodeUriReplaceStringsWithHyphens,
  parentThingIdToHref,
  thingIdToHref,
  typeIdToTypeName,
  typeNameToTypeDescription
}
  from '@/utilities/formatters/ids'
import { PropertiesRetrievedEvents, PropertiesRetrievedEventGenerator
} from '@/context/application/properties-retrieved-events'
import { SelectThingEvents } from '@/context/application/select-thing-events'
import shouldShowPath from '@/utilities/formatters/things'
import { UrlChangedEvents } from '@/context/application/url-changed-events'
import * as React from 'react'

export interface ApplicationContextType {
  applicationContentHorizontalSliderPercentage: number
  applicationContentHorizontalSplitterWidthInPixels: number
  distanceInTimeText: (timestamp: Date) => string
  encodeUriReplaceStringsWithHyphens: (path: string) => string
  navigateToPropertyEvents: EventGenerator
  navigateToThingEvents: EventGenerator
  parentThingIdToHref: (repositoryName: string, thingId: string) => string
  propertiesRetrievedEvents: PropertiesRetrievedEventGenerator
  propertiesRowHeightInPixels: number,
  rowHeightInPixels: number,
  selectThingEvents: EventGenerator
  shouldShowPath: (id: string) => boolean
  shouldShowRelativeTime: (timestamp: Date) => boolean
  thingIdToHref: (thingId: string) => string
  typeIdToTypeName: (typeId: string) => string
  typeNameToTypeDescription: (intl: IntlShape, typeName: string | undefined) => string,
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
   * The hard-coded height, in pixels, for this rows within property sheets. The CSS variable $sqwerl-row-height-pixels
   * needs to match this value.
   *
   * TODO - This value shouldn't be hard-coded. This app should get this height value from an HTML element so that
   * the height set in CSS is the source of truth. That way, the height can change based on font size and CSS
   * media queries.
   */
  propertiesRowHeightInPixels: 110,

  /**
   * The height of navigation list items.
   */
  rowHeightInPixels: Number(window.getComputedStyle(document.documentElement).getPropertyValue('--sqwerl-navigation-items-height')),

  selectThingEvents: SelectThingEvents(),

  shouldShowPath,

  shouldShowRelativeTime,

  thingIdToHref,

  typeIdToTypeName,

  typeNameToTypeDescription,
  
  urlChangedEvents: UrlChangedEvents()
}

const ApplicationContext = React.createContext(ApplicationState)

export const ApplicationContextProvider = ApplicationContext.Provider

export default ApplicationContext

