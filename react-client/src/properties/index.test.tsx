import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockApplicationConfiguration, mockThing } from 'utils/mocks'
import Properties from 'properties'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <Properties
        configuration={mockApplicationConfiguration}
        currentLibraryName='test'
        fetcher={{
          postData: (fetchArguments, data) => {},
          requestData: async (fetchArguments, dataType) => { return await new Promise(() => { }) }
        }}
        isUserSignedIn
        hasLastSignedInDateTime
        setThing={() => {}}
        showProperties={() => {}}
        thing={mockThing}
        userLastSignedInDateTime=''
        userName='Testly Tester'
      />
    </IntlProvider>
  )
})
