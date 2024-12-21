import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import MenuButton from '@/menu-button'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
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
