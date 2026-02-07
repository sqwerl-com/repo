import ConnectionsCount from '@/sheets/components/connections-count'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockThing } from '@/utilities/mocks'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <ConnectionsCount connectionProperties={[]} thing={mockThing} />
    </IntlProvider>
  )
})
