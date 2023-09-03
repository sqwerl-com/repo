import { IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from 'sheets/mocks'
import messages from 'translations/locales/en.json'
import { mockThing } from 'utils/mocks'
import React from 'react'
import SpokeAtField from 'sheets/components/fields/spoke-at-field'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <SpokeAtField
          spokeAt={{
            members: [mockThing],
            offset: 0,
            totalCount: 1
          }}
          state={{ ...createMockSheetState() }}
        />
      </IntlProvider>
    </BrowserRouter>
  )
})
