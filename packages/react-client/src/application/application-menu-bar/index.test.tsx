import ApplicationMenuBar from './index'
import { BrowserRouter } from 'react-router-dom'
import { ConfigurationType } from '@/configuration'
import { describe, expect, it } from 'vitest'
import { FetchArgumentsType, FetcherType } from '@/fetcher'
import { IntlProvider } from 'react-intl'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { SearcherType } from '@/searcher'

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

describe('Application menu bar', async () => {
  it('renders without crashing', () => {
    const testFetcher: FetcherType = {
      postData: (fetchArguments: FetchArgumentsType, data: string) => {
        console.trace(`fetchArguments: ${JSON.stringify(fetchArguments)}`)
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

    render(
      <BrowserRouter>
        <IntlProvider locale='en' messages={messages}>
          <ApplicationMenuBar
            classNameForSearchResults={() => 'test'}
            configuration={testConfiguration}
            currentRepositoryName='test'
            currentSearchText=''
            fetcher={testFetcher}
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
            themeName='dark'
            toggleTheme={() => {}}
          />
        </IntlProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId('application-menu-bar')).toBeInTheDocument()
  })
})
