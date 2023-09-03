/* global fetch, Headers, Response */

import Logger, { LoggerType } from 'logger'
import { useState } from 'react'

/** API version number sent in each HTTP request. */
const API_VERSION_NUMBER = '0.1'

export interface FetchArgumentsType {
  /**
   * If true, then don't set the busy flag while waiting for a response from a server. This is useful when
   * retrieving data in an infinite scroll where we don't want to to prevent users from scrolling while this
   * application is still waiting on data from a server.
   */
  dontSetBusy?: boolean

  /** Function called when a failure to send or retrieve data occurs. */
  onFailure?: (error: Error, response?: Response) => void

  /** Function called when data is successfully sent or retrieved. */
  onSuccess?: (url: string, data: any) => void

  /** Address to send data to or retrieve data from. */
  url: string
}

export interface FetcherType {
  postData: (fetchArguments: FetchArgumentsType, data: string) => void
  requestData: (fetchArguments: FetchArgumentsType, dataType?: string) => Promise<Response>
}

/** Unique identifiers for the types of data the server sends to this application. */
export enum ServerDataTypes {
  AUTHENTICATION = 'authentication',
  NODE = 'node',
  SEARCH_RESULTS = 'searchResults',
  SUMMARY = 'summary',
  SIGN_OUT = 'signOut',
  TYPES = 'types'
}

/**
 * Returns an object that can fetch or send data to a remote server.
 * @param setIsBusy Function that toggles a flag that indicates when an application is busy.
 */
const Fetcher = (setIsBusy: (isBusy: boolean) => void): FetcherType => {
  const [logger] = useState(Logger(Fetcher, Fetcher))
  return {
    postData: (fetchArguments: FetchArgumentsType, data: string) => postData(logger, setIsBusy, fetchArguments, data),
    requestData: (fetchArguments: FetchArgumentsType, dataType?: string) =>
      requestData(logger, setIsBusy, fetchArguments, dataType)
  }
}

/**
 * Uses HTTP to post (send) data to a server.
 * @param logger  Logs messages.
 * @param setIsBusy Function that toggles a flag that indicates when an application is busy.
 * @param fetchArguments  What to post and what to call when the post is successful or fails.
 * @param data Data to send to a server.
 */
const postData = (
  logger: LoggerType, setIsBusy: (isBusy: boolean) => void, fetchArguments: FetchArgumentsType, data: string) => {
  const { onFailure, onSuccess, url } = fetchArguments
  logger.setContext(postData)
  const maximumSizeInBytes = 3000
  logger.assert(url, 'A URL to post data to is required')
  logger.debug(`Posting data to "${url}"`)
  if (data.length > maximumSizeInBytes) {
    data = data.slice(0, maximumSizeInBytes)
    logger.warn(`Truncating post data to ${maximumSizeInBytes} bytes`)
  }
  setIsBusy(true)
  const errorMessage = `Failed to post data to "${url}"`
  fetch(url, { body: encodeURIComponent(data), method: 'POST' }).then(response => {
    if (response.ok) {
      setIsBusy(false)
      return response
    }
    const error = new Error(errorMessage)
    if (typeof onFailure === 'function') {
      onFailure(error, response)
      setIsBusy(false)
    } else {
      setIsBusy(false)
      logger.error(`${errorMessage}, response=${JSON.stringify(response)}`)
      throw error
    }
  }).then(response => {
    if ((response != null) && (typeof onSuccess === 'function')) {
      response.json().then(data => onSuccess(url, data))
      setIsBusy(false)
    }
  }).catch(error => {
    if (typeof onFailure === 'function') {
      onFailure(error)
      setIsBusy(false)
    } else {
      setIsBusy(false)
      logger.error(`${errorMessage}, error=${error}`)
      throw new Error(`${errorMessage}, error=${error}`)
    }
  })
}

/**
 * Sends an HTTP request for data.
 * @param logger  Logs messages.
 * @param setIsBusy Function that toggles a flag that indicates when an application is busy.
 * @param fetchArguments  What to fetch and what to call when fetch is successful or fails.
 * @param dataType  Unique identifier for a type of data the server returns.
 */
const requestData = async (
  logger: LoggerType,
  setIsBusy: (isBusy: boolean) => void,
  fetchArguments: FetchArgumentsType,
  dataType?: string): Promise<Response> => {
  const { dontSetBusy, url } = fetchArguments
  logger.setContext(requestData)
    .assert(url, 'A URL to fetch data from is required')
    .debug(`Fetching data from "${url}"`)
  const headers = new Headers()
  headers.append(
    'Accept',
    `vnd.sqwerl.com.${dataType || ServerDataTypes.SUMMARY.toString()}+json; version=${API_VERSION_NUMBER},application/json`)
  if (!dontSetBusy) {
    setIsBusy(true)
  }
  return await fetch(url, { headers }).finally(() => {
    if (!dontSetBusy) {
      setIsBusy(false)
    }
  })
}

export default Fetcher
