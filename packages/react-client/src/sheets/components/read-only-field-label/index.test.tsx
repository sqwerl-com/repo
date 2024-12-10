import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ReadOnlyFieldLabel labelText='test' />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
