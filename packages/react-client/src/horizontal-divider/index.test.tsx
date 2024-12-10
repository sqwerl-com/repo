import HorizontalDivider from '@/horizontal-divider'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <HorizontalDivider percentage={50} width={5}>
        <div />
      </HorizontalDivider>
    </IntlProvider>
  )
})
