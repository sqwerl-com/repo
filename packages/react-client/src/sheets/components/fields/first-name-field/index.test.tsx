import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import FirstNameField from '@/sheets/components/fields/first-name-field'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <FirstNameField firstName='Tester' state={{ ...createMockSheetState() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
