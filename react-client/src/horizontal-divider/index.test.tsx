import HorizontalDivider from 'horizontal-divider'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

test('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <HorizontalDivider percentage={50} width={5}>
        <div />
      </HorizontalDivider>
    </IntlProvider>
  )
})
