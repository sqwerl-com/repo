import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import ChangesByDaySheet from 'sheets/changes-by-day-sheet'
import { createMockSheetState } from 'sheets/mocks'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import React from 'react'

it('renders without crashing', () => {
  const root = createRoot(document.createElement('div'))
  const setLocale = (language: string) => {
    root.render(
      <BrowserRouter>
        <ApplicationContextProvider value={ApplicationState}>
          <IntlProvider locale={language} messages={messages}>
            <ChangesByDaySheet state={{ ...createMockSheetState() }} />
          </IntlProvider>
        </ApplicationContextProvider>
      </BrowserRouter>)
  }
  setLocale('en')
  root.unmount()
})
