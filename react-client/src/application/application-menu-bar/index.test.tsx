import ApplicationMenuBar from './index'
import { ConfigurationType } from 'configuration'
import { FetchArgumentsType, FetcherType } from 'fetcher'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'
import { SearcherType } from 'searcher'

const testConfiguration: ConfigurationType = {
  anonymousUserId: 'guest@sqwerl.com',
  anonymousUserName: 'guest',
  applicationName: 'sqwerl',
  basePath: '/app/',
  baseUrl: '/sqwerl/Main',
  catalogLibraryName: 'catalog',
  defaultLibraryId: '/types/libraries/Main',
  defaultLibraryName: 'Main',
  homeId: '/types/views/initial',
  VERSION: '0.1.2'
}

it('renders without crashing', () => {
  const testFetcher: FetcherType = {
    postData: (fetchArguments: FetchArgumentsType, data: string) => {
      console.trace(`fetchArguments: ${fetchArguments}`)
      console.trace(`data: ${data}`)
    },
    requestData: async (fetchArguments: FetchArgumentsType, dataType?: string) => {
      console.trace(`fetchArguments: ${fetchArguments}`)
      console.trace(`dataType: ${dataType}`)
      return await new Promise(() => {})
    }
  }
  const testSearcher: SearcherType = {
    search: () => {}
  }
  const testSearchResults = {
    limit: 50,
    offset: 10,
    searchItems: [],
    status: 200,
    text: '',
    total: 0
  }
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ApplicationMenuBar
        classNameForSearchResults={() => 'test'}
        configuration={testConfiguration}
        currentLibraryName='test'
        currentSearchText=''
        fetcher={testFetcher}
        hideMenu={() => {}}
        isFetchingSearchResults={false}
        isMoreMenuVisible={false}
        isSearchMenuVisible={false}
        searchDomainName=''
        searcher={testSearcher}
        searchResults={testSearchResults}
        searchText=''
        setCurrentSearchText={() => {}}
        setIsFetchingSearchResults={() => {}}
        setSearchResults={() => {}}
        setSearchText={() => {}}
        showMoreMenu={() => {}}
        showSearchMenu={() => {}}
        toggleTheme={() => {}}
      />
    </IntlProvider>
  )
})
