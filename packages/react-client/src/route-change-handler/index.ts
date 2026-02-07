import { JSX } from 'react'
import LoggerFactory from '@/logger'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export interface Props {
  basePath: string,

  children: JSX.Element

  /** Function to call when the href in the browser's address bar changes. */
  handleHrefChange: (currentHref: string, lastHref: string) => void

  /** Function to call when the path part of the browser's URL--the part before the # (hash symbol)--changes. */
  handlePathChange: (pathName: string, hash: string) => void

  /** Function to call when the property part of the browser's url--the part after a period (.)--changes. */
  handlePropertyChange: (pathName: string, hash: string, propertyName: string) => void

  /** Function to call when the hash part of the browser's URL--the part after the # (hash symbol)--changes. */
  handleSelectionChange: (pathName: string, hash: string) => void
}

const loggerFactory = LoggerFactory('RouteChangeHandler')

/**
 * Handles when the web browser's location--the URL of the page the web browser displays--changes.
 * @param props
 */
export const RouteChangeHandler = (props: Props) => {
  const { children } = props
  const [isShowingProperty, setIsShowingProperty] = useState(false)
  const [lastHash, setLastHash] = useState('')
  const [lastHref, setLastHref] = useState('')
  const [lastPath, setLastPath] = useState('')
  const location = useLocation()
  const { hash, pathname } = location

  // Handle the initial route change when this application loads.
  useEffect(() => {
    handleRouteChange(
      pathname,
      hash,
      '',
      '',
      lastHref,
      isShowingProperty,
      setIsShowingProperty,
      setLastHash,
      setLastHref,
      setLastPath,
      props)
  }, [])

  // Handle all subsequent route changes.
  useEffect(() => {
    handleRouteChange(
      pathname,
      hash,
      lastPath,
      lastHash,
      lastHref,
      isShowingProperty,
      setIsShowingProperty,
      setLastHash,
      setLastHref,
      setLastPath,
      props)
  }, [location])
  return (children)
}

/**
 * Executes callback functions to notify that the route (the URL in the browser's address bar) has changed.
 * @param pathname The path part of the URL--the part before any # (hash) character.
 * @param hash The hash part of the URL--the part after a # (hash) character.
 * @param lastPath The previous path.
 * @param lastHash The previous hash.
 * @param lastHref The previous url.
 * @param isShowingProperty Are we showing the value of a thing's property?
 * @param setIsShowingProperty  Sets a flag that indicates whether we are showing the value of thing's property.
 * @param setLastHash Sets the current hash.
 * @param setLastHref Sets the url value before the route change.
 * @param setLastPath Sets the current path.
 * @param props
 */
const handleRouteChange = (
  pathname: string,
  hash: string,
  lastPath: string,
  lastHash: string,
  lastHref: string,
  isShowingProperty: boolean,
  setIsShowingProperty: (isShowingProperty: boolean) => void,
  setLastHash: (lastHash: string) => void,
  setLastHref: (lastHref: string) => void,
  setLastPath: (lastPath: string) => void,
  props: Props) => {
  const logger = loggerFactory.create('handleRouteChange')
  const { handleHrefChange, handlePathChange, handlePropertyChange, handleSelectionChange } = props
  const periodIndex = hash.indexOf('.')
  if ((periodIndex > 1) && (periodIndex < Math.max(0, (hash.length - 2)))) {
    const property = hash.slice(periodIndex + 1)
    logger.debug(`Being asked to show the property named "${property}"`)
    if (handlePropertyChange) {
      handlePropertyChange(pathname, hash.slice(1, periodIndex), property)
    }
    setIsShowingProperty(true)
  } else {
    if (isShowingProperty || (pathname !== lastPath)) {
      if (handlePathChange) {
        console.log(`Calling handlePathChange: pathname="${pathname}"`)
        handlePathChange(pathname, hash)
      }
      if ((hash !== lastHash) && handleSelectionChange) {
        handleSelectionChange(pathname, hash.slice(1))
      }
      setLastHash(hash)
      setLastPath(pathname)
    } else if (isShowingProperty || (hash !== lastHash)) {
      if (handleSelectionChange) {
        handleSelectionChange(pathname, hash.slice(1))
      }
      setLastHash(hash)
      setLastPath(pathname)
    }
    const currentHref = window.location.href
    if (lastHref !== currentHref) {
      if (handleHrefChange) {
        handleHrefChange(currentHref, lastHref)
      }
      setLastHref(currentHref)
    }
    setIsShowingProperty(false)
  }
}
