import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from 'sheets/mocks'
import HistoryField from 'sheets/components/fields/history-field'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockThing } from 'utils/mocks'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <HistoryField
            addedBy={mockThing}
            addedOn='2013-03-05T00:00:00.00-07:00'
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})

it('renders plural type name', () => {
  mockThing.isType = true
  mockThing.typeNameIsPlural = true
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <HistoryField
            addedBy={mockThing}
            addedOn='2013-03-05T00:00:00.00-07:00'
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})

it('renders thing\'s type\'s name', () => {
  mockThing.isType = false
  mockThing.typeName = 'Thing'
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <HistoryField
            addedBy={mockThing}
            addedOn='2013-03-05T00:00:00.00-07:00'
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})

it('renders with null thing', () => {
  const sheetState = { ...createMockSheetState() }
  sheetState.thing = null
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <HistoryField
            addedBy={mockThing}
            addedOn='2013-03-05T00:00:00.00-07:00'
            state={sheetState}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
