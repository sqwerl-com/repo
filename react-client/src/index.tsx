/* globals document */

import Application from 'application'
import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import 'index.css'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import registerServiceWorker from 'registerServiceWorker'
import * as React from 'react'

const defaultLocale = 'en'
const setLocale = (language: string) => {
  const element = document.getElementById('root')
  if (element != null) {
    const root = createRoot(element)
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <ApplicationContextProvider value={ApplicationState}>
            <IntlProvider locale={language} messages={messages}>
              <Application />
            </IntlProvider>
          </ApplicationContextProvider>
        </BrowserRouter>
      </React.StrictMode>
    )
  }
}
registerServiceWorker()
setLocale(defaultLocale)
