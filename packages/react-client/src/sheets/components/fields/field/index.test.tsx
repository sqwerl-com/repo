import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import Field from '@/sheets/components/fields/field'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockSheetState } from '@/sheets/mocks'
import { mockThing } from '@/utils/mocks'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <Field
            collection={{ members: [mockThing, mockThing], offset: 0, totalCount: 1 }}
            property='testProperty'
            fieldLabel='testLabel'
            createLink={() => { return (<></>)}}
            state={mockSheetState}
          />
        </IntlProvider>
      </ApplicationContextProvider>
    </BrowserRouter>
  )
})
