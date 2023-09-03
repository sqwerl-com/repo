import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockApplicationConfiguration, mockThing } from 'utils/mocks'
import renderer from 'react-test-renderer'
import TypeTitleBar from 'sheets/components/type-title-bar'

it('renders without crashing', () => {
  renderer.create(
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
