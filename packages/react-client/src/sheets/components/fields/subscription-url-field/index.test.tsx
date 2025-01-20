import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'
import SubscriptionUrlField from './index'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <SubscriptionUrlField
            labelId='webPage.label' url='https://www.sqwerl.com' state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
