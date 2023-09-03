import { IntlProvider } from 'react-intl'
import LinkUrlBuilder from 'sheets/components/link-url-builder'
import messages from 'translations/locales/en.json'
import { mockApplicationContext } from '../../../utils/mocks'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <div>{LinkUrlBuilder(mockApplicationContext, '', '', '', '')}</div>
    </IntlProvider>
  )
})
