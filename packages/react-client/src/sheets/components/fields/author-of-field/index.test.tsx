import { afterEach, describe, expect, test } from 'vitest'
import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import AuthorOfField from '@/sheets/components/fields/author-of-field'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render, screen } from '@testing-library/react'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from '@/translations/locales/en.json'
import { mockThing } from '@/utilities/mocks'
import { SIZES } from '@/utilities/components/thumbnail-image.tsx'
import React from 'react'
import { Thing } from '@/utilities/types'

describe('Author of field component', () => {
  afterEach(() => {
    cleanup()
  })

  const renderComponent = (mockThing: Thing) => {
    return render(
      <BrowserRouter>
        <ApplicationContextProvider value={ApplicationState}>
          <IntlProvider locale='en' messages={messages}>
            <AuthorOfField
              authorOf={{
                members: [mockThing],
                offset: 0,
                totalCount: 1
              }}
              state={{ ...createMockSheetState() }}
            />
          </IntlProvider>
        </ApplicationContextProvider>
      </BrowserRouter>
    )
  }

  test('renders without crashing', () => {
    renderComponent(mockThing)
  })

  test('uses single thumbnail image', () => {
    const testUrl = 'test'
    mockThing.thumbnails = [{ href: testUrl, name: 'test' }]
    renderComponent(mockThing)
    const url = screen.getByTestId(`sqwerl-${SIZES.medium}-thumbnail-image`).getAttribute('src')
    expect(url).toEqual(testUrl)
  })
})
