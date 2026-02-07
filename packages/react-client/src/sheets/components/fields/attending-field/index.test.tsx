import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import AttendingField from '@/sheets/components/fields/attending-field'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockThing } from '@/utilities/mocks'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <AttendingField
            attending={{
              members: [mockThing],
              offset: 0,
              totalCount: 1
            }}
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
