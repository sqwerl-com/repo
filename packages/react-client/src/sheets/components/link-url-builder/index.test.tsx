import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import messages from '@/translations/locales/en.json'
import { mockApplicationContext } from '@/utilities/mocks'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <div>{LinkUrlBuilder(mockApplicationContext, '', '', '', '')}</div>
    </IntlProvider>
  )
})
