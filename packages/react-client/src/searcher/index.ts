/* global Response */

import type { FetcherType } from '@/fetcher'
import LoggerFactory from '@/logger'
import { SearchContextType, SortByProperties } from '@/search-context'
import { SearchResults } from "@/application"
import { ServerDataTypes } from '@/fetcher'

export interface SearcherType {
  search: (context: SearchContextType) => void
}

/**
 * Searches for data stored on remote servers.
 */
const Searcher = (): SearcherType => {
  return {
    search: (context: SearchContextType) => {
      const { applicationName, fetcher, onFailure, limit, offset, onSuccess, searchText, sortByProperties } = context
      search(
        applicationName,
        fetcher,
        searchText,
        sortByProperties,
        onFailure,
        (url: string, data: object) => onSuccess(url, data as SearchResults),
        offset,
        limit
      )
    }
  }
}

/**
 * Searches for data stored on a remote server.
 * @param applicationName Name of the server application to use as prefix to search request URL.
 * @param fetcher Fetches data from remote servers.
 * @param searchText Text to search for.
 * @param sortByProperties Which properties should the results be sorted by?
 * @param onFailure Called if the search fails.
 * @param onSuccess Called if the search succeeds.
 * @param offset The starting index of the first search result to return.
 * @param limit The number of search results to return.
 */
const search = (
  applicationName: string,
  fetcher: FetcherType,
  searchText: string,
  sortByProperties: SortByProperties | undefined,
  onFailure: (error: Error, response?: Response) => void,
  onSuccess: (url: string, data: object) => void,
  offset: number = 0,
  limit: number = 20) => {
  const logger = loggerFactory.create(search)
  logger.info(`Searching for "${searchText}"`)
  logger.debug(`Search item starting index: ${offset}, Search item limit: ${limit}`)
  const sortBy = (sortByProperties && sortByProperties.sortBy) ? `&sortBy=${sortByProperties.sortBy}` : ''
  const sortOrder = (sortByProperties && sortByProperties.sortOrder) ? `&sortOrder=${sortByProperties.sortOrder}` : ''
  const url = `/${applicationName}/search?q=${encodeURI(searchText)}&offset=${offset}&limit=${limit}${sortBy}${sortOrder}`
  fetcher.requestData({
    onFailure,
    onSuccess,
    url
  }, ServerDataTypes.SEARCH_RESULTS.toString()).then((response: Response) => {
    if (response.status === 200) {
      response.json().then((data: object) => {
        onSuccess(url, data)
      })
    } else {
      onFailure(new Error(`Received HTTP status: ${response.status}`), response)
    }
  },
  (response: Response) => {
    onFailure(new Error(`Received HTTP status: ${response.status}`), response)
  })
}

const loggerFactory = LoggerFactory(Searcher)

export default Searcher
