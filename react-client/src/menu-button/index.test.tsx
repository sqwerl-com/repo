import { IntlProvider } from 'react-intl'
import MenuButton from 'menu-button'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <MenuButton
        className=''
        isEnabled
        onClick={() => {}}
        titleId='createAccountMenu.title'
        tooltipTextId='createAccountMenu.tooltipText'
      />
    </IntlProvider>
  )
})
