import { IntlProvider } from 'react-intl'
import IsThingOfType from '@/sheets/components/is-thing-of-type'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <IsThingOfType typeName='' />
    </IntlProvider>
  )
})
