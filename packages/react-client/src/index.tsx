/* globals document */

import Application from '@/application'
import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import messages from '@/translations/locales/en.json'
import '@/index.css'
import * as React from 'react'

const defaultLocale = 'en'
const setLocale = (language: string) => {
  const element = document.getElementById('root')
  if (element !== null) {
    const root = createRoot(element)
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <ApplicationContextProvider value={ApplicationState}>
            <IntlProvider locale={language} messages={messages}>
              <Routes>
                <Route path='/*' element={<Application />} />
              </Routes>
            </IntlProvider>
          </ApplicationContextProvider>
        </BrowserRouter>
      </React.StrictMode>
    )
  }
}

setLocale(defaultLocale)
