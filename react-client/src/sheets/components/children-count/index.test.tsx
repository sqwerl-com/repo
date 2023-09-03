import ChildrenCount from 'sheets/components/children-count'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import { mockThing } from 'utils/mocks'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ChildrenCount count={1} thing={mockThing} />
    </IntlProvider>
  )
})
