import { IntlProvider } from 'react-intl'
import OpenInNewTabOrWindowLink from 'sheets/components/open-in-new-tab-or-window-link'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  const testUrl = 'https://www.sqwerl.com'
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <OpenInNewTabOrWindowLink url={testUrl} />
    </IntlProvider>
  )
})
