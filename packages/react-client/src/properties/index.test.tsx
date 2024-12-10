import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import { mockApplicationConfiguration, mockThing } from '@/utils/mocks'
import Properties from '@/properties'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <Properties
        configuration={mockApplicationConfiguration}
        contributorLastSignedInDateTime=''
        contributorName='Testly Tester'
        currentRepositoryName='test'
        fetcher={{
          postData: () => {},
          requestData: async () => { return await new Promise(() => { }) }
        }}
        isContributorSignedIn
        isHome={false}
        hasLastSignedInDateTime
        navigate={() => {}}
        setThing={() => {}}
        showProperties={() => {}}
        thing={mockThing}
      />
    </IntlProvider>
  )
})
