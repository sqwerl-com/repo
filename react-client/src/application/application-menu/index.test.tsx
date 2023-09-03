import ApplicationMenu from 'application/application-menu'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ApplicationMenu name='' isVisible={false} />)
    </IntlProvider>
  )
})
