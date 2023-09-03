import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import CollectionsSheet from 'sheets/collections'
import { createMockSheetState, createMockSheetStateWithMissingThing } from 'sheets/mocks'
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
            <CollectionsSheet state={{ ...createMockSheetStateWithMissingThing() }} />
          </IntlProvider>
        </ApplicationContextProvider>
      </BrowserRouter>
    )
  }
  setLocale('en')
  root.unmount()
})

it('renders without crashing', () => {
  const root = createRoot(document.createElement('div'))
  const setLocale = (language: string) => {
    root.render(
      <BrowserRouter>
        <ApplicationContextProvider value={ApplicationState}>
          <IntlProvider locale={language} messages={messages}>
            <CollectionsSheet state={{ ...createMockSheetState() }} />
          </IntlProvider>
        </ApplicationContextProvider>
      </BrowserRouter>
    )
  }
  setLocale('en')
  root.unmount()
})
