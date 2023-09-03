import { IntlProvider } from 'react-intl'
import LibraryChanges from 'sheets/components/library-changes'
import messages from 'translations/locales/en.json'
import { createMockSheetState } from 'sheets/mocks'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <LibraryChanges changes={[]} offset={0} state={createMockSheetState()} />
    </IntlProvider>
  )
})
