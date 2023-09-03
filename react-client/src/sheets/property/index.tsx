import ApplicationContext from 'context/application'
import { BasicThing } from 'utils/types'
import { ConfigurationType } from 'configuration'
import { encodeUriReplaceStringsWithHyphens } from 'utils/formatters/ids'
import { FetcherType } from 'fetcher'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { Link } from 'react-router-dom'
import { linkTargetToCollection, linkTargetToLeaf } from 'utils/formatters/link-target'
import Logger, { LoggerType } from 'logger'
import PropertyTitleBar from 'sheets/components/property-title-bar'
import React, { useContext, useEffect, useState } from 'react'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetProps, SheetState } from 'properties'

let logger: LoggerType

/**
 * Item that represents a thing.
 */
interface ItemType {
  id: string
  isLoaded: boolean
  name: string
  offset: number
  type: string
  typeId: string
  typeName: string
}

/**
 * State to keep track of while loading information about things.
 */
interface LoadingState {
  configuration: ConfigurationType
  fetcher: FetcherType
  items: ItemType[]
  loadingOffsets: Map<string, string>
  logger: LoggerType
  property: string
  setIsLoading: Function
  setItems: Function
  thing: BasicThing | null
}

interface ItemData {
  indexColumnWidth: string
  items: ItemType[]
  state: SheetState
}

interface Props {
  /** The name of the thing whose property this sheet displays. */
  name: string

  /** The name of the property of a thing that this sheet displays. */
  property: string

  state: SheetState
}

/**
 * Renders a read-only form that displays the values of one of a thing's properties.
 * @param props
 * @constructor
 */
const PropertySheet: React.FC<SheetProps> = (props: SheetProps): React.JSX.Element => {
  logger = Logger(PropertySheet, PropertySheet)
  const context = useContext(ApplicationContext)
  const [loadingOffsets, _setLoadingOffsets] = useState<Map<string, string>>(new Map<string, string>())
  const [rowHeightInPixels] = useState(75)
  const [scrollAreaHeight, setScrollAreaHeight] = useState(100)
  const [scrollViewElement, setScrollViewElement] = useState<HTMLDivElement | null>(null)
  const [_isLoading, setIsLoading] = useState<boolean>(false)
  const { state } = props
  const { configuration, fetcher, property, thing } = state
  const newItems: ItemType[] = []
  const members = ((thing != null) && thing.hasOwnProperty('members') && thing.members) ? thing.members : []
  const totalCount = ((thing != null) && thing.hasOwnProperty('totalCount') ? thing.totalCount : 0)
  members.forEach((item, index) => {
    newItems.push({
      id: item.id,
      isLoaded: true,
      name: item.name,
      offset: index,
      type: item.type,
      typeId: item.typeId,
      typeName: item.typeName
    })
  })
  for (let i = members.length; i < totalCount; i++) {
    newItems.push({
      id: '',
      isLoaded: false,
      name: '',
      offset: i,
      type: '',
      typeId: '',
      typeName: ''
    })
  }
  const [items, setItems] = useState<ItemType[]>(newItems)
  useEffect(() => {
    determineScrollAreaHeight(scrollViewElement, rowHeightInPixels, setScrollAreaHeight)
  }, [rowHeightInPixels, scrollViewElement])
  useEffect(() => {
    if (members) {
      const newItems = [...items]
      const loadedItems: ItemType[] = members.map((member, index) => {
        return {
          id: member.id,
          isLoaded: true,
          name: member.name,
          offset: member.offset,
          type: member.type,
          typeId: member.typeId,
          typeName: member.typeName
        }
      })
      loadedItems.forEach(item => {
        newItems[item.offset] = item
      })
      setItems(newItems)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (thing != null) {
    const indexColumnWidth = `columns-${Math.min(6, Math.round(Math.log10(thing.totalCount) + 1))}`
    return (
      <>
        <PropertyTitleBar
          configuration={configuration}
          count={thing.totalCount}
          state={state}
          thing={thing}
          thingName={thing.name}
          titleTextId={`propertySheet.${property}.title`}
          titleTextValues={{ count: thing.totalCount, name: thing.name }}
        />
        <table className='sqwerl-properties-table sqwerl-library-changes-by-day-table'>
          <thead>
            <tr className='sqwerl-properties-table-heading'>
              <th className={`sqwerl-properties-table-index-column ${indexColumnWidth}`} />
              {/* TODO - Internationalize */}
              <th className='sqwerl-properties-table-name-table-heading'>Name</th>
              {/* TODO - Internationalize */}
              <th className='sqwerl-property-value-type-table-heading'>Type</th>
            </tr>
          </thead>
          <ScrollableContent>
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
                isItemLoaded={(index: number) => items[index]?.isLoaded}
                itemCount={items ? items.length : 0}
                loadMoreItems={(startIndex: number, stopIndex: number): Promise<void> | void => {
                  loadMoreItems(startIndex, stopIndex, {
                    configuration,
                    fetcher,
                    items,
                    loadingOffsets,
                    logger,
                    property,
                    setIsLoading,
                    setItems,
                    thing
                  })
                }}
              >
                {({ onItemsRendered, ref }) => {
                  return (
                    <FixedSizeList
                      height={scrollAreaHeight}
                      itemCount={items ? items.length : 0}
                      itemData={{ indexColumnWidth, items, state }}
                      itemSize={rowHeightInPixels}
                      onItemsRendered={onItemsRendered}
                      overscanCount={Math.floor(scrollAreaHeight / rowHeightInPixels)}
                      ref={ref}
                      width='100%'
                    >
                      {Row}
                    </FixedSizeList>
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

let pending: number

const loadMoreItems = (startIndex: number, stopIndex: number, state: LoadingState): Promise<void> | void => {
  const { configuration, fetcher, items, loadingOffsets, logger, property, setIsLoading, setItems, thing } = state
  const baseUrl = configuration.baseUrl || ''
  logger.setContext(loadMoreItems)
  if (thing == null) {
    return
  }
  if (pending) {
    clearTimeout(pending)
  }
  pending = window.setTimeout(async () => {
    setIsLoading(true)
    const url =
      `${baseUrl}${encodeUriReplaceStringsWithHyphens(thing.id)}` +
        `/summary?properties=${property}&limit=20&offset=${startIndex}`
    if (loadingOffsets.has(url)) {
      return await new Promise<void>(() => [])
    }
    loadingOffsets.set(url, '')
    return await new Promise<void>((resolve) => {
      fetcher.requestData({
        dontSetBusy: true,
        url
      }).then((response: any) => {
        setIsLoading(false)
        loadingOffsets.delete(url)
        if (response.status === 200) {
          response.json().then((data: any) => {
            if (data) {
              const members = data[property].members
              const offset = data[property].offset
              const newItems = [...items]
              members.forEach((item: ItemType, index: number) => {
                newItems[offset + index] = {
                  id: item.id,
                  isLoaded: true,
                  name: item.name,
                  offset: offset + index,
                  type: item.type,
                  typeId: item.typeId,
                  typeName: item.typeName
                }
              })
              setItems(newItems)
              resolve()
            }
          })
        } else {
          loadingOffsets.delete(url)
          onFetchingItemsFailed(response, state)
        }
      }), (response: any) => {
        loadingOffsets.delete(url)
        onFetchingItemsFailed(response, state)
      }
    })
  }, 500)
}

const onFetchingItemsFailed = (response: any, state: LoadingState) => {
  // TODO
}

const Row = (props: ListChildComponentProps<ItemData>): JSX.Element => {
  const { data, index, style } = props
  const { indexColumnWidth, items, state } = data
  const { configuration, context, currentLibraryName } = state
  const { applicationName } = configuration
  const { parentThingIdToHref } = context
  const item = items[index]
  const id = item.id
  const isCollection = item.typeId === '/types/collections'
  const link = isCollection
    ? linkTargetToCollection(id, configuration, context, currentLibraryName)
    : linkTargetToLeaf(id, configuration, context, currentLibraryName)
  return (
    <tr className='sqwerl-table-row-link' key={item.id} onClick={() => (location.href = link)} style={style}>
      <td className={`sqwerl-properties-table-index-column ${indexColumnWidth}`}>
        <span className='sqwerl-properties-table-index-column-text'>{item.offset + 1}</span>
      </td>
      <td className='sqwerl-properties-table-name-column'>
        <span key={index}>
          <Link className='sqwerl-properties-table-name-title' to={link}>
            <span className='sqwerl-properties-name-text'>
              {item.isLoaded ? item.name : '...'}
            </span>
          </Link>
        </span>
      </td>
      <td className='sqwerl-properties-table-secondary-column'>{item.typeName}</td>
    </tr>
  )
}

export default PropertySheet
