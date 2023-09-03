import { IntlProvider } from 'react-intl'
import IsThingOfType from 'sheets/components/is-thing-of-type'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <IsThingOfType typeName='' />
    </IntlProvider>
  )
})
