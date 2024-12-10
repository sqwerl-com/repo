/* globals Response */

import type { FetcherType } from '@/fetcher'
import { SearchResults } from '@/application'
import Logger from '@/logger'

/**
 * Specifies which property to sort search results by, and the sort order (ascending or descending).
 */
export interface SortByProperties {
  /** The name of a property of things in search results to sort by. */
  sortBy: string

  /** The order to sort the things by: 0 = don't sort, 1 = sort ascending, -1 = sort descending */
  sortOrder: number
}

/**
 * Parameters for performing a search of repositories of things.
 */
export interface SearchContextType {
  applicationName: string
  fetcher: FetcherType
  limit: number
  offset: number
  onFailure: (error: Error, response?: Response) => void
  onSuccess: (url: string, data: SearchResults) => void
  searchText: string
  sortByProperties: SortByProperties | undefined
}

/**
 * Constructs parameters for performing a search of repositories of things.
 * @param applicationName The name of this application.
 * @param fetcher Fetches data from a server.
 * @param limit The maximum number of things for a search to return.
 * @param offset The offset within a collection of search results.
 * @param onFailure Called when a search fails.
 * @param onSuccess Called when a search is successful.
 * @param searchText The text to search for.
 * @param sortByProperties Which property to sort search results in and in what order.
 * @constructor
 */
const SearchContext = (
  applicationName: string,
  fetcher: FetcherType,
  limit: number,
  offset: number,
  onFailure: (error: Error, response?: Response) => void,
  onSuccess: (url: string, data: SearchResults) => void,
  searchText: string,
  sortByProperties?: SortByProperties
): SearchContextType => {
  const logger = Logger(SearchContext, SearchContext)
  logger.assert(!!fetcher, 'A data fetcher is required')
  logger.assert(!!onFailure, 'A failure callback function is required')
  logger.assert(!!onSuccess, 'A success callback function is required')
  return {
    applicationName,
    fetcher,
    limit,
    offset,
    onFailure,
    onSuccess,
    searchText,
    sortByProperties
  }
}

export default SearchContext
