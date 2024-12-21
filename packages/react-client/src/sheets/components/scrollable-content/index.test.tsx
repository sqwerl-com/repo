import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'
import ScrollableContent from '@/sheets/components/scrollable-content'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <ScrollableContent />
    </IntlProvider>
  )
})
