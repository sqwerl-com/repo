import { BrowserRouter } from 'react-router-dom'
import Button from '@/button'
import { describe, expect, it } from 'vitest'
import { IntlProvider } from 'react-intl'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Button', async () => {
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
      </BrowserRouter>
    )

    const element = screen.getByTestId('button')
    expect(element.classList).toContain('sqwerl-button')
  })
})
