import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { beforeEach, describe, test, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from '@/translations/locales/en.json'
import React from 'react'
import RepositoriesSheet from '@/sheets/repositories'
import renderer from 'react-test-renderer'

describe('Repository property sheet', () => {
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  test('renders without crashing', () => {
    renderer.create(
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
