import ChangeLabel from 'sheets/components/change-label'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

const mockChangeDescription = {
  date: '',
  href: '',
  id: '',
  isCollection: false,
  name: '',
  path: '',
  typeId: '',
  typeOfChange: ''
}

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ChangeLabel
        change={mockChangeDescription}
        index={0}
        isLinkToCollection={false}
        showPath
      />
    </IntlProvider>
  )
})
