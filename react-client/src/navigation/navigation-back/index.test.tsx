import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import NavigationBack from 'navigation/navigation-back'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <NavigationBack
          goBackUrl='/'
          popPath={() => {}}
          setAnimationClassName={() => {}}
          setSelectedItemId={() => {}}
          showProperties={() => {}}
          title=''
        />
      </IntlProvider>
    </BrowserRouter>
  )
})
