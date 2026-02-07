import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockApplicationConfiguration, mockSheetState, mockThing } from '@/utilities/mocks'
import React from 'react'
import { render } from '@testing-library/react'
import TitleBar from '@/sheets/components/title-bar'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <TitleBar
        configuration={mockApplicationConfiguration}
        connectionProperties={[]}
        icon=''
        iconDescription=''
        state={mockSheetState}
        thing={mockThing}
        titleTextId='testId'
        titleTextValues={{}}
      />
    </IntlProvider>
  )
})
