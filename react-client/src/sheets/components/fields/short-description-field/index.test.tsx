import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from 'sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import React from 'react'
import ShortDescriptionField from 'sheets/components/fields/short-description-field'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ShortDescriptionField
            shortDescription='This is a short description'
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
