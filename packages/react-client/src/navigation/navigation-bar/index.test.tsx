import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import NavigationBar from '@/navigation/navigation-bar'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
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
