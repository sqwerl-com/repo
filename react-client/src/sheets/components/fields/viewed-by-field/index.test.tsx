import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from 'sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockThing } from 'utils/mocks'
import React from 'react'
import renderer from 'react-test-renderer'
import ViewedByField from 'sheets/components/fields/viewed-by-field'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ViewedByField
            state={{ ...createMockSheetState() }}
            viewedBy={{
              members: [mockThing],
              offset: 0,
              totalCount: 1
            }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
