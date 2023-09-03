import { createMockSheetState } from 'sheets/mocks'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import PropertyTitleBar from 'sheets/components/property-title-bar'
import renderer from 'react-test-renderer'
import { mockApplicationConfiguration, mockThing } from 'utils/mocks'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <PropertyTitleBar
        configuration={mockApplicationConfiguration}
        count={1}
        state={createMockSheetState()}
        thing={mockThing}
        thingName='test'
        titleTextId='testId'
        titleTextValues={{}}
      />
    </IntlProvider>
  )
})
