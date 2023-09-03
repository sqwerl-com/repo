import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockFetcher } from 'utils/mocks'
import React from 'react'
import renderer from 'react-test-renderer'
import Searcher from 'searcher'
import SearchField from 'search-field'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <SearchField
          className='testSearchField'
          currentSearchText={{}}
          fetcher={mockFetcher}
          isEnabled={false}
          isMenuVisible={false}
          promptTextId={null}
          searchDomainName=''
          searcher={Searcher()}
          searchFieldTooltipTextId='searchField.tooltipText'
          searchText=''
          setCurrentSearchText={() => {}}
          setIsFetchingSearchResults={() => {}}
          setSearchResults={() => {}}
          setSearchText={() => {}}
          showMenu={() => {}}
          tooltipTextId='searchField.tooltipText'
        >
          Test
        </SearchField>
      </IntlProvider>
    </BrowserRouter>
  )
})
