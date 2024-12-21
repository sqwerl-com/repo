import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockApplicationConfiguration, mockThing } from '@/utils/mocks'
import PropertyTitleBar from '@/sheets/components/property-title-bar'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <PropertyTitleBar
          configuration={mockApplicationConfiguration}
          count={1}
          state={createMockSheetState()}
          thing={mockThing}
          thingName='test'
          titleTextId='testId'
          titleTextValues={{}}
        />
      </IntlProvider>
    </BrowserRouter>
  )
})
