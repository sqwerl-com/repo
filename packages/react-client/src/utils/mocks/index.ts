import { ApplicationContextType } from '@/context/application'
import { CallbackType, EventGenerator } from '@/context/application/events'
import { CollectionType, Thing } from '@/utils/types'
import { ConfigurationType } from '@/configuration'
import { FetcherType } from '@/fetcher'
import {
  PropertiesRetrievedCallbackType,
  PropertiesRetrievedEventGenerator,
  SetThingType
} from '@/context/application/properties-retrieved-events'
import { SheetState } from '@/properties'
import { vi } from 'vitest'

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
  fire: vi.fn(() => {}),
  register: vi.fn(() => {}),
  unregister: vi.fn(() => {})
}

export const mockPropertiesRetrievedEvents: PropertiesRetrievedEventGenerator = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fire: vi.fn((_values) => {}),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: vi.fn((_callback: CallbackType | PropertiesRetrievedCallbackType, _setThing?: SetThingType) => {
    return null
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unregister: (_callback: PropertiesRetrievedCallbackType) => {}
}

export const mockApplicationConfiguration: ConfigurationType = {
  anonymousContributorId: '',
  anonymousContributorName: '',
  applicationName: '',
  basePath: '',
  baseUrl: '',
  catalogRepositoryName: '',
  defaultRepositoryId: '',
  defaultRepositoryName: '',
  homeId: '',
  rowHeightInPixels: 75,
  VERSION: ''
}

export const mockApplicationContext: ApplicationContextType = {
  applicationContentHorizontalSliderPercentage: 0,
  applicationContentHorizontalSplitterWidthInPixels: 0,
  distanceInTimeText: (timeStamp: Date) => timeStamp.toString(),
  encodeUriReplaceStringsWithHyphens: (path: string) => path,
  navigateToPropertyEvents: mockEvents,
  navigateToThingEvents: mockEvents,
  parentThingIdToHref: (repositoryName: string, thingId: string) => thingId,
  propertiesRetrievedEvents: mockPropertiesRetrievedEvents,
  rowHeightInPixels: 50,
  selectThingEvents: mockEvents,
  shouldShowPath: vi.fn().mockReturnValue(false),
  shouldShowRelativeTime: vi.fn().mockReturnValue(false),
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
  postData: vi.fn(),
  requestData: vi.fn().mockReturnValue(new Promise(() => {}))
}

export const mockLogger = {
  assert: vi.fn(),
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  setContext: vi.fn(),
  warn: vi.fn(),
  _context: vi.fn().mockReturnValue(''),
  _isTesting: vi.fn().mockReturnValue(true)
}

export const mockSheetState: SheetState = {
  animationState: '',
  configuration: mockApplicationConfiguration,
  context: mockApplicationContext,
  contributorLastSignedInDateTime: '',
  contributorName: 'Testor Testly',
  currentRepositoryName: 'test',
  fetcher: mockFetcher,
  hasLastSignedInDateTime: false,
  isBusy: false,
  isContributorSignedIn: false,
  isHome: false,
  isShowingProperty: false,
  logger: mockLogger,
  navigate: () => {},
  property: '',
  recentUrl: '',
  selection: [],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAnimationState: (_state: string) => {},

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsShowingProperty: (_isShowing: boolean) => {},

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setProperty: (_propertyName: string) => {},

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelection: (_things: Thing[]) => {},

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setThing: (_thing: Thing | null) => {},

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showProperties: (_path: string) => {},

  thing: null
}

export const mockThing: Thing = createMockThing()
