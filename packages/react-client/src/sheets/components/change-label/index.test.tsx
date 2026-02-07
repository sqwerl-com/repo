import ChangeLabel from '@/sheets/components/change-label'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

const mockChangeDescription = {
  date: '',
  href: '',
  id: '',
  isCollection: false,
  name: '',
  path: '',
  typeId: '',
  typeOfChange: ''
}

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <ChangeLabel
        change={mockChangeDescription}
        index={0}
        showPath
      />
    </IntlProvider>
  )
})
