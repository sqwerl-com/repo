import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import MenuItem from '@/menu-item'
import messages from '@/translations/locales/en.json'
import React from 'react'

describe('Menu item', () => {
  test('renders without crashing', () => {
    render(
      <IntlProvider locale='en' messages={messages}>
        <MenuItem
          hideMenu={() => {}}
          onClick={() => {}}
          subtitleId='feedbackMenuItem.subtitle'
          titleId='feedbackMenuItem.title'
        />
      </IntlProvider>
    )
    cleanup()
  })

  test('clicking on menu item hides menu', async () => {
    const mock = {
      handleClick: () => {},
      onHide: () => {}
    }
    vi.spyOn(mock, 'handleClick')
    vi.spyOn(mock, 'onHide')
    render(
      <IntlProvider locale='en' messages={messages}>
        <MenuItem
          hideMenu={mock.onHide}
          onClick={mock.handleClick}
          subtitleId='feedbackMenuItem.subtitle'
          titleId='feedbackMenuItem.title'
        />
      </IntlProvider>
    )
    const menuItem = screen.getAllByRole('menuitem')[0]
    expect(menuItem).toBeTruthy()
    fireEvent.click(menuItem)
    expect(mock.handleClick).toHaveBeenCalled()
    expect(mock.onHide).toHaveBeenCalled()
    cleanup()
  })
})
