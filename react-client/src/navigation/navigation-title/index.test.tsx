import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import NavigationTitle from 'navigation/navigation-title'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <NavigationTitle
        isHome
        itemCount={0}
        title=''
      />
    </IntlProvider>
  )
})
