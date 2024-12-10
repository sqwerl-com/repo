import ApplicationMenuBar from '@/application/application-menu-bar'
import { ConfigurationType } from '@/configuration.ts'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockFetcher } from '@/utils/mocks'
import { render } from '@testing-library/react'
import { SearcherType } from '@/searcher'
import SignInMenu from '@/sign-in-menu'

const testConfiguration: ConfigurationType = {
  anonymousContributorId: 'guest@sqwerl.com',
  anonymousContributorName: 'guest',
  applicationName: 'sqwerl',
  basePath: '/app/',
  baseUrl: '/sqwerl/Main',
  catalogRepositoryName: 'catalog',
  defaultRepositoryId: '/types/repositories/Main',
  defaultRepositoryName: 'Main',
  homeId: '/types/views/initial',
  rowHeightInPixels: 80,
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
  render(
    <IntlProvider locale='en' messages={messages}>
      <ApplicationMenuBar
        classNameForSearchResults={() => 'test'}
        configuration={testConfiguration}
        currentRepositoryName='test'
        currentSearchText=''
        fetcher={mockFetcher}
        hideMenu={() => {}}
        isFetchingSearchResults={false}
        isMoreMenuVisible={false}
        isSearchMenuVisible={false}
        isSignInMenuVisible={false}
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
        showSignInMenu={() => {}}
        toggleTheme={() => {}}
      >
        <SignInMenu isVisible />
      </ApplicationMenuBar>
    </IntlProvider>
  )
})
