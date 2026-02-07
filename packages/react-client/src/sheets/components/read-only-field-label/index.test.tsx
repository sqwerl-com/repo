import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ReadOnlyFieldLabel description="This is a test" labelText='test' />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
