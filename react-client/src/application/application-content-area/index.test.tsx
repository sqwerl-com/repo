import ApplicationContentArea from './index'
import { BrowserRouter } from 'react-router-dom'
import { ConfigurationType } from 'configuration'
import fetch from 'jest-fetch-mock'
import { FetchArgumentsType, FetcherType } from 'fetcher'
import { IntlProvider } from 'react-intl'
import messages from 'translations/locales/en.json'
import renderer from 'react-test-renderer'

const testConfiguration: ConfigurationType = {
  anonymousUserId: 'guest@sqwerl.com',
  anonymousUserName: 'guest',
  applicationName: 'sqwerl',
  basePath: '/app/',
  baseUrl: '/sqwerl/Main',
  catalogLibraryName: 'catalog',
  defaultLibraryId: '/types/libraries/Main',
  defaultLibraryName: 'Main',
  homeId: '/types/views/initial',
  VERSION: '0.1.2'
}

const testFetcher: FetcherType = {
  postData: (fetchArguments: FetchArgumentsType, data: string): void => {
    console.trace(`fetchArguments: ${fetchArguments}`)
    console.trace(`data: ${data}`)
  },
  requestData: async (fetchArguments: FetchArgumentsType, dataType?: string) => {
    console.trace(`fetchArguments: ${fetchArguments}`)
    console.trace(`data: ${dataType}`)
    return await new Promise(() => '')
  }
}

it('renders without crashing', () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      children: {
        totalCount: 2,
        offset: 0,
        limit: 10,
        members: [
          {
            id: '/types/collections',
            isSummary: true,
            name: 'Collections of things',
            path: '/Types/Collections of things',
            shortDescription: 'Named collections of related things.',
            childrenCount: 14,
            isType: true
          },
          {
            id: '/types',
            isSummary: true,
            name: 'Types of things',
            path: '/Types of things',
            shortDescription:
              'Types of things. For example, books, people, collections, and web pages are different types of things.',
            childrenCount: 21,
            isType: true
          }
        ]
      },
      path: '/Types/Views/Home',
      href: 'http://localhost:6719/sqwerl/Main/types/views/initial',
      id: '/types/views/initial'
    })
  )
  fetch.mockResponseOnce(
    JSON.stringify({
      description: 'Tom Carroll\'s library',
      name: 'Tcarroll',
      recentChanges: [
        {
          by: 'Tom Carroll',
          changesCount: 10,
          date: 'Sun Aug 26 2018 23:22:46 GMT-0600 (MDT)',
          hasMoreThanOne: true,
          id: '76e10853921798bb3d7607cbc3a39d0f7198f06b'
        },
        {
          by: 'Tom Carroll',
          changesCount: 4,
          date: 'Sun Aug 19 2018 22:41:41 GMT-0600 (MDT)',
          hasMoreThanOne: true,
          id: 'e5b7dee6cb31c56ea169f70052aba0577f828e2c'
        },
        {
          by: 'Tom Carroll',
          changesCount: 8,
          date: 'Sun Aug 19 2018 00:27:44 GMT-0600 (MDT)',
          hasMoreThanOne: true,
          id: 'eeab290beebb60a6550e332133c71136b824b614'
        },
        {
          by: 'Tom Carroll',
          changesCount: 8,
          date: 'Sat Aug 18 2018 22:47:37 GMT-0600 (MDT)',
          hasMoreThanOne: true,
          id: '37f123400e2d5035024a118ce9b10ffe282117f4'
        },
        {
          by: 'Tom Carroll',
          changesCount: 6,
          date: 'Sun Aug 12 2018 01:21:35 GMT-0600 (MDT)',
          hasMoreThanOne: true,
          id: 'dafd9c0f54cdccf836b8cf36deaeb078d47b31e5'
        }
      ],
      thingCount: 3062,
      canRead: { limit: 10, offset: 0, totalCount: 0 },
      canWrite: {
        limit: 10,
        offset: 0,
        totalCount: 1,
        members: [
          {
            href: 'http://localhost:6719/sqwerl/Main/types/users/tcarroll',
            id: '/types/users/tcarroll',
            name: 'Tom Carroll',
            path: '/Types/Users/Tom Carroll',
            position: 1
          }
        ]
      },
      addedOn: '2012-04-13T00:00:00.00-07:00',
      addedBy: {
        href: 'http://localhost:6719/sqwerl/Main/types/users/Administrator',
        id: '/types/users/Administrator',
        name: 'Administrator',
        path: '/Types/Users/Administrator',
        addedByCount: 49
      },
      owner: {
        href: 'http://localhost:6719/sqwerl/Main/types/users/tcarroll',
        id: '/types/users/tcarroll',
        name: 'Tom Carroll',
        path: '/Types/Users/Tom Carroll',
        ownsCount: 3053
      },
      path: '/Types/Libraries/Main',
      shortDescription: 'The things that people smart',
      href: 'http://localhost:6719/sqwerl/Main/types/libraries/Main',
      id: '/types/libraries/Main'
    })
  )
  renderer.create(
    <BrowserRouter>
      <IntlProvider locale='en' messages={messages}>
        <ApplicationContentArea
          configuration={testConfiguration}
          currentLibraryName='test'
          dividerPercentage={40}
          dividerWidthInPixels={10}
          fetcher={testFetcher}
          hasLastSignedInDateTime={false}
          isUserSignedIn={false}
          popPath={() => {}}
          setPath={() => {}}
          showProperties={() => {}}
          userLastSignedInDateTime=''
          userName=''
        />
      </IntlProvider>
    </BrowserRouter>)
})
