import { FetchArgumentsType } from 'fetcher'
import { mockApplicationConfiguration, mockApplicationContext, mockLogger, mockThing } from 'utils/mocks'
import { SheetState } from 'properties'

export const mockSheetState = {
  animationState: '',
  configuration: mockApplicationConfiguration,
  context: mockApplicationContext,
  currentLibraryName: 'test',
  fetcher: {
    postData: (fetchArguments: FetchArgumentsType, data: string) => {},
    requestData: async (fetchArguments: FetchArgumentsType, dataType?: string) => {
      return await new Promise<Response>(() => '')
    }
  },
  hasLastSignedInDateTime: false,
  isBusy: false,
  isShowingProperty: false,
  isUserSignedIn: false,
  logger: mockLogger,
  property: '',
  recentUrl: '',
  selection: [],
  setAnimationState: () => {},
  setIsShowingProperty: () => {},
  setProperty: () => {},
  setSelection: () => {},
  setThing: () => {},
  showProperties: () => {},
  thing: mockThing,
  userLastSignedInDateTime: '',
  userName: ''
}

export const mockSheetStateWithMissingThing = {
  animationState: '',
  configuration: mockApplicationConfiguration,
  context: mockApplicationContext,
  currentLibraryName: 'test',
  fetcher: {
    postData: (fetchArguments: FetchArgumentsType, data: string) => {},
    requestData: async (fetchArguments: FetchArgumentsType, dataType?: string) => {
      return await new Promise<Response>(() => '')
    }
  },
  hasLastSignedInDateTime: false,
  isBusy: false,
  isShowingProperty: false,
  isUserSignedIn: false,
  logger: mockLogger,
  property: '',
  recentUrl: '',
  selection: [],
  setAnimationState: () => {},
  setIsShowingProperty: () => {},
  setProperty: () => {},
  setSelection: () => {},
  setThing: () => {},
  showProperties: () => {},
  thing: null,
  userLastSignedInDateTime: '',
  userName: ''
}

export const createMockSheetState = (): SheetState => {
  return { ...mockSheetState }
}

export const createMockSheetStateWithMissingThing = (): SheetState => {
  return { ...mockSheetStateWithMissingThing }
}
