import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import NavigationToolbar from 'navigation/navigation-toolbar'
import React from 'react'

it('renders without crashing', () => {
  const root = createRoot(document.createElement('div'))
  const setLocale = (language: string) => {
    root.render(
      <IntlProvider locale={language} messages={messages}>
        <NavigationToolbar />
      </IntlProvider>)
  }
  setLocale('en')
  root.unmount()
})
