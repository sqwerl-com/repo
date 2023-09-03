import { IsBusyContext, IsBusyProvider } from 'context/is-busy'
import renderer from 'react-test-renderer'
import { useContext } from 'react'

const TestComponent = () => {
  const isBusy = useContext(IsBusyContext)
  expect(isBusy).toBeTruthy()
  return (<div />)
}

it('renders without crashing', () => {
  renderer.create(
    <IsBusyProvider>
      <TestComponent />
    </IsBusyProvider>
  )
})
