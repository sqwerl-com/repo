import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import NavigationBar from 'navigation/navigation-bar'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <NavigationBar
        currentName='testNavigationBar'
        goBackUrl='/'
        isHome
        itemCount={0}
        parentName=''
        popPath={() => {}}
        setAnimationClassName={() => {}}
        setSelectedItemId={() => {}}
        showProperties={() => {}}
      />
    </IntlProvider>
  )
})
