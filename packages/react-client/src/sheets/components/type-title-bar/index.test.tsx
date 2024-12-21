import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockApplicationConfiguration, mockThing } from '@/utils/mocks'
import React from 'react'
import { render } from '@testing-library/react'
import TypeTitleBar from '@/sheets/components/type-title-bar'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <TypeTitleBar
        configuration={mockApplicationConfiguration}
        childrenCount={0}
        icon=''
        iconDescription=''
        thing={mockThing}
        titleTextId='testId'
        titleTextValues={{}}
      />
    </IntlProvider>
  )
})
