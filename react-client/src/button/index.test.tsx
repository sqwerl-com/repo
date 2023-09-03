import { BrowserRouter } from 'react-router-dom'
import Button from 'button'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <Button
          ariaLabelId=''
          className=''
          iconId=''
          onClick={() => {}}
          renderIcon={() => {}}
          role='button'
          titleId='button.text'
          tooltipTextId=''
        />
      </IntlProvider>
    </BrowserRouter>)
})
