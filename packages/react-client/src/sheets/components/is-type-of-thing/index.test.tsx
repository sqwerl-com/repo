import { IntlProvider } from 'react-intl'
import IsTypeOfThing from '@/sheets/components/is-type-of-thing'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <IsTypeOfThing />
    </IntlProvider>
  )
})
