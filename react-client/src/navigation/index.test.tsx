import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { mockApplicationConfiguration, mockThing } from 'utils/mocks'
import messages from 'translations/locales/en.json'
import Navigation from 'navigation'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <Navigation
          configuration={mockApplicationConfiguration}
          currentLibraryName='test'
          homeId='/'
          fetcher={{
            postData: (fetchArguments, data) => {},
            requestData: async (fetchArguments, dataType) => { return await new Promise(() => { }) }
          }}
          popPath={() => {}}
          setPath={() => {}}
          setThing={() => {}}
          showProperties={() => {}}
          thing={mockThing}
        />
      </IntlProvider>
    </BrowserRouter>
  )
})
