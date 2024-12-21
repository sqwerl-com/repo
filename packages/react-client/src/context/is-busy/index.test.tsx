import { expect, it } from 'vitest'
import { IsBusyContext, IsBusyProvider } from '@/context/is-busy'
import React, { useContext } from 'react'
import { render } from '@testing-library/react'

const TestComponent = (): React.JSX.Element => {
  const isBusy = useContext(IsBusyContext)

  expect(isBusy).toBeTruthy()
  return (<div />)
}

it('renders without crashing', () => {
  render(
    <IsBusyProvider>
      <TestComponent />
    </IsBusyProvider>
  )
})
