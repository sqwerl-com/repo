import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockFetcher } from '@/utils/mocks'
import React from 'react'
import { render } from '@testing-library/react'
import Searcher from '@/searcher'
import SearchField from '@/search-field'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <SearchField
          applicationName='sqwerl'
          className='testSearchField'
          currentSearchText=''
          fetcher={mockFetcher}
          isEditable={false}
          isEnabled={false}
          isMenuVisible={false}
          promptTextId={null}
          searchDomainName=''
          searcher={Searcher()}
          searchFieldTooltipTextId='searchField.tooltipText'
          searchText=''
          setCurrentSearchText={() => {}}
          setIsEditable={() => {}}
          setIsFetchingSearchResults={() => {}}
          setSearchResults={() => {}}
          setSearchText={() => {}}
          showMenu={() => {}}
          stopSearch={() => {}}
          tooltipTextId='searchField.tooltipText'
        >
          Test
        </SearchField>
      </IntlProvider>
    </BrowserRouter>
  )
})
