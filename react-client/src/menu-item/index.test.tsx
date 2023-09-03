import { fireEvent, render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import MenuItem from 'menu-item'
import messages from 'translations/locales/en.json'

it('renders without crashing', () => {
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
})

test('clicking on menu item hides menu', () => {
  const onClick = jest.fn()
  const onHide = jest.fn()
  render(
    <IntlProvider locale='en' messages={messages}>
      <MenuItem
        hideMenu={onHide}
        onClick={onClick}
        subtitleId='feedbackMenuItem.subtitle'
        titleId='feedbackMenuItem.title'
      />
    </IntlProvider>
  )
  fireEvent.click(screen.getByRole('menuitem'))
  expect(onClick).toBeCalled()
  expect(onHide).toBeCalled()
})
