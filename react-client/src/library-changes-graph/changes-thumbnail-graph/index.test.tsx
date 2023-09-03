import ChangesThumbnailGraph from './index'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  const recentChanges = []
  let changeTime = new Date().getTime()
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000
  for (let i = 25; i > 0; i--) {
    recentChanges.push({
      changesCount: Math.random() * 30,
      date: new Date(changeTime).toISOString()
    })
    changeTime -= oneDayInMilliseconds
  }
  const change = { recentChanges }
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ChangesThumbnailGraph change={change as any} index={0} width='32' />
    </IntlProvider>
  )
})

it('renders with no changes', () => {
  const change = {
    recentChanges: null
  }
  renderer.create(
    <IntlProvider locale='en' messages={messages}>
      <ChangesThumbnailGraph change={change as any} index={0} width='32' />
    </IntlProvider>
  )
})
