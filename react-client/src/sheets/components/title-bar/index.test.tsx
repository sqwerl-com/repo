import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockApplicationConfiguration, mockThing } from 'utils/mocks'
import renderer from 'react-test-renderer'
import TitleBar from 'sheets/components/title-bar'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <TitleBar
        configuration={mockApplicationConfiguration}
        connectionProperties={[]}
        icon=''
        iconDescription=''
        thing={mockThing}
        titleTextId='testId'
        titleTextValues={{}}
      />
    </IntlProvider>
  )
})
