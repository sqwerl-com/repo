import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import ModalPane from 'modal-pane'
import React from 'react'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ModalPane
        isClickable
        isVisible={false}
        name='testModalPane'
        onClick={() => {}}
      />
    </IntlProvider>
  )
})
