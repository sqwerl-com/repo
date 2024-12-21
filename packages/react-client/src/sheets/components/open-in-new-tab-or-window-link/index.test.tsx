import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import OpenInNewTabOrWindowLink from '@/sheets/components/open-in-new-tab-or-window-link'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  const testUrl = 'https://www.sqwerl.com'

  render(
    <IntlProvider locale='en' messages={messages}>
      <OpenInNewTabOrWindowLink url={testUrl} />
    </IntlProvider>
  )
})
