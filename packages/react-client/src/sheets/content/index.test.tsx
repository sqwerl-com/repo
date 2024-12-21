import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import ContentSheet from '@/sheets/content'
import { createMockSheetState, createMockSheetStateWithMissingThing } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing without a thing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ContentSheet state={{ ...createMockSheetStateWithMissingThing() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ContentSheet state={{ ...createMockSheetState() }} />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
