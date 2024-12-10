import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import Logo from '@/logo'
import messages from '@/translations/locales/en.json'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <Logo basePath='/path' isEnabled />
    </IntlProvider>
  )
})
