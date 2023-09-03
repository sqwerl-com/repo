import { ApplicationContextProvider, ApplicationState } from 'context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from 'sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockThing } from 'utils/mocks'
import PictureField from 'sheets/components/fields/picture-field'
import React from 'react'
import renderer from 'react-test-renderer'

const render = (sizeName: string) => {
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <PictureField
            fieldTitle='testFieldTitle'
            pictures={{
              members: [mockThing],
              offset: 0,
              totalCount: 1
            }}
            size={sizeName}
            state={{ ...createMockSheetState() }}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
}

it('renders without crashing', () => {
  // TODO - For each call to render, test the rendered pictures' widths and heights.
  render('small')
  render('medium')
  render('large')
})
