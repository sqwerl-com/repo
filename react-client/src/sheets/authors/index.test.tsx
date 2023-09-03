import { ApplicationContextProvider, ApplicationState } from 'context/application'
import AuthorsSheet from 'sheets/authors'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState, createMockSheetStateWithMissingThing } from 'sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing without a thing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <AuthorsSheet state={{ ...createMockSheetStateWithMissingThing() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>)
})

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <AuthorsSheet state={{ ...createMockSheetState() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
