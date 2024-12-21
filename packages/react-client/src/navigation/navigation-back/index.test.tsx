import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import NavigationBack from '@/navigation/navigation-back'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
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
