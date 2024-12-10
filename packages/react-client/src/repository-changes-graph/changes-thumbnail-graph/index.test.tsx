import ChangesThumbnailGraph from './index'
import { IntlProvider } from 'react-intl'
import { it } from 'vitest'
import messages from '@/translations/locales/en.json'
import React from 'react'
import { render } from '@testing-library/react'
import { RepositoryShape, Thing } from '@/utils/types'

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

  render(
    <IntlProvider locale='en' messages={messages}>
      <ChangesThumbnailGraph change={change as Thing} index={0} timestamp="2024-01-06T00:00:00.00" width='32' />
    </IntlProvider>
  )
})

it('renders with no changes', () => {
  const change: RepositoryShape = { recentChanges: [], thingCount: 0 }

  render(
    <IntlProvider locale='en' messages={messages}>
      <ChangesThumbnailGraph change={change as Thing} index={0} timestamp="2024-01-06T00:00:00.00" width='32' />
    </IntlProvider>
  )
})
