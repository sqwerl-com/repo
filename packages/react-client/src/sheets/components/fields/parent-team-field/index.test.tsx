import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockThing } from '@/utilities/mocks'
import ParentTeamField from '@/sheets/components/fields/parent-team-field'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ParentTeamField
            parent={mockThing}
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
