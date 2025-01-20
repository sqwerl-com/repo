import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockThing } from '@/utils/mocks'
import React from 'react'
import { render } from '@testing-library/react'
import SubscriptionsSheet from '@/sheets/components/fields/subscriptions-field'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <SubscriptionsSheet
            subscriptions={{
              members: [mockThing],
              offset: 0,
              totalCount: 0
            }}
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
