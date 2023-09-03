/* global Response */

import type { FetcherType } from 'fetcher'
import Logger from 'logger'
import type { LoggerType } from 'logger'
import { ServerDataTypes } from 'fetcher'

export interface SearcherType {
  search: Function
}

interface SortByProperties {
  sortBy: string
  sortOrder: number
}

/**
 * Searches for data stored on remote servers.
 */
const Searcher = (): SearcherType => {
  const logger = Logger(Searcher, Searcher)
  return {
    search: (
      fetcher: FetcherType,
      searchText: string,
      sortByProperties: SortByProperties,
      onFailure: (error: any, response?: Response) => void,
      onSuccess: (url: string, data: any) => void,
      offset: number,
      limit: number) => { search(logger, fetcher, searchText, sortByProperties, onFailure, onSuccess, offset, limit) }
  }
}

/**
 * Searches for data stored on a remote server.
 * @param logger Logs messages.
 * @param fetcher Fetches data from remote servers.
 * @param searchText Text to search for.
 * @param sortByProperties Which properties should the results be sorted by?
 * @param onFailure Called if the search fails.
 * @param onSuccess Called if the search succeeds.
 * @param offset The starting index of the first search result to return.
 * @param limit The number of search results to return.
 */
const search = (
  logger: LoggerType,
  fetcher: FetcherType,
  searchText: string,
  sortByProperties: SortByProperties,
  onFailure: (error: Error, response?: Response) => void,
  onSuccess: (url: string, data: any) => void,
  offset: number = 0,
  limit: number = 20) => {
  logger.setContext(search)
  logger.info(`Searching for "${searchText}"`)
  logger.debug(`Search item starting index: ${offset}, Search item limit: ${limit}`)
  logger.assert(!!fetcher, 'A data fetcher is required')
  logger.assert(!!onFailure, 'A failure callback function is required')
  logger.assert(!!onSuccess, 'A success callback function is required')
  const sortBy = (sortByProperties && sortByProperties.sortBy) ? `&sortBy=${sortByProperties.sortBy}` : ''
  const sortOrder = (sortByProperties && sortByProperties.sortOrder) ? `&sortOrder=${sortByProperties.sortOrder}` : ''
  const url = `/db/search?q=${encodeURI(searchText)}&offset=${offset}&limit=${limit}${sortBy}${sortOrder}`
  fetcher.requestData({
    onFailure,
    onSuccess,
    url
  }, ServerDataTypes.SEARCH_RESULTS.toString()).then((response: any) => {
    if (response.status === 200) {
      response.json().then((data: any) => {
        onSuccess(url, data)
      })
    } else {
      onFailure(response.status, response)
    }
  },
  (response: any) => {
    onFailure(response.status, response)
  })
}

export default Searcher
