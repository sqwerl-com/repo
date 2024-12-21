import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'
import RepositoryChanges from '@/sheets/components/repository-changes'

it('renders without crashing', () => {
  render(
    <IntlProvider locale='en' messages={messages}>
      <RepositoryChanges changes={[]} offset={0} state={createMockSheetState()} />
    </IntlProvider>
  )
})
