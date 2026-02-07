import { expect, it } from 'vitest'
import { CurrentThemeContext, CurrentThemeProvider } from '@/context/current-theme'
import React, { useContext } from 'react'
import { render } from '@testing-library/react'

const TEST_THEME = 'theme'

const TestComponent = (): React.JSX.Element => {
  const themeName = useContext(CurrentThemeContext)

  expect(themeName).toBeTruthy()
  return (<div />)
}

it('renders without crashing', () => {
  render(
    <CurrentThemeProvider themeName={TEST_THEME}>
      <TestComponent />
    </CurrentThemeProvider>
  )
})
