import { expect, it } from 'vitest'
import { ModalityContext, ModalityProvider } from '@/context/modality'
import React from 'react'
import { render } from '@testing-library/react'
import { useContext } from 'react'

const TestComponent = () => {
  const isModal = useContext(ModalityContext)
  expect(isModal).toBe(false)

  return (<div />)
}

it('renders without crashing', () => {
  render(
    <ModalityProvider>
      <TestComponent />
    </ModalityProvider>
  )
})
