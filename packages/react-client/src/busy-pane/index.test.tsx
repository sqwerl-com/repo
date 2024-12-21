import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import BusyPane from '@/busy-pane'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <BusyPane
        isVisible={false}
        name='testBusyPane'
      />
    </IntlProvider>
  )
})
