import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import renderer from 'react-test-renderer'
import RepositoryChanges from '@/sheets/components/repository-changes'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <RepositoryChanges changes={[]} offset={0} state={createMockSheetState()} />
    </IntlProvider>
  )
})
