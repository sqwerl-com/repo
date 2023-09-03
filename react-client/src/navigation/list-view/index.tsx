/* global HTMLDivElement, HTMLElement */

import ApplicationContext, { ApplicationContextType } from 'context/application'
import { ChevronRight } from 'react-feather'
import { ConfigurationType } from 'configuration'
import { CSSProperties, JSX, useContext, useEffect, useState } from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { IntlShape, useIntl } from 'react-intl'
import { Item } from 'navigation/item'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from 'logger'
import * as React from 'react'

let logger: LoggerType

interface State {
  configuration: ConfigurationType
  context: ApplicationContextType
  currentLibraryName: string
  hasChildren: Function
  intl: IntlShape
  isDraggingScrollThumb: boolean
  isScrollerVisible: boolean
  listItemHeightInPixels: number
  listViewHeight: number
  loadChildren: (startIndex: number, stopIndex: number) => Promise<void> | void
  logger: LoggerType
  scrollerThumbHeight: number
  scrollerThumbLocation: number
  selectedItemId?: string
  setAnimationClassName: Function
  setGoBackUrl: Function
  setSelectedItemId: Function
  showProperties: Function
  startOffset: number
  viewportHeight: number
  viewportWidth: number
  visibleItemCount: number
  yOffset: number
}

interface ItemData {
  hasChildren: (item: Item) => boolean
  items: Item[]
  selectedItemId?: string
  state: State
}

interface Props {
  averageItemHeight: number

  /** Application configuration information. */
  configuration: ConfigurationType

  /** The name of the library of things that this application is displaying. */
  currentLibraryName: string

  hasChildren: (item: Item) => boolean
  items: Item[]
  listItemHeightInPixels: number,
  loadChildren: (startIndex: number, stopIndex: number) => (Promise<void> | void)
  selectedItemId?: string
  setAnimationClassName: Function
  setGoBackUrl: Function
  setSelectedItemId: Function
  showProperties: Function
}

/**
 * List view user interface component.
 * @param props
 */
const ListView = (props: Props): JSX.Element => {
  const { listItemHeightInPixels } = props
  logger = Logger(ListView, ListView)
  const context = useContext(ApplicationContext)
  const intl = useIntl()
  const [isDraggingScrollThumb] = useState(false)
  const [isScrollerVisible] = useState(false)
  const [listViewElement, setListViewElement] = useState<HTMLDivElement | null>(null)
  const [listViewHeight, setListViewHeight] = useState(100)
  const [scrollerThumbHeight] = useState(0)
  const [scrollerThumbLocation] = useState(0)
  const [startOffset] = useState(0)
  const [viewportHeight] = useState(0)
  const [viewportWidth] = useState(0)
  const [visibleItemCount] = useState(0)
  const [yOffset] = useState(0)
  const {
    configuration,
    currentLibraryName,
    hasChildren,
    items,
    loadChildren,
    setAnimationClassName,
    showProperties,
    selectedItemId,
    setGoBackUrl,
    setSelectedItemId
  } = props
  const state: State = {
    configuration,
    context,
    currentLibraryName,
    intl,
    logger,
    hasChildren,
    isDraggingScrollThumb,
    isScrollerVisible,
    listItemHeightInPixels,
    listViewHeight,
    loadChildren,
    scrollerThumbHeight,
    scrollerThumbLocation,
    selectedItemId,
    setAnimationClassName,
    setGoBackUrl,
    setSelectedItemId,
    showProperties,
    startOffset,
    viewportHeight,
    viewportWidth,
    visibleItemCount,
    yOffset
  }
  useEffect(() => {
    if (listViewElement) {
      determineListHeight(listViewElement, listItemHeightInPixels, setListViewHeight)
    }
    const resizeListener = () => determineListHeight(listViewElement, listItemHeightInPixels, setListViewHeight)
    window.addEventListener('resize', resizeListener)
    return () => window.removeEventListener('resize', resizeListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listViewElement, listItemHeightInPixels])
  useEffect(() => {
    context.selectThingEvents.register((path: string, hash: string) => onSelectThing(path, hash, state))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className='sqwerl-list-view' ref={setListViewElement}>
      <InfiniteLoader
        isItemLoaded={(index: number) => !items[index].isLoading}
        itemCount={items ? items.length : 0}
        loadMoreItems={loadChildren}
      >
        {({ onItemsRendered, ref }) => {
          return (
            <FixedSizeList
              height={listViewHeight}
              itemCount={items ? items.length : 0}
              itemData={{ hasChildren, items, selectedItemId, state }}
              itemSize={listItemHeightInPixels}
              onItemsRendered={onItemsRendered}
              overscanCount={Math.floor(listViewHeight / listItemHeightInPixels)}
              ref={ref}
              width='100%'
            >
              {Row}
            </FixedSizeList>
          )
        }}
      </InfiniteLoader>
    </div>
  )
}

/**
 * Invokes the given state setter function to set this list view's height (in pixels).
 * @param listViewElement        This list view's HTML element.
 * @param listItemSizeInPixels   The default height (in pixels) for this list's items.
 * @param setListViewHeight      Sets this list view's height (in pixels).
 */
const determineListHeight = (
  listViewElement: HTMLElement | null, listItemSizeInPixels: number, setListViewHeight: Function): void => {
  if (listViewElement != null) {
    setListViewHeight(
      listViewElement.clientHeight - listViewElement.getBoundingClientRect().top + listItemSizeInPixels)
  }
}

/**
 * Returns the CSS class name for the icon for a list item to display to depict the thing the list item represents.
 * @param item  An item that represents a thing.
 * @return A CSS class name.
 */
const itemIcon = (item: Item): string => {
  // TODO - Replace this with code to show a preview image if the thing the list item represents has one.
  return ''
}

/**
 * Invoked when the user presses a key while this list view has the keyboard input focus.
 * @param event Key down event.
 * @param state This list view's state.
 */
const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, state: State) => {
  const { logger } = state
  logger.setContext(onKeyDown)
  switch (event.key) {
    case 'Tab':
      logger.debug('Tab key pressed')
      if (event.shiftKey) {
        // TODO - Move focus to previous component.
      } else {
        // TODO - Move focus to next component.
      }
      break
    case 'ArrowLeft':
      logger.debug('Cursor left key pressed')
      // TODO - Same action as clicking on the navigator's Back button.
      break
    case 'ArrowUp':
      // TODO - Move keyboard input focus to the previous list item.
      logger.debug('Cursor up key pressed')
      break
    case 'ArrowRight':
      // TODO - Fire this item's action (just as if the user pressed the Enter key).
      logger.debug('Cursor right key pressed')
      break
    case 'ArrowDown':
      // TODO - Move keyboard input focus to the next list item.
      logger.debug('Cursor down key pressed')
      break
    default:
      logger.debug('Key pressed: ' + event.key)
  }
}

/**
 * Called when the user selects a navigation list item that represents a single thing.
 * @param path Path part of the browser's current URL.
 * @param hash Hash part of the browser's current URL.
 * @param state This list view's state.
 */
const onSelectThing = (path: string, hash: string, state: State) => {
  const { logger, setSelectedItemId, showProperties } = state
  logger.setContext(onSelectThing).debug(`Showing properties for the thing with the id "${hash}"`)
  showProperties(hash)
  setSelectedItemId(hash)
}

/**
 * Renders a navigation item that represents a thing that doesn't have any children.
 * @param item An item that represents a thing.
 * @param index The index of the item within this navigation list.
 * @param state This list view's state.
 */
const renderLeafItem = (item: Item, index: number, state: State) => {
  const { configuration, context, currentLibraryName, selectedItemId, setSelectedItemId } = state
  return (
    <Link
      className={`sqwerl-navigation-leaf-item ${item.showTypeName ? 'double-height' : ''}`}
      data-id={item.id}
      data-key={index}
      onClick={() => {
        const id = `/${configuration.applicationName}/${currentLibraryName}` +
          `${context.encodeUriReplaceStringsWithHyphens(item.id)}`
        if (selectedItemId !== id) {
          setSelectedItemId(id)
        }
      }}
      onKeyDown={event => onKeyDown(event, state)}
      tabIndex={0}
      to={`#/${configuration.applicationName}/` +
        `${currentLibraryName}${context.encodeUriReplaceStringsWithHyphens(item.id)}`}
    >
      <span className='sqwerl-navigation-item-ordinal'>{index + 1}</span>
      <label className='sqwerl-navigation-item-title ' data-key={index}>
        <div className='sqwerl-navigation-item-text'>
          <div
            className='sqwerl-navigation-item-title-text'
            data-key={index}
          >
            {item.name}
          </div>
          {item.showTypeName && <div className='sqwerl-navigation-item-type-name'>{item.typeName}</div>}
        </div>
      </label>
      <div className='sqwerl-navigation-item-icon' data-key={index}>{itemIcon(item)}</div>
    </Link>
  )
}

/**
 * Renders a navigation item for a thing that we're still loading (waiting to receive information about).
 * @param {IntlShape} intl  Internationalization support.
 * @param index The list item's index.
 * @param style CSS style properties.
 */
const renderLoadingItem = (intl: IntlShape, index: number, style: CSSProperties): JSX.Element => {
  return (
    <div className='sqwerl-navigation-loading-item' data-key={index} style={style}>
      <span className='sqwerl-navigation-item-ordinal'>{index + 1}</span>
      <span className='sqwerl-navigation-loading-item-title' data-key={index}>&nbsp;{/* loadingText */}</span>
    </div>
  )
}

/**
 * Renders a list item that represents a thing that has child things.
 * @param item  An item that represents a thing.
 * @param index  The index of the item within this navigation list.
 * @param state  This list view's state.
 */
const renderParentItem = (item: Item, index: number, state: State) => {
  const { configuration, context, currentLibraryName, intl, logger, selectedItemId, setAnimationClassName } = state
  const { applicationName } = configuration
  logger.setContext(renderParentItem)
  const hashId = encodeURI(`${configuration.applicationName}/${currentLibraryName}${item.id}`)
  const id = `/${applicationName}/${currentLibraryName}${context.encodeUriReplaceStringsWithHyphens(item.id)}`
  const doubleHeight = item.showTypeName ? 'double-height' : ''
  const isSelectedClassName =
    selectedItemId === id
      ? `sqwerl-navigation-parent-item sqwerl-navigation-selected-item ${doubleHeight}`
      : `sqwerl-navigation-parent-item ${doubleHeight}`
  return (
    <Link
      className={isSelectedClassName}
      data-id={item.id}
      data-key={index}
      onClick={() => {
        logger.debug(`User clicked on navigation item titled "${item.name}"`)
        setAnimationClassName('slide-left')
      }}
      to={`${context.parentThingIdToHref(item.id)}#/${hashId.replace(/%20/g, '-')}`}
    >
      <span className='sqwerl-navigation-item-ordinal'>{index + 1}</span>
      <label className='sqwerl-navigation-item-title' data-key={index}>
        <div
          className='sqwerl-navigation-item-title-text sqwerl-hyperlink-underline-on-hover'
          data-key={index}
        >
          {item.name}
        </div>
        {item.showTypeName && <div className='sqwerl-navigation-item-type-name'>{item.typeName}</div>}
      </label>
      <div className='sqwerl-navigation-parent-item-point'>
        <div className='sqwerl-navigation-item-child-count' data-key={index}>
          <span className='sqwerl-navigation-item-child-count-number'>
            {intl.formatMessage({ id: 'count' }, { value: item.childrenCount })}
          </span>
        </div>
        <div className='sqwerl-navigation-item-has-children' data-key={index}>
          <ChevronRight className='sqwerl-back-or-forward-icon' />
        </div>
      </div>
    </Link>
  )
}

/**
 * Renders a row within this list view.
 * @param props
 * @constructor
 */
const Row = (props: ListChildComponentProps<ItemData>): JSX.Element => {
  const { data, index, style } = props
  const { hasChildren, items, selectedItemId, state } = data
  const { configuration, context, currentLibraryName, intl } = state
  const { applicationName } = configuration
  const item = items[index]
  if (item.isLoading) {
    return renderLoadingItem(intl, index, style)
  }
  const id = `/${applicationName}/${currentLibraryName}${context.encodeUriReplaceStringsWithHyphens(item.id)}`
  const isSelectedClassName =
    selectedItemId === id ? 'sqwerl-navigation-item selected' : 'sqwerl-navigation-item'
  return (
    <div
      className={isSelectedClassName}
      key={index}
      style={style}
      /* onKeyDown={event => onKeyDown(event, state)} */
    >
      {hasChildren(item) ? renderParentItem(item, index, state) : renderLeafItem(item, index, state)}
    </div>
  )
}

export default ListView
