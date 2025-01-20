import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import Logo from '@/logo'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <Logo basePath='/path' isEnabled themeName='dark' />
    </IntlProvider>
  )
})
