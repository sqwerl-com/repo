import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'
import ScrollableContent from 'sheets/components/scrollable-content'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ScrollableContent />
    </IntlProvider>
  )
})
