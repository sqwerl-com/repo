import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import ProjectStatusField from '@/sheets/components/fields/project-status-field'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <ProjectStatusField status='active' />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
