import { ApplicationContextProvider, ApplicationState } from 'context/application'
import ArchivedField from 'sheets/components/fields/archived-field'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ArchivedField archived />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
