import { IntlProvider } from 'react-intl'
import BusyPane from 'busy-pane'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <BusyPane
        isVisible={false}
        name='testBusyPane'
      />
    </IntlProvider>
  )
})
