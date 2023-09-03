import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from 'sheets/mocks'
import DescriptionField from 'sheets/components/fields/description-field'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'
import React from 'react'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <DescriptionField description='This is a test' state={{ ...createMockSheetState() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
