import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockApplicationConfiguration, mockSheetState, mockThing } from '@/utils/mocks'
import React from 'react'
import renderer from 'react-test-renderer'
import TitleBar from '@/sheets/components/title-bar'

it('renders without crashing', () => {
  renderer.create(
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
