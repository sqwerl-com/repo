import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import NavigationTitle from '@/navigation/navigation-title'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <NavigationTitle
        isHome
        itemCount={0}
        title=''
      />
    </IntlProvider>
  )
})
