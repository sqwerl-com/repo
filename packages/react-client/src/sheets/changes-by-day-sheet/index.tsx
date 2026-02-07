/* global HTMLDivElement, HTMLElement */

import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { ChevronLeft, Edit3, HelpCircle, PlusSquare, Trash2 } from 'react-feather'
import { ConfigurationType } from '@/configuration'
import { evenOrOddClassName } from '@/utilities/css/even-or-odd-class-name'
import { FetcherType } from '@/fetcher'
import { HasPictureData, RepositoryChangeDescription, RepositoryChangeType } from '@/utilities/types'
import InfiniteLoader from 'react-window-infinite-loader'
import { IntlShape, useIntl } from 'react-intl'
import { linkTargetToCollection, linkTargetToLeaf } from '@/utilities/formatters/link-target'
import { ListChildComponentProps, VariableSizeList } from 'react-window'
import LoggerFactory from '@/logger'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { renderTitleWithMultipleAuthors, renderTitleWithSingleAuthor } from '@/sheets/components/changes-by-day-title'
import type { SheetProps, SheetState } from '@/properties'
import ThumbnailImage, { SIZES } from '@/utilities/components/thumbnail-image.tsx'
import { useContext } from 'react'

/**
 * Item within a list of changes made to a repository of things.
 */
interface ItemType extends HasPictureData {
  change: RepositoryChangeDescription | null
  isLoading: boolean
}

/**
 * State to keep track of while loading information changes made to a repository of things.
 */
interface LoadingState {
  fetcher: FetcherType
  changeIds: string[]
  href: string
  isLoadingChanges: boolean
  items: ItemType[]
  list: VariableSizeList<RowData>
  loadingOffsets: Map<string, string>
  setIsLoadingChanges: (isLoading: boolean) => void
  setItems: (items: ItemType[]) => void
}

/**
 * Data required in order to render a list of changes made to a repository of things.
 */
interface RowData {
  configuration: ConfigurationType
  context: ApplicationContextType
  currentRepositoryName: string
  intl: IntlShape
  isLoadingChanges: boolean
  items: ItemType[]
  navigate: NavigateFunction
  offset: number
}

/**
 * Renders a read-only form that displays information about changes made to a repository of things at the same time.
 * Renders a read-only property sheet with hyperlinks to the things that were changed in a single commit.
 * @param props
 */
const ChangesByDaySheet: (props: SheetProps) => React.JSX.Element = (props: SheetProps): React.JSX.Element => {
  const context = useContext(ApplicationContext)
  const { state } = props
  const { configuration, currentRepositoryName, fetcher, thing } = state
  const logger = loggerFactory.create(ChangesByDaySheet)
  const [rowHeightInPixels] = useState(context.rowHeightInPixels)
  const [scrollAreaHeight, setScrollAreaHeight] = useState(100)
  const [scrollViewElement, setScrollViewElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    determineScrollAreaHeight(scrollViewElement, rowHeightInPixels, setScrollAreaHeight)
    const resizeListener = () => determineScrollAreaHeight(scrollViewElement, rowHeightInPixels, setScrollAreaHeight)
    window.addEventListener('resize', resizeListener)
    return () => window.removeEventListener('resize', resizeListener)
  }, [rowHeightInPixels, scrollViewElement])

  useEffect(() => {
    if ((changes !== undefined) && (changes.length > 0)) {
      const newItems: ItemType[] = changes[0].members.map((change) => {
        return {
          change,
          isLoading: false
        }
      })

      for (let i = changes[0].members.length; i < changes[0].totalCount; i++) {
        newItems.push({ change: null, isLoading: true })
      }

      setItems(newItems)
    }
  }, [])

  const navigate = useNavigate()
  const intl = useIntl()
  const [isLoadingChanges, setIsLoadingChanges] = useState<boolean>(true)
  const [items, setItems] = useState<ItemType[]>([])
  const [loadingOffsets] = useState<Map<string, string>>(new Map<string, string>())

  logger.info('Render Changes by Day property sheet')

  if ((thing === null)) {
    return (<></>)
  }

  const { changes, commits, id } = thing
  const changedBy = new Set()

  if (changes.length > 0) {
    let count = 0

    changes.forEach((change, index) => {
      changedBy.add(change.by)
      count += changes[index].totalCount
    })

    const date = new Date(changes[0].date)
    const shouldShowRelativeTime = context.shouldShowRelativeTime(date)
    const distanceInTimeText = shouldShowRelativeTime ? context.distanceInTimeText(date) : ''
    let list: VariableSizeList<RowData>

    return (
      <>
        <header className='sqwerl-properties-title-bar'>
          <div className='sqwerl-properties-title-bar-title'>
            <button
              className='sqwerl-property-sheet-title-bar-back-button'
              onClick={() => goBack(navigate, state)}
            >
              <ChevronLeft />
            </button>
            {(changedBy.size === 1) &&
              renderTitleWithSingleAuthor(
                changedBy.keys().next().value as string || '',
                count,
                date,
                shouldShowRelativeTime,
                distanceInTimeText,
                intl)}
            {(changedBy.size > 1) &&
              renderTitleWithMultipleAuthors(
                changedBy.size, changes[0].totalCount, date, shouldShowRelativeTime, distanceInTimeText, intl)}
          </div>
        </header>
        <div className='sqwerl-list-view' ref={setScrollViewElement}>
          <InfiniteLoader
            isItemLoaded={(index: number) => !items[index]?.isLoading}
            itemCount={items ? items.length : 0}
            loadMoreItems={(startIndex: number, stopIndex: number): Promise<void> | void =>
              loadMoreChanges(
                startIndex,
                stopIndex, {
                  fetcher,
                  changeIds: commits || '',
                  href: configuration.baseUrl + id,
                  isLoadingChanges,
                  items,
                  list,
                  loadingOffsets,
                  setIsLoadingChanges,
                  setItems
                }
              )
            }
          >
            {({ onItemsRendered, ref }) => {
            return (
              <VariableSizeList
                className='sqwerl-repository-changes-by-day-list'
                estimatedItemSize={rowHeightInPixels}
                height={scrollAreaHeight}
                itemCount={items ? items.length : 0}
                itemData={{
                  configuration,
                  context,
                  currentRepositoryName,
                  intl,
                  isLoadingChanges,
                  items,
                  navigate,
                  offset: 0
                }}
                itemSize={itemIndex => rowHeightInPixels}
                onItemsRendered={onItemsRendered}
                overscanCount={Math.floor(scrollAreaHeight / 50)}
                ref={(variableSizeList: VariableSizeList<RowData>) => {
                  if (typeof ref === 'function') {
                    ref(variableSizeList)
                  }
                  list = variableSizeList
                }}
                width='100%'
              >
                {Row}
              </VariableSizeList>
            )
          }}
          </InfiniteLoader>
        </div>
      </>
    )
  } else {
    return (<></>)
  }
}

/**
 * Invokes the given state setter function to set the scroll area's height (in pixels).
 * @param element  A scroll area HTML element.
 * @param itemSizeInPixels Default height, in pixels, for rows within the scroll area.
 * @param setScrollViewHeight Sets the scroll area's height (in pixels).
 */
const determineScrollAreaHeight = (
  element: HTMLElement | null,
  itemSizeInPixels: number,
  setScrollViewHeight: (height: number) => void
): void => {
  if (element != null) {
    setScrollViewHeight(
      element.clientHeight -
        element.getBoundingClientRect()?.top +
          (element.parentElement?.getBoundingClientRect().top ?? 0)
    )
  }
}

const goBack = (navigate: NavigateFunction, state: SheetState) => {
  const { setAnimationState, setThing } = state

  navigate(-1)
  setThing(null)
  setAnimationState('slide-right')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

let pending: number

const loadMoreChanges = (startIndex: number, stopIndex: number, state: LoadingState): Promise<void> | void => {
  const {
    changeIds,
    fetcher,
    href,
    items,
    list,
    loadingOffsets,
    setIsLoadingChanges,
    setItems
  } = state
  setIsLoadingChanges(true)

  if (pending) {
    clearTimeout(pending)
  }

  pending = window.setTimeout(async () => {
    setIsLoadingChanges(true)
    const url = `${href}?ids=${changeIds}&limit=${stopIndex - startIndex}&offset=${startIndex}`

    if (loadingOffsets.has(url)) {
      return await new Promise<void>(() => [])
    }

    loadingOffsets.set(url, '')

    return await new Promise<void>((resolve) => {
      fetcher.requestData({
        dontSetBusy: true,
        url
      }).then((response: Response) => {
        setIsLoadingChanges(false)
        loadingOffsets.delete(url)

        if (response.status === 200) {
          response.json().then((data) => {

            if (data && data.changes) {
              const newItems = items.map(item => { return { ...item } })
              data.changes.forEach((change: RepositoryChangeType) => {
                change.members.forEach((member: RepositoryChangeDescription, index: number) => {
                  const itemIndex = (startIndex || 0) + index
                  newItems[itemIndex] = { change: member, isLoading: false }
                })
              })

              setItems(newItems)
              list?.resetAfterIndex(startIndex)
              resolve()
            }
          })
        } else {
          loadingOffsets.delete(url)
          onFetchingChangesFailed(response, state)
        }
      }, (reason: Response) => {
        loadingOffsets.delete(url)
        onFetchingChangesFailed(reason, state)
      })
    })
  }, 500)
}

const onFetchingChangesFailed = (response: Response, state: LoadingState) => {
  const { setIsLoadingChanges } = state
  setIsLoadingChanges(false)
}

/**
 * Renders a list item that describes a change made to a repository of things the change information is
 * currently being retrieved from a server.
 * @param intl Internationalization support.
 * @param index The row's index.
 * @param indexColumnWidth CSS class name that controls the width of the rows's first column.
 * @param style The row's CSS styles.
 */
const renderLoadingItem = (intl: IntlShape, index: number, indexColumnWidth: string, style: object) => {
  return (
    <div className={`sqwerl-navigation-loading-item ${evenOrOddClassName(index)}`} key={index} style={style}>
      <span className="sqwerl-navigation-item-ordinal">{intl.formatNumber(index + 1)}</span>
      <span className='sqwerl-navigation-loading-item-title' data-key={index} />
    </div>
  )
}

/**
 * Returns HTML content to display to indicate the type of change made to a thing.
 * @param intl Internationalization.
 * @param typeOfChangeId Uniquely identifies a type of change made to a thing.
 * @returns HTML content.
 */
const renderTypeOfChange = (intl: IntlShape, typeOfChangeId: string) => {
  const render = (text: string, icon: () => React.JSX.Element) => {
    return (<>&nbsp;{text}</>)
  }

  switch (typeOfChangeId.toLowerCase()) {
    case 'added':
      return render(
        intl.formatMessage({ id: 'typeOfChange.added' }), () => <PlusSquare/>)

    case 'modified':
      return render(intl.formatMessage({ id: 'typeOfChange.modified' }), () => <Edit3/>)

    case 'removed':
      return render(intl.formatMessage({ id: 'typeOfChange.deleted' }), () => <Trash2/>)

    default:
      return render(intl.formatMessage({ id: 'typeOfChange.unknown' }), () => <HelpCircle/>)
  }
}

const Row = (props: ListChildComponentProps<RowData>): React.JSX.Element => {
  const { index, style } = props
  const {
    configuration, context, currentRepositoryName, intl, isLoadingChanges, items, navigate, offset
  } = props.data
  const item = items[index]
  const indexColumnWidth = `columns-${Math.min(6, Math.round(Math.log10(items.length)) + 1)}`

  if ((item?.change == null) || item?.isLoading) {
    return (renderLoadingItem(intl, index, indexColumnWidth, style))
  }

  const { id, isCollection, typeId, typeOfChange } = item.change
  const wasRemoved = typeOfChange === 'removed'
  const linkTarget =
    wasRemoved
      ? undefined
      : isCollection
        ? linkTargetToCollection(id, configuration, context, currentRepositoryName)
        : linkTargetToLeaf(id, configuration, context, currentRepositoryName)
  const multiline = isCollection && context.shouldShowPath(id) ? 'multiline' : ''

  return (
    <div
      className={`sqwerl-navigation-item ${evenOrOddClassName(index)}`}
      style={style}
    >
      <Link
        className='sqwerl-navigation-parent-item double-height'
        data-id={item.change.id}
        data-key={index}
        to={linkTarget ?? ''}
      >
        <span className={`sqwerl-navigation-item-ordinal ${indexColumnWidth}`}>
          {intl.formatNumber(index + 1)}
        </span>
        <div className='sqwerl-navigation-item-content'>
          <div className='sqwerl-parent-item-heading'>
            <label className='sqwerl-navigation-item-title ' data-key={index}>
              <div
                className='sqwerl-navigation-item-text'
                data-key={index}>
                <div
                  className='sqwerl-navigation-item-title-text'
                  data-key={index}>
                  {item.change.name ?? ''}
                </div>
              </div>
              <span className='sqwerl-navigation-item-type-name'>
                {context.typeNameToTypeDescription(intl, context.typeIdToTypeName(item.change.typeId ?? ''))}
                {renderTypeOfChange(intl, typeOfChange)}
              </span>
            </label>
          </div>
          <div className='sqwerl-parent-item-details'>
            <div className='sqwerl-navigation-item-icon' data-key={index}>
              <ThumbnailImage depictable={item.change} size={SIZES.medium} typeId={item.change.typeId} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

const typeOfChangeText = (intl: IntlShape, typeOfChange: string) => {
  return intl.formatMessage({ id: `typeOfChange.${typeOfChange}.description` }) ?? ''
}

const loggerFactory = LoggerFactory(ChangesByDaySheet)

export default ChangesByDaySheet
