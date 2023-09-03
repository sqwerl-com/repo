import { IntlProvider } from 'react-intl'
import IsTypeOfThing from 'sheets/components/is-type-of-thing'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <IsTypeOfThing />
    </IntlProvider>
  )
})
