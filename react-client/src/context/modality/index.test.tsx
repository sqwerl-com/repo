import { ModalityContext, ModalityProvider } from 'context/modality'
import renderer from 'react-test-renderer'
import { useContext } from 'react'

const TestComponent = () => {
  const isModal = useContext(ModalityContext)
  expect(isModal).toBeTruthy()
  return (<div />)
}

it('renders without crashing', () => {
  renderer.create(
    <ModalityProvider>
      <TestComponent />
    </ModalityProvider>
  )
})
