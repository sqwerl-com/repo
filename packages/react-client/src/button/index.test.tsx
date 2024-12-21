import { BrowserRouter } from 'react-router-dom'
import Button from '@/button'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'

it('renders without crashing', () => {
  render(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <Button
          ariaLabelId=''
          className=''
          iconId=''
          onClick={() => {}}
          renderIcon={() => <></>}
          role='button'
          titleId='button.text'
          tooltipTextId=''
        />
      </IntlProvider>
    </BrowserRouter>)
})
