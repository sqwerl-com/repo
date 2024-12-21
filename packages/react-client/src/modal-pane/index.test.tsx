import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import ModalPane from '@/modal-pane'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
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
