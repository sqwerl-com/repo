import { mockApplicationConfiguration, mockApplicationContext, mockLogger, mockThing } from '@/utils/mocks'
import { SheetState } from '@/properties'

export const mockSheetState = {
  animationState: '',
  configuration: mockApplicationConfiguration,
  context: mockApplicationContext,
  contributorLastSignedInDateTime: '',
  contributorName: '',
  currentRepositoryName: 'test',
  fetcher: {
    postData: () => {},
    requestData: async () => {
      return await new Promise<Response>(() => '')
    }
  },
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
  setAnimationState: () => {},
  setIsShowingProperty: () => {},
  setProperty: () => {},
  setSelection: () => {},
  setThing: () => {},
  showProperties: () => {},
  thing: mockThing
}

export const mockSheetStateWithMissingThing = {
  animationState: '',
  configuration: mockApplicationConfiguration,
  context: mockApplicationContext,
  contributorLastSignedInDateTime: '',
  contributorName: '',
  currentRepositoryName: 'test',
  fetcher: {
    postData: () => {},
    requestData: async () => {
      return await new Promise<Response>(() => '')
    }
  },
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
  setAnimationState: () => {},
  setIsShowingProperty: () => {},
  setProperty: () => {},
  setSelection: () => {},
  setThing: () => {},
  showProperties: () => {},
  thing: null
}

export const createMockSheetState = (): SheetState => {
  return { ...mockSheetState }
}

export const createMockSheetStateWithMissingThing = (): SheetState => {
  return { ...mockSheetStateWithMissingThing }
}
