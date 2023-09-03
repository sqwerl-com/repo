import { ApplicationContextType } from 'context/application'
import { CollectionType, Thing } from 'utils/types'
import { ConfigurationType } from 'configuration'
import { EventGenerator } from 'context/application/events'
import { FetcherType } from 'fetcher'

const createMockThing = (): Thing => {
  const thing: any = {
    addedOn: '',
    attendedBy: mockCollection,
    attending: mockCollection,
    authors: mockCollection,
    by: '',
    changes: [],
    children: mockCollection,
    collection: mockCollection,
    date: '',
    description: '',
    firstName: '',
    hasAttendedCount: 0,
    href: '',
    id: '',
    isCollection: false,
    isType: false,
    lastName: '',
    links: mockCollection,
    linksCount: 0,
    members: [],
    name: '',
    notes: mockCollection,
    path: '',
    pictures: mockCollection,
    readBy: mockCollection,
    readers: mockCollection,
    recommendedBy: mockCollection,
    recommendations: mockCollection,
    representations: mockCollection,
    shortDescription: '',
    tags: mockCollection,
    title: '',
    totalCount: 0,
    type: '',
    typeId: '',
    typeName: '',
    typeOfChange: '',
    webPages: mockCollection
  }
  thing.addedBy = thing
  return thing
}

export const mockEvents: EventGenerator = {
  fire: jest.fn(),
  register: jest.fn(),
  unregister: jest.fn()
}

export const mockApplicationConfiguration: ConfigurationType = {
  anonymousUserId: '',
  anonymousUserName: '',
  applicationName: '',
  basePath: '',
  baseUrl: '',
  catalogLibraryName: '',
  defaultLibraryId: '',
  defaultLibraryName: '',
  homeId: '',
  VERSION: ''
}

export const mockApplicationContext: ApplicationContextType = {
  applicationContentHorizontalSliderPercentage: 0,
  applicationContentHorizontalSplitterWidthInPixels: 0,
  distanceInTimeText: (timeStamp: Date) => timeStamp.toString(),
  encodeUriReplaceStringsWithHyphens: (path: string) => path,
  navigateToPropertyEvents: mockEvents,
  navigateToThingEvents: mockEvents,
  parentThingIdToHref: (thingId: string) => thingId,
  propertiesRetrievedEvents: mockEvents,
  rowHeightInPixels: 50,
  selectThingEvents: mockEvents,
  shouldShowPath: jest.fn().mockReturnValue(false),
  shouldShowRelativeTime: jest.fn().mockReturnValue(false),
  thingIdToHref: (thingId: string) => thingId,
  typeIdToTypeName: (typeId: string) => typeId,
  urlChangedEvents: mockEvents
}

export const mockCollection: CollectionType<Thing> = {
  members: [],
  offset: 0,
  totalCount: 0
}

export const mockFetcher: FetcherType = {
  postData: jest.fn(),
  requestData: jest.fn().mockReturnValue(new Promise(() => {}))
}

export const mockLogger = {
  assert: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  setContext: jest.fn(),
  warn: jest.fn(),
  _context: jest.fn().mockReturnValue(''),
  _isTesting: jest.fn().mockReturnValue(true)
}

export const mockThing: Thing = createMockThing()
