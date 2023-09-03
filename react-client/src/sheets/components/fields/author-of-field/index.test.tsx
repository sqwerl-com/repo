import { ApplicationContextProvider, ApplicationState } from 'context/application'
import AuthorOfField from 'sheets/components/fields/author-of-field'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from 'sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockThing } from 'utils/mocks'
import React from 'react'
import { render, screen } from '@testing-library/react'

it('renders without crashing', () => {
  render(
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
})

it('uses single thumbnail image', () => {
  const testUrl = 'test'
  mockThing.thumbnails = [{ href: testUrl }]
  render(
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
  const url = screen.getByTestId('sqwerl-thumbnail').getAttribute('src')
  expect(url).toEqual(testUrl)
})

it('uses the medium thumbnail image', () => {
  const mediumUrl = 'mediumUrl'
  mockThing.thumbnails = [{
    href: 'largeUrl', name: 'large-thumbnail'
  }, {
    href: mediumUrl, name: 'medium-thumbnail.jpg'
  }, {
    href: 'smallUrl', name: 'small-thumbnail.jpg'
  }]
  render(
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
  const url = screen.getByTestId('sqwerl-thumbnail').getAttribute('src')
  expect(url).toEqual(mediumUrl)
})
