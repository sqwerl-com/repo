import ApplicationMenu from '@/application/application-menu'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { IntlProvider } from 'react-intl'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Application menu', async () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <IntlProvider locale='en' messages={messages}>
          <ApplicationMenu name='' isVisible={false} />)
        </IntlProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId('application-menu')).toBeInTheDocument()
  })
})
