import { ApplicationContextProvider, ApplicationState } from '@/context/application'
import { BrowserRouter } from 'react-router-dom'
import { createMockSheetState } from '@/sheets/mocks'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockThing } from '@/utils/mocks'
import PostsField from '@/sheets/components/fields/posts-field'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  mockThing.path = '/1/2/3/4'
  renderer.create(
    <BrowserRouter>
      <ApplicationContextProvider value={ApplicationState}>
        <IntlProvider locale='en' messages={messages}>
          <PostsField
            posts={{
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
