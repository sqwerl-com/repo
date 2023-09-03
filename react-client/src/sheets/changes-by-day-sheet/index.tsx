/* global HTMLDivElement, HTMLElement, JSX, location */

import { ApplicationContextType } from 'context/application'
import ChangeLabel from 'sheets/components/change-label'
import { ChevronLeft, Edit3, HelpCircle, PlusSquare, Trash2 } from 'react-feather'
import { ConfigurationType } from 'configuration'
import { FetcherType } from 'fetcher'
import { format } from 'date-fns'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import InfiniteLoader from 'react-window-infinite-loader'
import { LibraryChangeDescription, LibraryChangeType } from 'utils/types'
import LibraryChanges from 'sheets/components/library-changes'
import { linkTargetToCollection, linkTargetToLeaf } from 'utils/formatters/link-target'
import { ListChildComponentProps, VariableSizeList } from 'react-window'
import Logger, { LoggerType } from 'logger'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { renderTitleWithMultipleAuthors, renderTitleWithSingleAuthor } from 'sheets/components/changes-by-day-title'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetProps, SheetState } from 'properties'

let logger: LoggerType

/**
 * Item within a list of changes made to a library of things.
 */
interface ItemType {
  change: LibraryChangeDescription | null
  isLoading: boolean
}

/**
 * State to keep track of while loading information changes made to a library of things.
 */
interface LoadingState {
  fetcher: FetcherType
  changeIds: string[]
  href: string
  items: ItemType[]
  list: VariableSizeList
  loadingOffsets: Map<string, string>
  logger: LoggerType
  setIsLoadingChanges: Function
  setItems: Function
}

/**
 * Data required in order to render rows within a table of changes made to a library of things.
 */
interface RowType {
  configuration: ConfigurationType
  context: ApplicationContextType
  currentLibraryName: string
  intl: IntlShape
  items: ItemType[]
  offset: number
}

/**
 * Renders a read-only form that displays information about changes made to a library of things at the same time.
 * Renders a read-only property sheet with hyperlinks to the things that were changed in a single commit.
 * @param props
 * @constructor
 */
const ChangesByDaySheet: React.FC<SheetProps> = (props: SheetProps): React.JSX.Element => {
  logger = Logger(ChangesByDaySheet, ChangesByDaySheet)
  const { state } = props
  const { configuration, context, currentLibraryName, fetcher, thing } = state
  const [rowHeightInPixels] = useState(context.rowHeightInPixels)
  const [scrollAreaHeight, setScrollAreaHeight] = useState(100)
  const [scrollViewElement, setScrollViewElement] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    determineScrollAreaHeight(scrollViewElement, rowHeightInPixels, setScrollAreaHeight)
  }, [scrollViewElement, rowHeightInPixels])
  useEffect(() => {
    if (changes && (changes.length > 0)) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const navigate = useNavigate()
  const intl = useIntl()
  const [loadingOffsets, _setLoadingOffsets] = useState<Map<string, string>>(new Map<string, string>())
  const [_isLoadingChanges, setIsLoadingChanges] = useState<boolean>(false)
  const [items, setItems] = useState<ItemType[]>([])
  logger.info('Render Changes by Day property sheet')
  if (thing == null) {
    return (<></>)
  }
  const { changes, commits, id } = thing
  const changeGroups: JSX.Element[] = []
  const changedBy = new Set()
  if (thing && changes && (changes.length > 0)) {
    let count = 0
    changes.forEach((change, index) => {
      const numberOfChangesAtTimeTitle =
        intl.formatMessage({
          id: 'librariesSheet.numberChangesAtTimeTitle'
        },
        {
          count: changes[index].totalCount,
          countEndTag: '</span>',
          countStartTag: '<span class="sqwerl-read-only-field-label-count">',
          time: format(new Date(change.date), 'h:mm a')
        })
      if (changes.length > 1) {
        changeGroups.push(
          <div
            className='sqwerl-library-changes-details-time'
            dangerouslySetInnerHTML={{ __html: numberOfChangesAtTimeTitle }}
            key={`changes-per-commit-${index}`}
          />)
      }
      changedBy.add(change.by)
      const indexColumnWidth = `columns-${Math.min(6, Math.round(Math.log10(items.length) + 1))}`
      changeGroups.push(
        <table className='sqwerl-properties-table sqwerl-library-changes-by-day-table' key={index}>
          <thead>
            <tr className='sqwerl-properties-table-heading sqwerl-library-changes-by-day-table-heading'>
              <th className={`sqwerl-properties-table-index-column ${indexColumnWidth}`} />
              <th
                className='sqwerl-library-changes-by-day-table-name-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.nameColumn.tooltip' })}
              >
                <FormattedMessage id='homeSheet.detailsTable.nameColumn.text' />
              </th>
              <th
                className='sqwerl-library-changes-by-day-thing-type-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.nameColumn.tooltip' })}
              >
                <FormattedMessage id='homeSheet.detailsTable.typeColumn.text' />
              </th>
              <th
                className='sqwerl-library-changes-by-day-change-type-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.typeOfChangeColumn.tooltip' })}
              >
                <FormattedMessage id='homeSheet.detailsTable.typeOfChangeColumn.text' />
              </th>
            </tr>
          </thead>
          <tbody key={index}>
            <LibraryChanges
              changes={change.members}
              key={index}
              offset={count}
              state={state}
            />
          </tbody>
        </table>)
      count += changes[index].totalCount
    })
    const date = new Date(changes[0].date)
    const shouldShowRelativeTime = context.shouldShowRelativeTime(date)
    const distanceInTimeText = shouldShowRelativeTime ? context.distanceInTimeText(date) : ''
    const indexColumnWidth = `columns-${Math.min(6, Math.round(Math.log10(items.length)) + 1)}`
    let list: any = null
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
                changedBy.keys().next().value || '',
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
        <table className='sqwerl-properties-table sqwerl-library-changes-by-day-table'>
          <thead>
            <tr className='sqwerl-properties-table-heading sqwerl-library-changes-by-day-table-heading'>
              <th className={`sqwerl-library-changes-by-day-index-column ${indexColumnWidth}`} />
              <th
                className='sqwerl-library-changes-by-day-table-name-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.nameColumn.tooltip' })}
              >
                <span className='sqwerl-library-changes-by-day-table-name-column-text'>
                  <FormattedMessage id='librariesSheet.detailsTable.nameColumn.text' />
                </span>
              </th>
              <th
                className='sqwerl-library-changes-by-day-thing-type-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.typeColumn.tooltip' })}
              >
                <span className='sqwerl-library-changes-by-day-table-thing-type-column-text'>
                  <FormattedMessage id='librariesSheet.detailsTable.typeColumn.text' />
                </span>
              </th>
              <th
                className='sqwerl-library-changes-by-day-change-type-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.typeOfChangeColumn.tooltip' })}
              >
                <span className='sqwerl-library-changes-by-day-table-change-type-column-text'>
                  <FormattedMessage id='librariesSheet.detailsTable.typeOfChangeColumn.text' />
                </span>
              </th>
            </tr>
          </thead>
          <ScrollableContent>
            {/* TODO - Style contains 'magic numbers'. Can we insert these numbers rather than hard-code them? */}
            <tbody
              ref={setScrollViewElement}
              style={{
                bottom: '-2.5rem',
                left: '0',
                maxWidth: '900px',
                minWidth: '500px',
                position: 'absolute',
                top: `${(context.rowHeightInPixels * 2) + 1}px`,
                width: '900px'
              }}
            >
              <InfiniteLoader
                isItemLoaded={(index: number) => !items[index]?.isLoading}
                itemCount={items ? items.length : 0}
                loadMoreItems={(startIndex: number, stopIndex: number): Promise<void> | void =>
                  loadMoreChanges(
                    startIndex,
                    stopIndex,
                    {
                      fetcher,
                      changeIds: commits || '',
                      href: configuration.baseUrl + id,
                      items,
                      list,
                      loadingOffsets,
                      logger,
                      setIsLoadingChanges,
                      setItems
                    })}
              >
                {({ onItemsRendered, ref }) => {
                  return (
                    <VariableSizeList
                      estimatedItemSize={75}
                      height={scrollAreaHeight}
                      itemCount={items ? items.length : 0}
                      itemData={{
                        configuration,
                        context,
                        currentLibraryName,
                        intl,
                        items,
                        offset: 0
                      }}
                      itemSize={itemIndex =>
                        itemHeight(items, itemIndex, context.shouldShowPath(items[itemIndex].change?.id || ''))}
                      onItemsRendered={onItemsRendered}
                      overscanCount={Math.floor(scrollAreaHeight / 50)}
                      ref={(variableSizeList) => {
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
            </tbody>
          </ScrollableContent>
        </table>
      </>
    )
  } else {
    return (<></>)
  }
}

const determineScrollAreaHeight = (
  element: HTMLElement | null, itemSizeInPixels: number, setScrollViewHeight: Function): void => {
  if (element != null) {
    setScrollViewHeight(element.clientHeight - element.getBoundingClientRect().top + itemSizeInPixels)
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

/**
 * Returns the height (in pixels) for the change description item at the given index.
 * @param items Description of changes made to a library of things.
 * @param itemIndex Index of an item within the array.
 * @param showPath Should we show the path to the item that was changed?
 */
const itemHeight = (items: ItemType[], itemIndex: number, showPath: boolean) => {
  if (items && items[itemIndex]) {
    const item = items[itemIndex]
    if (item.isLoading) {
      return 75 // TODO - Magic number. Can this number be input rather than hard-coded?
    } else {
      if ((item.change != null) && showPath) {
        return 125 // TODO - Magic number. Can this number be input rather than hard-coded?
      } else {
        return 75 // TODO - Magic number. Can this number be input rather than hard-coded?
      }
    }
  }
  return 75 // TODO - Magic number. Can this number be input rather than hard-coded?
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
    logger,
    setIsLoadingChanges,
    setItems
  } = state
  logger.setContext(loadMoreChanges)
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
      }).then((response: any) => {
        setIsLoadingChanges(false)
        loadingOffsets.delete(url)
        if (response.status === 200) {
          response.json().then((data: any) => {
            if (data && data.changes) {
              const newItems = items.map(item => { return { ...item } })
              data.changes.forEach((change: LibraryChangeType) => {
                change.members.forEach((member: LibraryChangeDescription, index: number) => {
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
      }, (reason: any) => {
        loadingOffsets.delete(url)
        onFetchingChangesFailed(reason, state)
      })
    })
  }, 500)
}

const onFetchingChangesFailed = (response: any, state: LoadingState) => {
  const { setIsLoadingChanges } = state
  setIsLoadingChanges(false)
}

/**
 * Renders the name for a type of thing.
 * @param typeName
 */
const renderThingType = (typeName: string) => {
  return (
    <div className='sqwerl-type-name-cell'>
      <span className='sqwerl-type-name'>{typeName}</span>
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
  const render = (text: string, icon: Function) => {
    return (
      <div className='sqwerl-type-of-change-name-cell'>
        <span className='sqwerl-type-of-change-text'>{text}</span>
        <span className='sqwerl-type-of-change-icon'>{icon()}</span>
      </div>
    )
  }
  switch (typeOfChangeId.toLowerCase()) {
    case 'added':
      return render(
        intl.formatMessage({ id: 'typeOfChange.added' }), () => <PlusSquare />)
    case 'modified':
      return render(intl.formatMessage({ id: 'typeOfChange.modified' }), () => <Edit3 />)
    case 'removed':
      return render(intl.formatMessage({ id: 'typeOfChange.deleted' }), () => <Trash2 />)
    default:
      return render(intl.formatMessage({ id: 'typeOfChange.unknown' }), () => <HelpCircle />)
  }
}

/**
 * Renders a row within a table showing changes made to a library of things.
 * @param props
 * @constructor
 */
const Row = (props: ListChildComponentProps<RowType>): JSX.Element => {
  const { index, style } = props
  const { configuration, context, currentLibraryName, intl, items, offset } = props.data
  const item = items[index]
  const indexColumnWidth = `columns-${Math.min(6, Math.round(Math.log10(items.length)) + 1)}`
  if (!item || (item.change == null)) {
    return (
      <tr key={index + offset} style={style}>
        <td className={`sqwerl-library-changes-by-day-index-column ${indexColumnWidth}`}>
          <span className='sqwerl-library-changes-by-day-index-column-text'>{intl.formatNumber(offset + index + 1)}</span>
        </td>
        <td className='sqwerl-library-changes-by-day-loading-column'>
          <span className='sqwerl-navigation-loading-indicator first'>.</span>
          <span className='sqwerl-navigation-loading-indicator second'>.</span>
          <span className='sqwerl-navigation-loading-indicator third'>.</span>
        </td>
      </tr>
    )
  }
  const { id, isCollection, typeId, typeOfChange } = item.change
  const wasRemoved = typeOfChange === 'removed'
  const linkTarget =
    wasRemoved
      ? undefined
      : isCollection
        ? linkTargetToCollection(id, configuration, context, currentLibraryName)
        : linkTargetToLeaf(id, configuration, context, currentLibraryName)
  const multiline = isCollection && context.shouldShowPath(id) ? 'multiline' : ''
  if (wasRemoved) {
    return (
      <tr key={index} style={style}>
        <td className={`sqwerl-library-changes-by-day-index-column ${indexColumnWidth} ${multiline}`}>
          <span className='sqwerl-library-changes-by-day-index-column-text'>
            {intl.formatNumber(index + 1)}
          </span>
        </td>
        <ChangeLabel
          change={item.change}
          index={index}
          isLinkToCollection={isCollection}
          linkTarget={linkTarget}
          showPath={isCollection && context.shouldShowPath(id)}
        />
        <td className={`sqwerl-library-changes-by-day-change-type-column ${isCollection ? 'multiline' : ''}`}>
          {renderThingType(context.typeIdToTypeName(typeId))}
        </td>
        <td className={`sqwerl-library-changes-by-day-thing-type-column ${isCollection ? 'multiline' : ''}`}>
          {renderTypeOfChange(intl, typeOfChange)}
        </td>
      </tr>
    )
  } else {
    return (
      <tr className='sqwerl-table-row-link' key={index + offset} onClick={() => (location.href = linkTarget || '')} style={style}>
        <td className={`sqwerl-library-changes-by-day-index-column ${indexColumnWidth} ${multiline}`}>
          <span className='sqwerl-library-changes-by-day-index-column-text'>
            {intl.formatNumber(offset + index + 1)}
          </span>
        </td>
        <ChangeLabel
          change={item.change}
          index={index}
          isLinkToCollection={isCollection}
          linkTarget={linkTarget}
          showPath={isCollection && context.shouldShowPath(id)}
        />
        <td className={`sqwerl-library-changes-by-day-thing-type-column ${isCollection ? 'multiline' : ''}`}>
          {renderThingType(context.typeIdToTypeName(typeId))}
        </td>
        <td className={`sqwerl-library-changes-by-day-change-type-column ${isCollection ? 'multiline' : ''}`}>
          {renderTypeOfChange(intl, typeOfChange)}
        </td>
      </tr>
    )
  }
}

export default ChangesByDaySheet
