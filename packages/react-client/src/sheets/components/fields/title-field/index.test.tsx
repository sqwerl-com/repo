import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import renderer from 'react-test-renderer'
import TitleField from '@/sheets/components/fields/title-field'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <TitleField title='This is a title' />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
