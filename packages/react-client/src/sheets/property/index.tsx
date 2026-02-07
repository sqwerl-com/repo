import ApplicationContext from '@/context/application'
import { BasicThing, HasPictureData } from '@/utilities/types'
import { ConfigurationType } from '@/configuration'
import { encodeUriReplaceStringsWithHyphens } from '@/utilities/formatters/ids'
import { evenOrOddClassName } from '@/utilities/css/even-or-odd-class-name'
import { FetcherType } from '@/fetcher'
import InfiniteLoader from 'react-window-infinite-loader'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { linkTargetToCollection, linkTargetToLeaf } from '@/utilities/formatters/link-target'
import { ListChildComponentProps, VariableSizeList } from 'react-window'
import LoggerFactory from '@/logger'
import PropertyTitleBar from '@/sheets/components/property-title-bar'
import { ReactNode } from 'react'
import { RefObject, useContext, useEffect, useRef, useState } from 'react'
import type { SheetProps, SheetState } from '@/properties'
import ThumbnailImage, { SIZES } from '@/utilities/components/thumbnail-image.tsx'

/**
 * Item that represents a thing.
 */
interface ItemType extends HasPictureData {
  id: string
  isLoaded: boolean
  name: string
  offset: number
  type: string
  typeId: string
  typeName: string
}

interface ItemData {
  indexColumnWidth: string
  intl: IntlShape
  items: ItemType[]
  state: SheetState
}

/**
 * Data required to keep track of while loading information about things.
 */
interface LoadingState {
  configuration: ConfigurationType
  fetcher: FetcherType
  items: ItemType[]
  loadingOffsets: Map<string, string>
  property: string
  setIsLoading: (isLoading: boolean) => void
  setItems: (items: ItemType[]) => void
  thing: BasicThing | null
}

/**
 * Renders a read-only form that displays the values of one of a thing's properties.
 * @param props
 */
const PropertySheet: React.FC<SheetProps> = (props: SheetProps): ReactNode => {
  const context = useContext(ApplicationContext)
  const { state } = props
  const { configuration, fetcher, property, thing } = state
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
    if (members) {
      const newItems = [...items]
      const loadedItems: ItemType[] = members.map((member) => {
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
  }, [])

  const intl = useIntl()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingOffsets, setLoadingOffsets] = useState<Map<string, string>>(new Map<string, string>())
  const newItems: ItemType[] = []
  const members = ((thing != null) &&
    Object.prototype.hasOwnProperty.call(thing, 'members') && thing.members) ? thing.members : []
  const [items, setItems] = useState<ItemType[]>(newItems)
  const totalCount = ((thing != null) &&
    Object.prototype.hasOwnProperty.call(thing, 'totalCount') ? thing.totalCount : 0)

  members.forEach((item, index) => {
    newItems.push({
      id: item.id,
      isLoaded: true,
      name: item.name,
      offset: index,
      pictureData: item.pictureData,
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

  if (thing === null) {
    return (<></>)
  }

  const indexColumnWidth = `columns-${Math.min(6, Math.round(Math.log10(thing.totalCount) + 1))}`
  let list: VariableSizeList<ItemData>

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
      <div className='sqwerl-list-view' ref={setScrollViewElement}>
        <InfiniteLoader
          isItemLoaded={(index: number) => !!(items[index]?.isLoaded)}
          itemCount={items ? items.length : 0}
          loadMoreItems={(startIndex: number, stopIndex: number): Promise<void> | void =>
            loadMoreItems(startIndex, stopIndex, {
              configuration,
              fetcher,
              items,
              loadingOffsets,
              property,
              setIsLoading,
              setItems,
              thing
            })
          }
        >
          {({ onItemsRendered, ref }) => {
            return (
              <VariableSizeList
                estimatedItemSize={rowHeightInPixels}
                height={scrollAreaHeight}
                itemCount={items ? items.length : 0}
                itemData={{ indexColumnWidth, intl, items, state }}
                itemSize={itemIndex => rowHeightInPixels}
                onItemsRendered={onItemsRendered}
                overscanCount={Math.floor(scrollAreaHeight / 50 )}
                ref={(variableSizeList: VariableSizeList<ItemData>) => {
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

let pending: number

const loadMoreItems = (startIndex: number, stopIndex: number, state: LoadingState): Promise<void> | void => {
  const { configuration, fetcher, items, loadingOffsets, property, setIsLoading, setItems, thing } = state
  const baseUrl = configuration.baseUrl || ''

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
      }).then((response: Response) => {
        setIsLoading(false)
        loadingOffsets.delete(url)

        if (response.status === 200) {
          response.json().then((data) => {
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
                  pictureData: item.pictureData,
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
          onFetchingItemsFailed(response)
        }
      }), (response: Response) => {
        loadingOffsets.delete(url)
        onFetchingItemsFailed(response)
      }
    })
  }, 500)
}

const onFetchingItemsFailed = (response: Response) => {
  const logger = loggerFactory.create(onFetchingItemsFailed)
  logger.error(`Unable to fetch items. response=${JSON.stringify(response)}`)
}

const Row = (props: ListChildComponentProps<ItemData>): React.JSX.Element => {
  const { data, index, style } = props
  const { indexColumnWidth, intl, items, state } = data
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const item = items[index]
  const id = item.id
  const isCollection = item.typeId === '/types/collections'
  const link = isCollection
    ? linkTargetToCollection(id, configuration, context, currentRepositoryName)
    : linkTargetToLeaf(id, configuration, context, currentRepositoryName)
 /*
  return (
    <tr
      className={`sqwerl-table-row-link ${evenOrOddClassName((index))}`}
      key={item.id}
      onClick={() => (location.href = link)}
      style={style}
    >
      <td className={`sqwerl-properties-table-index-column ${indexColumnWidth}`}>
        <span className='sqwerl-properties-table-index-column-text'>{item.offset + 1}</span>
      </td>
      <td className='sqwerl-properties-table-name-column'>
        <div className='sqwerl-properties-table-name-text'>
          <span className='sqwerl-properties-table-name-link' key={index}>
            <Link className='sqwerl-properties-table-name-title' to={link}>
              <span className='sqwerl-properties-name-text'>
                {* TODO - The ... string below needs to be removed: Use the CSS loading content animation. *}
                {item.isLoaded ? item.name : '...'}
              </span>
            </Link>
          </span>
          <ThumbnailImage depictable={item} size={SIZES.small} />
        </div>
      </td>
      <td className='sqwerl-properties-table-type-column'>{item.typeName}</td>
    </tr>
  )
*/
  return (
    <div
      className={`sqwerl-navigation-item ${evenOrOddClassName(index)}`}
      style={style}
    >
      <Link
        className='sqwerl-navigation-parent-item double-height'
        data-id={item.id}
        data-key={index}
        to={link ?? ''}
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
                  {item.name ?? ''}
                </div>
              </div>
              <span className='sqwerl-navigation-item-type-name'>
                {context.typeNameToTypeDescription(intl, item.typeName ?? '')}
              </span>
            </label>
          </div>
          <div className='sqwerl-parent-item-details'>
            <div className='sqwerl-navigation-item-icon' data-key={index}>
              <ThumbnailImage depictable={item} size={SIZES.medium} typeId={item.typeId} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

const loggerFactory = LoggerFactory(PropertySheet)

export default PropertySheet
