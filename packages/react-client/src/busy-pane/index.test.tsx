import { BrowserRouter } from 'react-router-dom'
import BusyPane from '@/busy-pane'
import { IntlProvider } from 'react-intl'
import { describe, expect, it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Busy pane', async () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <IntlProvider locale='en' messages={messages}>
          <BusyPane
            isVisible
            name='testBusyPane'
          />
        </IntlProvider>
      </BrowserRouter>
    )

    const element = screen.getByTestId('busy-pane')
    expect(element.classList).toContain('sqwerl-busy-pane')
  })
})
