import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState, createMockSheetStateWithMissingThing } from 'sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import NotesSheet from 'sheets/notes'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing without a thing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <NotesSheet state={{ ...createMockSheetStateWithMissingThing() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <NotesSheet state={{ ...createMockSheetState() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
