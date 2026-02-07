import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { describe, test } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from '@/translations/locales/en.json'
import React from 'react'
import RepositoriesSheet from '@/sheets/repositories'
import { render } from '@testing-library/react'

describe('Repository property sheet', () => {
  /*
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })
   */

  test('renders without crashing', () => {
    const state = createMockSheetState()

    render(
      <BrowserRouter>
        <ApplicationContextProvider value={ApplicationState}>
          <IntlProvider locale='en' messages={messages}>
            <RepositoriesSheet state={{ ...createMockSheetState() }} />
          </IntlProvider>
        </ApplicationContextProvider>
      </BrowserRouter>
    )
  })
})
