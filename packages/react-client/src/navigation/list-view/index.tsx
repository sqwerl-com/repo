/* global HTMLDivElement, HTMLElement */

import ApplicationContext, { ApplicationContextType } from '@/context/application'
import { ChevronRight } from 'react-feather'
import { ConfigurationType } from '@/configuration'
import { CSSProperties, JSX, useContext, useEffect, useState } from 'react'
import { evenOrOddClassName } from '@/utils/css/even-or-odd-class-name'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { IntlShape, useIntl } from 'react-intl'
import { Item } from '@/navigation/item'
import { Link } from 'react-router-dom'
import Logger, { LoggerType } from '@/logger'
import SmallThumbnailImage from '@/utils/components/small-thumbnail-image'
import * as React from 'react'

interface Props {
  /** The average height, in pixels, for this list view's items. */
  averageItemHeight: number

  /** Application configuration information. */
  configuration: ConfigurationType

  /** The name of the repository of things that this application is displaying. */
  currentRepositoryName: string

  /** Function that returns true if the given item represents a thing that has children. */
  hasChildren: (item: Item) => boolean

  /** This list's items. */
  items: Item[]

  /** The height of this list's items, in pixels. */
  listItemHeightInPixels: number

  /** Loads a thing's children as new items in this list. */
  loadChildren: (startIndex: number, stopIndex: number) => (Promise<void> | void)

  /** The unique ID of the thing that this list's selected item represents. */
  selectedItemId?: string

  /** The unique ID of the thing whose representative item in this list is currently being selected. */
  selectingItemId?: string

  /** Call to set the CSS class name that animates this list. */
  setAnimationClassName: (className: string) => void

  /** Call to set the URL to navigate up one level from the items (things) displayed within this list. */
  setGoBackUrl: (url: string) => void

  /** Call to set the unique ID of the thing whose corresponding item in this list should be selected. */
  setSelectedItemId: (id: string) => void

  /** Call to set the unique ID of the thing whose corresponding item in this list is currently being selected */
  setSelectingItemId: (id: string) => void

  /** Call to display the properties of the thing with the given id (hash) */
  showProperties: (hash: string) => void

  /** Set to true to have this list's items display the name of the types for the things the items represent. */
  showTypeNames: boolean
}

interface State {
  configuration: ConfigurationType
  context: ApplicationContextType
  currentRepositoryName: string
  hasChildren: (item: Item) => boolean
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
  selectingItemId?: string
  setAnimationClassName: (className: string) => void
  setGoBackUrl: (url: string) => void
  setSelectedItemId: (id: string) => void
  setSelectingItemId: (id: string) => void
  showProperties: (hash: string) => void
  showTypeNames: boolean
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
  selectingItemId?: string
  state: State
}

let logger: LoggerType

/**
 * List view user interface component. A user interface component that displays an infinite list of items, where
 * each item represents things. The items displayed by this list may be levels in a hierarchy of things that the
 * user can traverse.
 * @param props
 */
const ListView = (props: Props): JSX.Element => {
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
    currentRepositoryName,
    hasChildren,
    items,
    listItemHeightInPixels,
    loadChildren,
    setAnimationClassName,
    showProperties,
    selectedItemId,
    selectingItemId,
    setGoBackUrl,
    setSelectedItemId,
    setSelectingItemId,
    showTypeNames
  } = props
  const state: State = {
    configuration,
    context,
    currentRepositoryName,
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
    selectingItemId,
    setAnimationClassName,
    setGoBackUrl,
    setSelectedItemId,
    setSelectingItemId,
    showProperties,
    showTypeNames,
    startOffset,
    viewportHeight,
    viewportWidth,
    visibleItemCount,
    yOffset
  }

  useEffect(() => {
    if (listViewElement !== null) {
      determineListHeight(listViewElement, listItemHeightInPixels, setListViewHeight)
    }
    const resizeListener = () => determineListHeight(listViewElement, listItemHeightInPixels, setListViewHeight)
    window.addEventListener('resize', resizeListener)
    return () => window.removeEventListener('resize', resizeListener)
  }, [listViewElement, listItemHeightInPixels])

  useEffect(() => {
    context.selectThingEvents.register((path: string, hash?: string) =>
      onSelectThing(path, hash ?? '', state))
  }, [])

  return (
    <div className='sqwerl-list-view' ref={setListViewElement}>
      <InfiniteLoader
        isItemLoaded={(index: number) => !items[index].isLoading}
        itemCount={items.length}
        loadMoreItems={loadChildren}
      >
        {({ onItemsRendered, ref }) => {
          return (
            <FixedSizeList
              height={listViewHeight}
              itemCount={items ? items.length : 0}
              itemData={{ hasChildren, items, selectedItemId, selectingItemId, state }}
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
  listViewElement: HTMLElement | null,
  listItemSizeInPixels: number, setListViewHeight: (height: number) => void
): void => {
  if (listViewElement !== null) {
    setListViewHeight(
      listViewElement.clientHeight - listViewElement.getBoundingClientRect().top + listItemSizeInPixels)
  }
}

/**
 * Returns a URL href for a leaf list item (an item that represents a thing cannot have children).
 * @param context This application's context.
 * @param applicationName This application's name.
 * @param repositoryName The name of the current repository of things.
 * @param itemId The id of the thing a leaf item represents.
 */
const leafItemLink = (
  context: ApplicationContextType,
  applicationName: string,
  repositoryName: string,
  itemId: string
): string => {
  return (`#/${applicationName}/${repositoryName}${context.encodeUriReplaceStringsWithHyphens(itemId)}`)
}

/**
 * Invoked when the user presses a key while this list view has the keyboard input focus.
 * @param event Key down event.
 * @param state This list view's state.
 */
const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, state: State): void => {
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
 * @param _path Path part of the browser's current URL.
 * @param hash Hash part of the browser's current URL.
 * @param state This list view's state.
 */
const onSelectThing = (_path: string, hash: string, state: State) => {
  const { logger, showProperties } = state
  logger.setContext(onSelectThing).debug(`Showing properties for the thing with the id "${hash}"`)
  showProperties(hash)
}

/**
 * Returns a URL href for a parent list item (an item that represents a thing that may have children).
 * @param context This application's context.
 * @param repositoryName The name of the current repository of things.
 * @param hashId The path to the selected thing.
 * @param itemId The id of a parent thing.
 */
const parentItemLink = (
  context: ApplicationContextType,
  repositoryName: string,
  hashId: string,
  itemId: string
): string => {
  return (`/${context.parentThingIdToHref(repositoryName, itemId)}#/${hashId.replace(/%20/g, '-')}`)
}

/**
 * Renders a navigation item that represents a thing that doesn't have any children.
 * @param item An item that represents a thing.
 * @param index The index of the item within this navigation list.
 * @param state This list view's state.
 */
const renderLeafItem = (item: Item, index: number, state: State): JSX.Element => {
  const { configuration, context, currentRepositoryName, showTypeNames } = state

  return (
    <Link
      className={`sqwerl-navigation-leaf-item ${showTypeNames ? 'double-height' : ''}`}
      data-id={item.id}
      data-key={index}
      onKeyDown={event => onKeyDown(event, state)}
      tabIndex={0}
      to={leafItemLink(context, configuration.applicationName, currentRepositoryName, item.id)}
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
          {showTypeNames && <div className='sqwerl-navigation-item-type-name'>{item.typeName}</div>}
        </div>
      </label>
      <div className='sqwerl-navigation-item-icon' data-key={index}>
        <SmallThumbnailImage depictable={item} />
      </div>
    </Link>
  )
}

/**
 * Renders a navigation item for a thing that we're still loading (waiting to receive information about).
 * @param {IntlShape} _intl  Internationalization support.
 * @param index The list item's index.
 * @param style CSS style properties.
 */
const renderLoadingItem = (_intl: IntlShape, index: number, style: CSSProperties): JSX.Element => {
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
const renderParentItem = (item: Item, index: number, state: State): JSX.Element => {
  const {
    configuration,
    context,
    currentRepositoryName,
    intl,
    logger,
    selectedItemId,
    setAnimationClassName,
    showTypeNames
  } = state
  const { applicationName } = configuration
  logger.setContext(renderParentItem)
  const hashId = encodeURI(`${configuration.applicationName}/${currentRepositoryName}${item.id}`)
  const id = `/${applicationName}/${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(item.id)}`
  const doubleHeight = showTypeNames ? 'double-height' : ''
  const isSelectedClassName =
    selectedItemId === id
      ? `sqwerl-navigation-parent-item sqwerl-navigation-selected-item ${doubleHeight}`
      : `sqwerl-navigation-parent-item ${doubleHeight}`
  const showBackOrForwardIcon = !!{}.hasOwnProperty.call(item, 'childrenCount') && (item.childrenCount > 0)

  return (
    <Link
      className={isSelectedClassName}
      data-id={item.id}
      data-key={index}
      onClick={() => {
        logger.debug(`User clicked on navigation item titled "${item.name}"`)
        setAnimationClassName('slide-left')
      }}
      to={parentItemLink(context, currentRepositoryName, hashId, item.id)}
    >
      <span className='sqwerl-navigation-item-ordinal'>{index + 1}</span>
      <label className='sqwerl-navigation-item-title' data-key={index}>
        <div
          className='sqwerl-navigation-item-title-text sqwerl-hyperlink-underline-on-hover'
          data-key={index}
        >
          {item.name}
        </div>
        {showTypeNames && <div className='sqwerl-navigation-item-type-name'>{item.typeName}</div>}
      </label>
      <div className='sqwerl-navigation-parent-item-point'>
        <div className='sqwerl-navigation-item-child-count' data-key={index}>
          {item.childrenCount > 0
              && <span className='sqwerl-navigation-item-child-count-number'>
                  {intl.formatMessage({ id: 'count' }, { value: item.childrenCount })}
              </span>
          }
        </div>
        <div
          className={`sqwerl-navigation-item-has-children ${showBackOrForwardIcon ? 'visible' : 'hidden'}`}
          data-key={index}
        >
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
  const { hasChildren, items, selectedItemId, selectingItemId, state } = data
  const { configuration, context, currentRepositoryName, intl } = state
  const { applicationName } = configuration
  const item = items[index]

  if (item.isLoading) {
    return renderLoadingItem(intl, index, style)
  }

  const id = `/${applicationName}/${currentRepositoryName}${context.encodeUriReplaceStringsWithHyphens(item.id)}`
  const isSelectedCssClassName = selectedItemId === id ? 'selected' : ''
  const selectionStateCssClassName = (id === selectingItemId) ? 'selecting' : isSelectedCssClassName

  return (
    <div
      className={`sqwerl-navigation-item ${selectionStateCssClassName} ${evenOrOddClassName(index)}`}
      key={index}
      onKeyDown={event => onKeyDown(event, state)}
      style={style}
      tabIndex={-1}
    >
      {hasChildren(item) ? renderParentItem(item, index, state) : renderLeafItem(item, index, state)}
    </div>
  )
}

export default ListView
