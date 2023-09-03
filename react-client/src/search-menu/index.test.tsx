import ApplicationMenuBar from 'application/application-menu-bar'
import { ConfigurationType } from 'configuration'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockFetcher } from 'utils/mocks'
import renderer from 'react-test-renderer'
import { SearcherType } from 'searcher'
import SearchMenu from 'search-menu'
import { SearchResults } from 'application'

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

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ApplicationMenuBar
        classNameForSearchResults={() => 'test'}
        configuration={testConfiguration}
        currentLibraryName='test'
        currentSearchText=''
        fetcher={mockFetcher}
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
      >
        <SearchMenu
          configuration={testConfiguration}
          currentLibraryName=''
          currentSearchText=''
          fetcher={mockFetcher}
          hideMenu={() => {}}
          isFetchingSearchResults={false}
          isVisible={false}
          searcher={testSearcher}
          searchResults={null}
          setIsFetchingSearchResults={(isFetching: boolean) => {}}
          setSearchResults={(results: SearchResults) => {}}
        >
          <div />
        </SearchMenu>
      </ApplicationMenuBar>
    </IntlProvider>
  )
})
