import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockApplicationConfiguration, mockThing } from '@/utils/mocks'
import Navigation from '@/navigation'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <Navigation
          configuration={mockApplicationConfiguration}
          currentRepositoryName='test'
          homeId='/'
          fetcher={{
            postData: () => {},
            requestData: async () => { return await new Promise(() => { }) }
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
