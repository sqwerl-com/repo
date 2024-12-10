/**
 * Searches things.
 */
const fs = require('fs')
const logger = require('sqwerl-logger').newInstance('Search')
const lunr = require('lunr')
const worker = require('./throttled_worker').newInstance()
const QueryContext = require('./query_context')
const QueryResultsHandler = require('./query_results_handler')

/**
 * Returns a search index for searching things.
 * @param {ApplicationConfiguration} configuration  An application's configuration information.
 * @returns {Object}  A new search index.
 */
const SearchIndex = (configuration) => {
  const indexBuilder = new lunr.Builder()
  indexBuilder.field('description')
  indexBuilder.field('name', { boost: 10 })
  indexBuilder.field('shortDescription')
  indexBuilder.field('tags') /// TODO - Populate this field with tag names, not ids.
  indexBuilder.field('title')
  indexBuilder.ref('fileName')
  const searchIndex = {
    addLibrary: (path, library) => addLibrary(searchIndex, path, library),
    buildIndex: () => buildIndex(searchIndex),
    configuration,
    libraries: [],
    indexBuilder,
    load: (basePath, path, next) => load(searchIndex, basePath, path, next),
    loadFile: (basePath, fileName, index, next) => loadFile(searchIndex, basePath, fileName, index, next),
    search: (userId, query, request, response) => search(searchIndex, userId, query, request, response)
  }
  return searchIndex
}

/**
 * Adds a relation between the name of library of things loaded into this search index and the path where that
 * library's things are stored at.
 * @param {Object} searchIndex
 * @param {string} path             The path to a folder on this computer's file system where a library's things are
 *                                  stored at.
 * @param {Library} library         A library of things.
 */
const addLibrary = (searchIndex, path, library) => {
  if (path && library) {
    searchIndex.libraries[path] = library
  } else {
    throw new Error('Missing required parameter. path = "' + path + '", library = ' + library)
  }
}

/**
 * Adds, and returns, a search result to the given collection of search results.
 * @param searcher          A search index.
 * @param searchResults     A collection of results from a search performed by the given searcher.
 * @param result            A search result.
 * @returns {object}        A new search result added to the given collection of search results.
 */
const addSearchResult = (searchIndex, searchResults, result) => {
  let searchResult
  const id = result.ref ? fileNameToId(searchIndex.libraries, result.ref) : ''
  const href = idToHref(searchIndex, id)
  searchResult = { href, id, score: result.score }
  searchResults.searchItems.push(searchResult)
  return searchResult
}

const buildIndex = (searchIndex) => {
  searchIndex.index = searchIndex.indexBuilder.build()
}

/**
 * Compares two strings and returns how to lexically order them for ascending or descending, case-insenstive sorts.
 * @param {string} string1   A string.
 * @param {string} string2   A string.
 * @param {string} sortOrder 'descending' if the strings are to be sorted in descending alphabetical order. Otherwise,
 *                           sort in ascending order.
 * @returns {number} -1 if string1 comes before string2, 0 if the strings are case-insensitively equivalent, and 1
 *                   if string1 comes after string1.
 */
const compareStrings = (string1, string2, sortOrder) => {
  if (!sortOrder) {
    return 0
  }
  const isAscending = (sortOrder !== '-1')
  const value1 = string1.toLowerCase()
  const value2 = string2.toLowerCase()
  if (value1 < value2) {
    return isAscending ? -1 : 1
  } else if (value1 > value2) {
    return isAscending ? 1 : -1
  }
  return 0
}

const libraryForFile = (searchIndex, fileName) => {
  if (searchIndex && fileName && searchIndex.libraries) {
    const libraryPath = Object.keys(searchIndex.libraries).find(path => {
      return fileName.indexOf(path) === 0
    })
    if (libraryPath) {
      return searchIndex.libraries[libraryPath]
    }
  }
  return null
  //   if (library) {
  //     return searchIndex.libraries[]
  //   }
  //   return Object.keys(searchIndex.libraries).forEach(function (path) {
  //     if (fileName.indexOf(path) === 0) {
  //       return searchIndex.libraries[path]
  //     }
  //   })
  // }
  // return null
}

const fileNameToId = (libraries, fileName) => {
  if (libraries && fileName)
    for (let path in libraries) {{
      if (fileName.indexOf(path) === 0) {
        return fileName.slice(path.length)
      }
    }
  }
  return ''
}

/**
 * Returns an HTML link href attribute value that refers to the thing with the given unique id.
 * @param {SearchIndex} searcher  This searcher.
 * @param {string} id  A thing's unique identifier.
 * @returns {string} A uniform resource locator.
 */
const idToHref = (searcher, id) => {
  const { applicationName, baseUrl } = searcher.configuration
  //return encodeURI(`${baseUrl}/${applicationName}/${id.split('/').slice(4, id.split('/').length - 1).join('/')}`)
  return encodeURI(`${baseUrl}/${applicationName}${id}`)
}

/**
 * Is the given string a reference to a persistent thing?
 * @param {string} value    A string.
 * @returns {boolean}       True if the given thing is a reference to a thing.
 */
const isLink = (value) => {
  return (value.length > 1) && (value.substring(0, 1) === '<') && (value.substring(value.length - 1) === '>')
}

/**
 * Is the file at the given path a hidden file. In *nix operating systems, files whose names begin with a period
 * are hidden files.
 * @param {string} path         Path to a file.
 * @returns {boolean}           True if the given path refers to a hidden file.
 */
const isNotHiddenFile = (path) => {
  const components = path.split('/')
  const name = components.slice(components.length - 1).join()
  return name && (name.length > 0) && (name[0] !== '.')
}

/**
 * Returns the number of thing a given thing links to (references).
 * @param {Thing} thing     A persistent thing.
 * @returns {number}        The number of references to other things that the given thing contains.
 */
const linkCount = (thing) => {
  let count = 0
  Object.keys(thing).forEach(function (property) {
    const value = thing[property]
    if (typeof value === 'string') {
      if (isLink(value)) {
        count += 1
      }
    } else if (value instanceof Array) {
      value.forEach(function (item) {
        if (isLink(item)) {
          count += 1
        }
      })
    } else if (value instanceof Object) {
      Object.keys(value).forEach(function (p) {
        if (isLink(p)) {
          count += 1
        }
      })
    }
  })
  return count
}

/**
 * Loads things to be searched into this search index.
 * @param {Object} searchIndex The search index to load with information to search.
 * @param {string} basePath         Path to where a library of things are stored.
 * @param {string} path             Path to a folder to begin loading from.
 * @param {function} next           Function called once things have been loaded.
 */
const load = (searchIndex, basePath, path, callback) => {
  const loggingContext = 'SearchIndex.load'
  if (basePath && path) {
    const work = []
    logger.info(loggingContext, 'Loading search information from "' + basePath + path + '"')
    fs.stat(basePath + path, function (error, status) {
      if (error) {
        logger.error(loggingContext, 'Could not read search information from "' + basePath + path + '"')
      } else {
        if (status.isDirectory()) {
          logger.debug(
            loggingContext, 'Reading search information from the directory "' + basePath + path  + '"')
          fs.readdir(basePath + path, function (error, files) {
            if (error) {
              logger.error(loggingContext, error)
            } else {
              files.forEach(function (file) {
                work.push(function (next) {
                  load(searchIndex, basePath, path + '/' + file, next)
                })
              })
              worker.doWork(work, function () {
                callback()
              })
            }
          })
        } else {
          if ((basePath + path).split('/').pop() === 'thing.json') {
            work.push(function (next) {
              loadFile(searchIndex, basePath, path, searchIndex, next)
            })
          }
          worker.doWork(work, function () {
            callback()
          })
        }
      }
    })
  } else {
    next()
  }
}

/**
 * Loads a file's contents into this search index.
 * @param {Object} searchIndex
 * @param {string} basePath     Path to a folder where a library of things are stored.
 * @param {string} fileName     Name of the file to load.
 * @param index                 Search index to store file's contents into.
 * @param {function} next       Function called once a file's contents have been loaded.
 */
const loadFile = (searchIndex, basePath, fileName, index, next) => {
  const loggingContext = 'SearchIndex.loadFile'
  logger.info(loggingContext, 'Reading search information from the file "' + basePath + fileName + '"')
  fs.readFile(basePath + fileName, function (error, data) {
    let object
    if (error) {
      logger.error(loggingContext, error)
    } else {
      try {
        const id = `${fileName.slice(0, fileName.indexOf('/thing.json'))}`
        object = JSON.parse(data)
        object.fileName = basePath + fileName
        searchIndex.indexBuilder.add(object)
      } catch (exception) {
        logger.error(loadFile.name, `Load file "${fileName}" failed`, exception.message)
        throw exception;
      }
    }
    next()
  })
}

/**
 * Creates, and returns, a new search index.
 * @param {ApplicationConfiguration} configuration  Configuration information for the application that the search
 *                                                  index is part of.
 * @returns {SearchIndex} newInstance               A new search index.
 *
function newInstance (configuration) {
  return new SearchIndex(configuration)
}
 */

const retrieveTypeForId = (library, thingId) => {
  let thingType = null
  if (library && thingId) {
    const typeId = library.typeIdForId(thingId)
    if (typeId && library.types) {
      thingType = library.types['<' + typeId + '>']
      if ((!thingType) && library.parent && library.parent.types) {
        thingType = library.parent.types['<' + typeId + '>']
      }
    }
  } else {
    throw new Exception('Library and thingId are required')
  }
  return thingType
}

/**
 * Searches this search index's contents.
 * @param {Object} searchIndex     Indexed information to search.
 * @param {string} userId               Unique identifier of the user that is requesting to search.
 * @param {string} query                Query part of URL that is requesting search results.
 * @param request                       HTTP request.
 * @param response                      Search results.
 */
const search = (searchIndex, userId, query, request, response) => {
  const { configuration } = searchIndex
  let endOffset
  // Convert search text into a query string that will search for documents where all words in the
  // search text appear in the document.
  // TODO - The query text is entered by the user and is an attack vector. The string should be sanitized
  // (make sure it doesn't contain problem characters), and its maximum length should be capped.
  let searchText = '+' + decodeURI(query.q).replace(/ /g, ' +')
  let resultLimit = Math.min(query.limit || searchIndex.configuration.collectionLimit, searchIndex.configuration.collectionLimit)
  let results = []
  try {
    results = searchIndex.index.search(searchText)
  } catch (error) {
    logger.error('search', error.errorMessage)
  }
  let searchFields = {
    'description': 'Full description',
    'id': 'ID',
    'name': 'Name',
    'shortDescription': 'Short description',
    'title': 'Title'
  }
  let searchResults = {}
  let sortBy = query.sortBy
  let sortOrder = query.sortOrder
  let startOffset = query.offset ? parseInt(query.offset, 10) : 0
  let work = []
  if (results && results.length) {
    if (results.length > searchIndex.configuration.maximumSearchResultCount) {
      response.writeHeader(413, { 'Content-Type': 'application/json' })
      response.write(
        'Found ' +
        results.length +
        ' things matching \'' +
        searchText +
        '\', which are too many to return. Please refine your search to match fewer things.'
      )
      response.end()
    } else {
      endOffset = startOffset + resultLimit
      searchResults.total = 0
      searchResults.searchItems = []
      searchResults.text = searchText
      results.forEach(function (result, index) {
        let fileName = results[index].ref
        let id
        let searcher = searchIndex
        let searchResult
        let thing
        searchResults.limit = resultLimit
        searchResults.offset = startOffset
        if ((index >= startOffset) && (index < endOffset)) {
          work.push(function (next) {
            const library = libraryForFile(searcher, fileName)
            if (library) {
              const context = QueryContext.newInstance(
                configuration,
                QueryResultsHandler.newInstance(
                  function userNotFoundError (context) {
                    const message = 'Could not find the user with the id ' +
                      `${userId}" who has requested to search for information.`
                    logger.error(message)
                    throw new Error(message)
                  },
                  null,
                  null,
                  null,
                  null
                ),
                request,
                response,
                library,
                userId,
                '/types/users/Administrator',
                false,
                false
              )
              library.fetchUser(context, (user) => {
                if (library.canRead(
                  library,
                  '<' + fileName.slice(fileName.indexOf('/types'), fileName.length - fileName.split('/').slice(-1)[0].length - 1) + '>',
                  context.user,
                  context.userId)) {
                  fs.readFile(fileName, function (error, data) {
                    let foundInProperties = [],
                      lowerCaseQuery = searchText.toLowerCase(),
                      property,
                      propertyResult
                    if (error) {
                      logger.error(error)
                    } else {
                      searchResults.total += 1
                      searchResult = addSearchResult(searcher, searchResults, result)
                      thing = JSON.parse(data)
                      if ({}.hasOwnProperty.call(thing, 'pictures') && Object.keys(thing.pictures > 0)) {
                        const pictureId = Object.keys(thing.pictures)[0]
                        const pictureQueryContext = QueryContext.newInstance(
                          configuration,
                          QueryResultsHandler.newInstance(
                            function resourceNotFound (context, error) {
                              logger.error(`Could not find resource with the id "${pictureId}".`)
                              logger.error(message)
                              throw new Error(message)
                            },
                            null,
                            null,
                            function (context) {
                              if (context &&
                                context.result &&
                                context.result.representations &&
                                context.result.representations.members &&
                                (context.result.representations.members.length > 0)) {
                                searchResult.thumbnails = []
                                context.result.representations.members.forEach(representation => {
                                  searchResult.thumbnails.push({
                                    href: Object.hasOwnProperty.call(representation, 'href') ? representation.href : '',
                                    name: representation.name
                                  })
                                })
                              }
                              id = fileName.slice(fileName.indexOf('/types'), fileName.length)
                              searchResult.id = id.slice(0, id.indexOf('/thing.json'))
                              searchResult.index = index + 1
                              searchResult.links = linkCount(thing)
                              searchResult.name = thing.name
                              searchResult.path = thing.path
                              const itemTypeId = library.typeIdForId(searchResult.id)
                              const itemType = retrieveTypeForId(library, itemTypeId || '/types')
                              if (itemType) {
                                searchResult.typeId = itemTypeId
                                searchResult.typeName = itemType.singularName || itemType.name
                              }
                              for (property in searchFields) {
                                if (searchFields.hasOwnProperty(property) && (property !== 'name')) {
                                  if (thing[property] && (thing[property].toLowerCase().indexOf(lowerCaseQuery) >= 0)) {
                                    propertyResult = {}
                                    propertyResult.name = searchFields[property]
                                    propertyResult.value = thing[property]
                                    foundInProperties.push(propertyResult)
                                  }
                                }
                              }
                              if (foundInProperties.length > 0) {
                                searchResult.foundInProperties = foundInProperties
                              }
                              next()
                            },
                          ),
                          request,
                          response,
                          library,
                          pictureId.slice(1, pictureId.length - 1),
                          userId,
                          false,
                          false
                        )
                        const pictureRef = Object.keys(thing.pictures)[0]
                        pictureQueryContext.resourceId = pictureRef.slice(1, pictureRef.length - 1)
                        pictureQueryContext.user = context.user
                        library.query(pictureQueryContext)
                      } else {
                        id = fileName.slice(fileName.indexOf('/types'), fileName.length)
                        searchResult.id = id.slice(0, id.indexOf('/thing.json'))
                        searchResult.index = index + 1
                        searchResult.links = linkCount(thing)
                        searchResult.name = thing.name
                        searchResult.path = thing.path
                        const itemTypeId = library.typeIdForId(searchResult.id)
                        const itemType = retrieveTypeForId(library, itemTypeId || '/types')
                        if (itemType) {
                          searchResult.typeId = itemTypeId
                          searchResult.typeName = itemType.singularName || itemType.name
                        }
                        // if ({}.hasOwnProperty.call(thing, 'pictures')) {
                        //   const pictureIds = Object.keys(thing.pictures)
                        //   searchResult.pictures = {
                        //     members: pictureIds.map(id => {
                        //       const pictureId = id.slice(1, id.length - 1)
                        //       return { href: idToHref(searchIndex, pictureId), id: pictureId }
                        //     }),
                        //     totalCount: pictureIds.length
                        //   }
                        // }
                        for (property in searchFields) {
                          if (searchFields.hasOwnProperty(property) && (property !== 'name')) {
                            if (thing[property] && (thing[property].toLowerCase().indexOf(lowerCaseQuery) >= 0)) {
                              propertyResult = {}
                              propertyResult.name = searchFields[property]
                              propertyResult.value = thing[property]
                              foundInProperties.push(propertyResult)
                            }
                          }
                        }
                        if (foundInProperties.length > 0) {
                          searchResult.foundInProperties = foundInProperties
                        }
                        next()
                      }
                    }
                  })
                }
                else {
                  logger.debug(`The user with the id "${context.userId}" does not have permission to read the file "${'<' + fileName.slice(fileName.indexOf('/types'), fileName.length - fileName.split('/').slice(-1)[0].length - 1) + '>'}"`)
                  next()
                }
              })
            }
          })
        }
        // return sortBy ? false : (index >= endOffset)
      })
      worker.doWork(
        work,
        function () {
          response.writeHeader(200, { 'Content-Type': 'application/json ' })
          searchResults.searchItems = sortSearchResults(searchResults.searchItems, sortBy, sortOrder)
          searchResults.searchItems.forEach((item, index) => {
            item.index = index
          })
          // TODO - return the subset of search results that were requested.
          response.write(JSON.stringify(searchResults))
          response.end()
        },
        resultLimit
      )
    }
  } else {
    response.writeHeader(404, { 'Content-Type': 'text/plain' })
    response.write('404 Not Found' + ((query && query.q) ? 'Search did not find \'' + query.q + '\'' : ''))
    response.end()
  }
}

const sortSearchResults = (foundThings, sortBy, sortOrder) => {
  const sortedThings = foundThings.slice()
  if (sortBy) {
    if (sortBy === 'name') {
      sortedThings.sort(function (item1, item2) {
        return compareStrings(item1.name, item2.name, sortOrder)
      })
    } else if (sortBy === 'link') {
      sortedThings.sort(function (item1, item2) {
        let result = item1.linkCount.parseInt() - item2.linkCount.parseInt()
        if (sortDirection === '-1') {
          result *= -1
        }
        return result
      })
    } else if (sortBy === 'type') {
      sortedThings.sort(function (item1, item2) {
        return compareStrings(item1.typeName, item2.typeName, sortOrder)
      })
    }
  }
  return sortedThings
}

/*
exports.newInstance = newInstance
exports.load = load
exports.search = search
 */
exports.SearchIndex = SearchIndex
