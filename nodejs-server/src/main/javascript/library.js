/**
 * Libraries contain persistent things. Persistent things have unique identifiers, and contain properties (named
 * values).
 */

/** Converts data that represents things into JSON. */
let converter = require('./converter')

/** File system module. **/
let fs = require('fs')

/* - ISO */
const git = require('isomorphic-git')

/**
 * This class' logger.
 * @type {Logger}
 */
const logger = require('sqwerl-logger').newInstance('Library')

const moment = require('moment')

/**
 * HTTP static file server. Serves contents of files to clients.
 * @type {*}
 */
const nodeStatic = require('../../../node_modules/node-static')

/**
 * Information necessary for this library to perform a query.
 * @type {*}
 */
const QueryContext = require('./query_context')

/**
 * Receives a library query's results.
 * @type {*}
 */
const QueryResultsHandler = require('./query_results_handler')

/**
 * How many days in the past a library change needs to occur in to be considered a recent change?
 * @type {number}
 */
const RECENT_CHANGES_NUMBER_OF_DAYS = 30

/**
 * Runs a limited number of tasks concurrently.
 * @type {ThrottledWorker}
 */
const throttledWorker = require('./throttled_worker').newInstance()

/**
 * Name of files that contain a persistent object's properties.
 * @type {string}
 */
const thingDefinitionFileName = 'thing.json'

/**
 * Name of files that contain metadata that define types of things.
 * @type {string}
 */
const typeDefinitionFileName = 'type.json'

/**
 * JSON formatter.
 */
const writeJsonFile = require('write-json-file')

/**
 * Creates, initializes, and returns a new library of persistent things. This constructor is synchronous.
 * @param configuration Configuration information for the application this library is part of.
 * @constructor
 */
function Library (configuration) {
  const library = this
  let message
  const methodName = 'Library'
  const {
    applicationName,
    home,
    name,
    parent,
    repositoryPath,
    writablePath
  } = configuration
  logger.info(
    methodName,
    `Creating library named "${name}" stored at "${home}", in the repository located at "${repositoryPath}" ` +
    (parent ? ' with the parent library "' + parent.name + '"' : '') +
    ` for the application "${applicationName}"`)
  if (!applicationName) {
    message = 'A non-null, non-empty application name is required.'
    logger.error(methodName, message)
    throw new Error(message)
  }
  if (!name) {
    message = 'Library name must not be null or empty.'
    logger.error(methodName, message)
    throw new Error(message)
  }
  if (!home) {
    message = 'Library path is required.'
    logger.error(methodName, message)
    throw new Error(message)
  }
  if (!repositoryPath) {
    message = 'Repository path must not be null or empty.'
    logger.error(methodName, message)
    throw new Error(message)
  }
  if (!writablePath) {
    message = 'Writable path must not be null or empty'
    logger.error(methodName, message)
    throw new Error(message)
  }
  this.addIsTypeAttribute = addIsTypeAttribute
  this.applicationName = applicationName
  this.cache = {}
  this.canRead = canRead
  this.canReadAccessControlLists = {}
  this.canWriteAccessControlLists = {}
  this.caseSensitiveFileStatus = caseSensitiveFileStatus
  this.caseSensitivePaths = { 'types': {} }
  this.fileServer = new (nodeStatic.Server)(home, {})
  this.fetchAccount = fetchAccount
  this.fetchUser = fetchUser
  this.home = home
  this.initializeSecurity = initializeSecurity
  this.name = name
  const representations = []
  this.numberOfThings =
    calculateThingCount(this, home + '/types', 0, this.caseSensitivePaths.types, representations)
  loadRepresentationAccessControls(this, representations)
  this.parent = parent
  if (!parent) {
    this.updateLastSignedInTime = updateLastSignedInTime
  }
  this.repositoryPath = repositoryPath
  this.query = query
  this.recentChanges = recentChanges
//  this.thumbnailUrl = thumbnailUrl
  this.thingCount = thingCount
  this.typeIdForId = typeIdForId
  this.typeIdForPath = typeIdForPath
  this.types = fetchTypes(this, home + '/types', {}, '</types>')
  this.types.typeTree = buildTypeTree(this.types)
  this.writablePath = writablePath
  if (this.types) {
    Object.keys(this.types).forEach(typeId => {
      addInheritedPropertyDefinitions(library, typeId, this.types[typeId])
    })
  }
}

/**
 * Adds inherited property definitions to a type of thing. Adds to a type of thing the properties defined by (and
 * inherited from) the type's ancestor types, and also adds the properties defined by any of the type's facets. Facets
 * are definitions of common properties that many different types of things may have.
 * @param {Library} library         A library of things.
 * @param {string} typeId           Unique identifier for a type of thing.
 * @param {Object} typeDefinition   Defines the properties of a type of thing that the given library may contain.
 */
function addInheritedPropertyDefinitions (library, typeId, typeDefinition) {
  let components = typeId.slice(1, typeId.length - 1).split('/')
  const methodName = 'addInheritedPropertyDefinitions'
  logger.info(methodName, `Adding inherited properties to type "${typeId}" in library named "${library.name}"`)
  if (typeDefinition.hasOwnProperty('facets')) {
    for (let facet in typeDefinition.facets) {
      let facetId = '</' + facet.slice(1, facet.length - 1).split('/').slice(3).join('/') + '>'
      inheritProperties(library, typeId, typeDefinition, facetId)
    }
  }
  if (components.length > 2) {
    if (!typeDefinition.properties) {
      typeDefinition.properties = {}
    }
    // For all the given type's ancestor types: the types that the given type inherits properties from...
    for (let i = components.length - 1; i > 1; i--) {
      inheritProperties(library, typeId, typeDefinition, '</' + components.slice(1, i).join('/') + '>')
    }
    if (Object.keys(typeDefinition.properties).length === 0) {
      delete typeDefinition.properties
    }
  }
}

/**
 * Sets a result object's 'isType' property if a query result is a definition for a type of thing.
 * @param {Library} library     Library of things.
 * @param {string} resourceId   Id of thing to return.
 * @param {Object} thing        Object to add isType property to.
 */
function addIsTypeAttribute (library, resourceId, thing) {
  if (isTypeOfThing(library, resourceId)) {
    thing.isType = true
  }
}

/**
 * Builds and returns a tree data structure of types of things and their subtypes from a collection of unique
 * type identifiers.
 * @param {Object } types  Object whose properties are unique identifiers for types of things.
 */
function buildTypeTree (types) {
  let typeTree = {}
  for (let id in types) {
    if ((id.length > 3) && (id.indexOf('<') === 0)) {
      let p = typeTree
      id.slice(2, id.length - 1).split('/').forEach(component => {
        if (p.hasOwnProperty(component)) {
          p = p[component]
        } else {
          p[component] = {}
          p = p[component]
        }
      })
    }
  }
  return typeTree
}

function calculateAccessControlFromAncestor (library, folderName, thing, accessType) {
  const components = folderName.split('/')
  for (let i = components.length - 1; i > 1; i--) {
    const key = `<${components.slice(0, i).join('/')}>`
    if (accessType === 'canRead') {
      const access = library.canReadAccessControlLists[key]
      if (access) {
        library.canReadAccessControlLists[`<${folderName}/${thing.id}>`].canRead = true
        break;
      }
    } else {
      const access = library.canWriteAccessControlLists[key]
      if (access) {
        library.canWriteAccessControlLists[`<${folderName}/${thing.id}>`].canWrite = true
        break;
      }
    }
  }
}

/**
 * Calculates the number of things contained within a given library.
 * @param {Object} library              A library of things.
 * @param {string} folderName           The absolute path to the file system folder where given library exists.
 * @param count                         A running count of the number of things in the given library.
 * @param {Object} caseSensitivePath    Item within a hierarchy of folders and files with case-sensitive names.
 * @param {string[]} representations    Names of files whose contents refer to a thing's digital representations.
 * @returns {number} The number of things stored in the given library.
 */
function calculateThingCount (
    library, folderName, count, caseSensitivePath, representations) {
  const files = fs.readdirSync(folderName)
  files.forEach((fileName) => {
    let path = {}
    if (fileName === thingDefinitionFileName) {
      count += 1
      let data = fs.readFileSync(folderName + '/' + fileName)
      if (data) {
        let thing = JSON.parse(data)
        if (thing.canRead) {
          library.canReadAccessControlLists[`<${folderName.slice(library.home.length)}>`] = thing.canRead
        }
        if (thing.canWrite) {
          library.canWriteAccessControlLists[`<${folderName.slice(library.home.length)}>`] = thing.canWrite
        }
        if (thing.representations) {
          for (let representationId in thing.representations) {
            representations.push(`${folderName}/${representationId}`)
          }
        }
        if (thing.children) {
          caseSensitivePath.children = Object.assign({}, thing.children)
        }
      }
    } else if (fileName.slice(0, 1) !== '.') {
      caseSensitivePath[fileName] = path
      let nextFolderName = `${folderName}/${fileName}`
      let stats = fs.statSync(nextFolderName)
      if (stats.isDirectory()) {
        path.isLeaf = false
        count = calculateThingCount(library, nextFolderName, count, path, representations)
      } else {
        path.isLeaf = true
      }
    }
  })
  return count
}

/**
 * Is a user querying a resource's state allowed to read the resource?
 * @param {Library} library     Library where the resource is stored.
 * @param {string} resourceId   The resource's unique identifier.
 * @param {object} user         User requesting to read the resource.
 * @param {string} userId       Unique identifier of user requesting to read the resource.
 * @return {boolean} true if the querying user is allowed to read a queried resource's state.
 */
function canRead (library, resourceId, user, userId) {
  const methodName = 'canRead'
  let userCanRead = true
  if (library.parent && (!canRead(library.parent, resourceId, user, userId))) {
    userCanRead = false
  } else {
    let hasReadAcl = library.canReadAccessControlLists.hasOwnProperty(resourceId)
    if (hasReadAcl) {
      userCanRead = false
      if (userControlsResource(resourceId, user, userId) || userIsAdministrator(user, userId)) {
        userCanRead = true
      } else {
        // The user can read the resource if he or she has been granted read permission by the thing's
        // read access control list.
        const readAcl = library.canReadAccessControlLists[resourceId]
        return isUserOrGroupInAcl(readAcl, userId, user)
      }
    } else if (resourceId.indexOf('</types/collections') === 0) {
      // Traverse up the collection hierarchy. Closest ancestor with a can read access control
      // determines whether the user can read the thing.
      const components = resourceId.split('/')
      for (let i = components.length - 1; i > 2; i--) {
        const ancestorKey = `</${components.slice(1, i).join('/')}>`
        let hasReadAcl = library.canReadAccessControlLists.hasOwnProperty(ancestorKey)
        if (hasReadAcl) {
          userCanRead = false
          const readAcl = library.canReadAccessControlLists[ancestorKey]
          return isUserOrGroupInAcl(readAcl, userId, user)
        }
      }
      return userCanRead
    }
  }
  logger.debug(
    methodName,
    `User with id "${userId}" ${userCanRead ? 'can read' : 'cannot read'} thing with id "${resourceId}"`)
  return userCanRead
}

function caseSensitiveFileStatus (library, path, caseSensitivePath, callback) {
  let folder = null
  if (path) {
    let files = library.caseSensitivePaths
    let parent = null
    let thing = null
    for (let i = 0; i < path.length; i++) {
      let pathComponent = path[i]
      if (pathComponent !== 'children') {
        thing = files[pathComponent]
        if (thing) {
          files = files[pathComponent]
        } else {
          if (parent && parent.children) {
            Object.keys(parent.children).some(child => {
              let id = child.slice(1, child.length - 1)
              let components = id.split('/')
              if (components[components.length - 1] === pathComponent) {
                let route = library.caseSensitivePaths
                components.slice(1).forEach(component => {
                  thing = route[component]
                  route = thing
                })
                if (thing) {
                  folder = id
                }
              }
            })
          }
        }
        parent = thing
      }
    }
    if (thing) {
      callback(null, { folder: folder, isDirectory: !thing.isLeaf })
    } else {
      callback(new Error('Could not find thing at path "' + path + '\"'), null)
    }
  }
}

/**
 * Converts an array of values to an external representation that contains information about the array's members.
 * @param {QueryContext} context                Query context.
 * @param {string} property                     Name of the object property whose value is the array to externalize.
 * @param propertyDefinition                    Defines what types of values an object's property can have.
 * @param externalization                       Externalized information that describes the collection.
 * @param propertyDefinition                    Defines what types of values an object's property can have.
 * @param {string} value                        Reference to a thing.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 * @param work                                  Array whose length indicates number members to externalize.
 * @param {Number} index                        Index of array member to externalize.
 */
function externalizeArray (context, property, propertyDefinition, externalization, value, resultsHandler, work, index) {
  const methodName = 'externalizeArray'
  if (isReference(value)) {
    externalizeReference(context, property, value.substring(1, value.length - 1), QueryResultsHandler.newInstance(
      resultsHandler.resourceNotFound,
      resultsHandler.returnFile,
      resultsHandler.returnLocalContent,
      (ctxt) => {
        externalization.members[index] = ctxt.result
        ctxt.result.position = index + 1
        work.pop()
        if (work.length === 0) {
          context.result = externalization
          logger.info(methodName, 'Externalized array of references into: ' + JSON.stringify(externalization))
          resultsHandler.returnObject(context)
        }
      },
      resultsHandler.userCannotRead
    ))
  } else {
    externalizeValue(context, property, propertyDefinition, value, QueryResultsHandler.newInstance(
      resultsHandler.resourceNotFound,
      resultsHandler.returnFile,
      resultsHandler.returnLocalContent,
      (ctxt) => {
        externalization.members[index] = ctxt.result
        ctxt.result.position = index + 1
        work.pop()
        if (work.length === 0) {
          context.result = externalization
          resultsHandler.returnObject(context)
        }
      },
      resultsHandler.userCannotRead
    ))
  }
}

/**
 * Converts a mapped set of values to an external representation that contains information about the
 * set's contents.
 * @param {QueryContext} context                Query context.
 * @param {string} property                     Name of the object property whose value is the hash to externalize.
 * @param propertyDefinition                    Defines what types of values an object's property can have.
 * @param externalization                       Externalized information that describes the mapped set.
 * @param value                                 Reference to a thing.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 * @param work                                  Array whose length indicates number of members in the set to
 *                                              externalize.
 * @param queue                                 List of hash members to externalize.
 * @param {Number} position                     Index (position within list) of item in hash to externalize.
 */
function externalizeHash (
  context, property, propertyDefinition, externalization, value, resultsHandler, work, queue, position) {
  let index
  if (isReference(value)) {
    externalizeReference(
      context,
      property,
      value ? value.substring(1, value.length - 1) : '',
      QueryResultsHandler.newInstance(
        function resourceNotFound () {
          externalization.members.push({ id: value })
          returnExternalizedObject(work, context, externalization, resultsHandler)
        },
        resultsHandler.returnFile,
        resultsHandler.returnLocalContent,
        function returnObject (innerContext) {
          index = work.indexOf('<' + innerContext.result.id + '>')
          externalization.members[index] = innerContext.result
          innerContext.result.position = position + 1
          queue.pop()
          returnExternalizedObject(queue.length, context, externalization, resultsHandler)
        },
        resultsHandler.userCannotRead
      )
    )
  } else {
    externalizeValue(
      context,
      property,
      propertyDefinition,
      value,
      QueryResultsHandler.newInstance(
        resultsHandler.resourceNotFound,
        resultsHandler.returnFile,
        resultsHandler.returnLocalContent,
        (innerContext) => {
          externalization.members[0] = innerContext.result
          innerContext.result.posiiton = index + 1
          returnExternalizedObject(0, context, externalization, resultsHandler)
        },
        resultsHandler.userCannotRead
      )
    )
  }
}

function externalizePicture(context, property, reference, externalization, resultsHandler, callback) {
  const { configuration } = context
  const methodName = 'externalizePicture'
  externalization.thumbnails = []
  const pictureId = Object.keys(context.result.pictures)[0].slice(1, -1)
  const picturedThing = context.result
  queryResource(
    context,
    'pictures',
    pictureId,
    QueryResultsHandler.newInstance(
      resultsHandler.resourceNotFound,
      resultsHandler.returnFile,
      resultsHandler.returnLocalContent,
      (ctxt2) => {
        const { result } = ctxt2
        if (ctxt2.result.hasOwnProperty('representations')) {
          const work = []
          let representationsCount = Object.keys(result.representations).length
          for (let r in result.representations) {
            // Read each representation file and return each file's contents in a collection of
            // representations.
            const file = ctxt2.library.home + pictureId + '/' + r
            fs.stat(file, (err, stats) => {
              if (err) {
                logger.warn(`Failed to retrieve state of representation file "${file}. Error: ${err}"`)
                representationsCount -= 1
              } else if (stats.isDirectory()) {
                logger.error(`The representation file name "${file}" is a directory. It must be a file.`)
                representationsCount -= 1
              } else {
                if (ctxt2.library.canRead(ctxt2.library, file, ctxt2.user, ctxt2.userId)) {
                  representationsCount -= 1
                  work.push(function (next) {
                    fs.readFile(file, function (error, data) {
                      if (error) {
                        logger.error(`Failed to read representation file "${file}". Error: ${error}`)
                      } else {
                        const referenceData = JSON.parse(data)
                        const thumbnail = {}
                        let name = ''
                        if ({}.hasOwnProperty.call(referenceData, 'name')) {
                          name = referenceData.name
                        }
                        if ({}.hasOwnProperty.call(referenceData, 'href')) {
                          thumbnail.href = referenceData.href
                        } else {
                          // TODO - The base URL should come from the server configuration as the
                          // content server. Also, we need to secure content on the content server so users
                          // can only retrieve the content they are allowed to.
                          thumbnail.href = encodeURI(`${configuration.contentUrl}${pictureId}/${name}`)
                        }
                        if ({}.hasOwnProperty.call(referenceData, 'name')) {
                          thumbnail.name = name
                        }
                        externalization.thumbnails.push(thumbnail)
                        next()
                      }
                    })
                  })
                  if (representationsCount <= 0) {
                    throttledWorker.doWork(work, function () {
                      let inversePropertyName
                      let references
                      const type = fetchTypeDefinition(ctxt2.library, picturedThing.type)
                      if (type) {
                        if (type.singularName) {
                          externalization.typeName = type.singularName
                        }
                        if (type.isNamePlural) {
                          externalization.isTypeNamePlural = true
                        }
                      }
                      callback()
                      // if (context.property) {
                      //   inversePropertyName = fetchInversePropertyName(context.library, reference, property)
                      //   if (inversePropertyName && context.result.hasOwnProperty(inversePropertyName)) {
                      //     references = context.result[inversePropertyName]
                      //     let count = Object.keys(references).length
                      //     externalization[inversePropertyName + 'Count'] = count
                      //   }
                      // }
                      // logger.info(methodName, `Externalized the reference "${reference}"`)
                      // addIsTypeAttribute(context.library, externalization.id, externalization)
                      // context.result = externalization
                      // resultsHandler.returnObject(context)
                    })
                  }
                }
              }
            })
          }
        }
      }
    )
  )
}

function externalizeRepresentation (context, property, propertyDefinition, record, representationId, resultsHandler, work, i) {
  const methodName = 'externalizeRepresentation'
  const { configuration } = context
  // If the representation is a link to another file
  queryResource(
    context,
    'representations',
    representationId,
    QueryResultsHandler.newInstance(
      resultsHandler.resourceNotFound,
      (context, qualifiedName) => {
        // TODO - Check if the file is in the library cache, pull from cache if it is.
        if (canRead(context.library, '<' + representationId + '>', context.user, context.userId)) {
          fs.readFile(
            qualifiedName,
            (error, data) => {
              if (error) {
                resultsHandler.resourceNotFound(
                  context, { message: `Could not find the representation with the ID ${representationId}"` })
              } else {
                logger.debug(`Read the representation file ${qualifiedName}`)
                // TODO - Put the file in the library cache.
                if (data) {
                  const representation = JSON.parse(data)
                  let member = null
                  if (representation.hasOwnProperty('href')) {
                    member = {
                      'href': representation.href,
                      'name': representation.name || '',
                      'title': representation.title || ''
                    }
                  } else if (representation.hasOwnProperty('name')) {
                    const components = representationId.split('/')
                    const path = components.slice(0, components.length - 1).join('/')
                    member = {
                      // TODO - The base URL should come from the server configuration as the
                      // content server. Also, we need to secure content on the content server so users
                      // can only retrieve the content they are allowed to.
                      'href': `${configuration.contentUrl}/${context.library.name}${path}/${representation.name}/representation`,
                      'name': representation.name,
                      'title': representation.title
                    }
                  }
                  if (member) {
                    record.members[i] = member
                    work.pop()
                    if (work.length === 0) {
                      context.result = record
                      resultsHandler.returnObject(context)
                    }
                  }
                }
              }
            })
        } else {
          resultsHandler.userCannotRead(context)
        }
      },
      resultsHandler.returnLocalContent,
      resultsHandler.returnObject,
      resultsHandler.userCannotRead
    )
  )
}

/**
 * Converts a reference to a thing into an externalized representation that summarizes the referenced thing.
 * @param {QueryContext} context                Query context.
 * @param {string} property                     Name of the object property whose value is the reference to externalize.
 * @param {string} reference                    Reference to a thing.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 */
function externalizeReference (context, property, reference, resultsHandler) {
  const methodName = 'externalizeReference'
  context.externalizeReferences = false
  queryResource(
    context,
    property,
    reference,
    QueryResultsHandler.newInstance(
      resultsHandler.resourceNotFound,
      resultsHandler.returnFile,
      resultsHandler.returnLocalContent,
      (ctxt) => {
        let count
        const externalization = {
          href: ctxt.createHref(),
          id: reference,
          name: ctxt.result.name,
          path: ctxt.result.path,
          type: ctxt.result.type
        }
        let inversePropertyName
        let references
        const type = fetchTypeDefinition(ctxt.library, ctxt.result.type)
        if (type) {
          if (type.singularName) {
            externalization.typeName = type.singularName
          }
          if (type.isNamePlural) {
            externalization.isTypeNamePlural = true
          }
        }
        inversePropertyName = fetchInversePropertyName(ctxt.library, reference, property)
        if (inversePropertyName && ctxt.result.hasOwnProperty(inversePropertyName)) {
          references = ctxt.result[inversePropertyName]
          count = Object.keys(references).length
          externalization[inversePropertyName + 'Count'] = count
        }
        logger.info(methodName, `Externalized the reference "${reference}"`)
        addIsTypeAttribute(context.library, externalization.id, externalization)
        ctxt.result = externalization
        resultsHandler.returnObject(ctxt)
      },
      resultsHandler.userCannotRead
    )
  )
}

/**
 * Converts a thing's values that are references to things or collections of references to things into externalized
 * values that summarize the referenced things or collections of referenced things.
 * @param {QueryContext} context                Query context.
 * @param {Object} thing                        Thing whose properties will be externalized.
 * @param {string} resourceId                   Unique identifier of the thing to externalize.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 */
function externalizeThing (context, thing, resourceId, resultsHandler) {
  let definedProperties
  const methodName = 'externalizeThing'
  let p
  let properties = []
  let propertiesRemainingToBeProcessed = {}
  let propertiesToBeProcessed = {}
  let typeOfThing = fetchTypeDefinition(context.library, resourceId.split('/').slice(0, 3).join('/'))
  if (typeOfThing) {
    Object.keys(typeOfThing.properties).forEach((property) => {
      propertiesToBeProcessed[property] = typeOfThing.properties[property]
    })
    definedProperties = typeOfThing.properties
  }
  for (p in thing) {
    if (thing.hasOwnProperty(p)) {
      let propertyDefinition = propertiesToBeProcessed[p]
      if (propertyDefinition) {
        if (propertyDefinition.hasOwnProperty('private') && (propertyDefinition.private === true)) {
          delete definedProperties[p]
          delete propertiesToBeProcessed[p]
        } else {
          properties.push(p)
          propertiesRemainingToBeProcessed[p] = ''
        }
      }
      delete propertiesToBeProcessed[p]
    }
  }
  definedProperties.type = typeIdForId(resourceId)
  if (isTypeOfThing(context.library, resourceId, thing)) {
    definedProperties.isType = true
  }
  context.definedProperties = definedProperties
  let externalizedThing = {}
  for (p in definedProperties) {
    externalizedThing[p] = thing[p]
  }
  context.propertiesToBeProcessed = propertiesToBeProcessed
  properties.forEach((property) => {
    logger.info(methodName, 'Externalizing value of property named: ' + property)
    if (property === 'pictures') {
      const pictureIds = Object.keys(thing['pictures'])
      if (pictureIds.length > 0) {
        fetchThumbnailUrl(context, pictureIds[0].slice(1, pictureIds[0].length - 1), (thumbnailUrl) => {
          if (thumbnailUrl) {
            externalizedThing['thumbnailUrl'] = thumbnailUrl
          }
          externalizePropertyValue(
            context,
            typeOfThing,
            resourceId,
            propertiesRemainingToBeProcessed,
            property,
            definedProperties,
            externalizedThing,
            resultsHandler
          )
        })
      } else {
        externalizePropertyValue(
          context,
          typeOfThing,
          resourceId,
          propertiesRemainingToBeProcessed,
          property,
          definedProperties,
          externalizedThing,
          resultsHandler
        )
      }
    } else {
      externalizePropertyValue(
        context,
        typeOfThing,
        resourceId,
        propertiesRemainingToBeProcessed,
        property,
        definedProperties,
        externalizedThing,
        resultsHandler
      )
    }
  })
  if (Object.keys(propertiesRemainingToBeProcessed).length > 0) {
    logger.warn(
      methodName,
      `The following properties of the object with the id "${resourceId}" were not processed: \n` +
        `\n${Object.keys(propertiesRemainingToBeProcessed).forEach(p => p.name + ' ')}`
    )
  }
}

/**
 * Returns the value of a thing's property.
 * @param {QueryContext} context  Query context.
 * @param {Object} typeOfThing    The type of the thing that contains the property value.
 * @param {string} resourceId     The unique identifier of the thing with the property value.
 * @param {Object} remainingProperties Properties of a thing that haven't been externalized.
 * @param {string} property            The name of a thing's property to externalize.
 * @param {Object} definedProperties   A thing's properties.
 * @param {Function} externalizedThing Function to call to return a JSON definition of a thing.
 * @param {QueryResultsHandler} resultsHandler Returns results of a query against this library.
 */
function externalizePropertyValue(
  context,
  typeOfThing,
  resourceId,
  remainingProperties,
  property,
  definedProperties,
  externalizedThing,
  resultsHandler,
  ) {
  const methodName = externalizePropertyValue.name
  const library = context.library
  externalizeValue(
    context,
    property,
    definedProperties[property],
    externalizedThing[property],
    QueryResultsHandler.newInstance(
      resultsHandler.resourceNotFound,
      (ctxt, value) => {
        externalizedThing[property] = ctxt.applicationName +
          '/' + ctxt.library.name + ctxt.resourceId + '/' + value.slice(1, value.length - 1)
        logger.info(methodName, 'Set the property \'' + property + '\'' + 'to the externalized value: ' +
          JSON.stringify(externalizedThing[property]))
        delete remainingProperties[property]
        if (Object.keys(remainingProperties).length === 0) {
          ctxt.result = externalizedThing
          resultsHandler.returnObject(ctxt)
        }
      },
      resultsHandler.returnLocalContent,
      (ctxt) => {
        let externalizedValue = ctxt.result
        let propertyDefinition
        let work = []
        externalizedThing[property] = externalizedValue
        logger.info(
          methodName,
          'Set the property \'' + property + '\' to the externalized value: ' + JSON.stringify(externalizedValue))
        delete remainingProperties[property]
        if (Object.keys(remainingProperties).length === 0) {
          ctxt.result = externalizedThing
          ctxt.resourceId = resourceId
          if (ctxt.definedProperties && ctxt.propertiesToBeProcessed) {
            for (propertyDefinition in ctxt.definedProperties) {
              if (ctxt.propertiesToBeProcessed.hasOwnProperty(propertyDefinition)) {
                if (ctxt.definedProperties[propertyDefinition].hasOwnProperty('computed')) {
                  if (library.hasOwnProperty(propertyDefinition) &&
                    (typeof library[propertyDefinition] === 'function')) {
                    work.push(((property, next) => {
                      return (next) => {
                        library[property](library, ctxt).then((result) => {
                          ctxt.result[property] = result
                          next(result)
                        })
                      }
                    })(propertyDefinition))
                  }
                } else if (ctxt.definedProperties[propertyDefinition].hasOwnProperty === 'representations') {
                  // TODO - Handle a representations property.
                  logger.warn(methodName, 'Returning representations of things is not implemented.')
                } else if (ctxt.definedProperties[propertyDefinition].hasOwnProperty === 'picture') {

                }
                delete ctxt.propertiesToBeProcessed[propertyDefinition]
              }
            }
            if (work.length > 0) {
              throttledWorker.doWork(work, (results) => {
                resultsHandler.returnObject(ctxt)
              })
            } else {
              if (typeOfThing) {
                if (typeOfThing.singularName) {
                  externalizedThing['typeName'] = typeOfThing.singularName
                }
                if (typeOfThing.isNamePlural) {
                  externalizedThing['typeNameIsPlural'] = true
                }
              }
              resultsHandler.returnObject(ctxt)
            }
          } else {
            if (typeOfThing) {
              if (typeOfThing.singularName) {
                externalizedThing['typeName'] = typeOfThing.singularName
              }
              if (typeOfThing.isNamePlural) {
                externalizedThing['typeNameIsPlural'] = true
              }
            }
            resultsHandler.returnObject(ctxt)
          }
        }
      },
      resultsHandler.userCannotRead
    )
  )
}

/**
 * Converts the given value of a thing's property into an externalized value that may be a summary of the actual
 * value.
 * @param {QueryContext} context                Query context.
 * @param {string} property                     Name of the object property to assign the externalized value to.
 * @param {Object} propertyDefinition           Defines the type of value an object's property contains.
 * @param value                                 Value of a thing's property.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 */
function externalizeValue (context, property, propertyDefinition, value, resultsHandler) {
  let collectionLimit = context.configuration.collectionLimit
  let count
  let i
  let id
  let p
  let properties = []
  let queue
  let record
  let work = []
  if (typeof value === 'string') {
    id = value.trim()
    if (isReference(id)) {
      if (isAbsoluteReference(id)) {
        externalizeReference(context, property, value.substring(1, value.length - 1), resultsHandler)
      } else {
        resultsHandler.returnFile(context, value)
      }
    } else {
      context.result = value
      resultsHandler.returnObject(context)
    }
  } else if (value instanceof Array) {
    count = value.length
    record = {}
    record.limit = collectionLimit
    record.members = []
    record.offset = 0
    record.totalCount = value.length
    if (count === 0) {
      context.result = record
      resultsHandler.returnObject(context)
    } else {
      for (i = 0; i < count; i += 1) {
        if (canRead(context.library, value[i], context.user, context.userId)) {
          work.push(value[i])
        } else {
          record.totalCount -= 1
        }
      }
      count = work.length
      for (i = 0; i < count; i += 1) {
        externalizeArray(context, property, propertyDefinition, record, work[i], resultsHandler, work, i)
      }
    }
  } else if (value instanceof Object) {
    if (propertyDefinition && (propertyDefinition.type === 'representations')) {
      count = Object.keys(value).length
      record = {}
      record.limit = collectionLimit
      record.members = []
      record.offset = 0
      record.totalCount = count
      if (count === 0) {
        context.result = record
        resultsHandler.returnObject(context)
      } else {
        for (let representationId in value) {
          const representationPath = context.path + '/' + representationId
          if (canRead(context.library, `<${representationPath}>`, context.user, context.userId)) {
            work.push(representationPath)
          } else {
            record.totalCount -= 1
          }
        }
        count = work.length
        if (count === 0) {
          context.result = record
          resultsHandler.returnObject(context)
        } else {
          for (i = 0; i < count; i++) {
            externalizeRepresentation(context, property, propertyDefinition, record, work[i], resultsHandler, work, i)
          }
        }
      }
    } else {
      record = {
        limit: collectionLimit,
        offset: 0,
        totalCount: 0
      }
      count = 0
      for (p in value) {
        if (value.hasOwnProperty(p) && isReference(p)) {
          count += 1
          properties.push(p)
          record.totalCount += 1
        }
      }
      if (count === 0) {
        context.result = record
        resultsHandler.returnObject(context)
      } else {
        record.members = []
        for (i = 0; i < count; i += 1) {
          p = properties.pop()
          if (canRead(context.library, p, context.user, context.userId)) {
            work.unshift(p)
          } else {
            record.totalCount -= 1
          }
        }
        count = Math.min(work.length, record.limit)
        if (count === 0) {
          context.result = record
          resultsHandler.returnObject(context)
        } else {
          work = work.slice(0, count)
          queue = work.slice()
          for (i = 0; i < count; i += 1) {
            externalizeHash(context, property, propertyDefinition, record, work[i], resultsHandler, work, queue, i)
          }
        }
      }
    }
  } else {
    context.result = value
    resultsHandler.returnObject(context)
  }
}

/**
 * Asynchronously loads the Sqwerl account associated with the user with a given email address.
 * @param {Library} library            The library of things where the user's account is stored.
 * @param {string} email               A user's email address.
 * @param {string} password            A user's password.
 * @param {function} onAccountFetched  Invoked when an account for the user with the given id is found.
 * @param {function} onSuccess         Invoked later if the supplied email and password match a user's account.
 * @param {function} onFailure         Invoked later if the supplied email and password are not valid.
 */
function fetchAccount (library, email, password, onAccountFetched, onSuccess, onFailure) {
  let accountId
  if (library.emailsToAccounts) {
    accountId = library.emailsToAccounts[email]
    if (accountId) {
      fs.readFile(
        library.home + accountId.slice(1, accountId.length - 1) + '/' + thingDefinitionFileName,
        (error, data) => {
          if (error) {
            onFailure(error)
          } else {
            let account = JSON.parse(data)
            account.id = accountId
            onAccountFetched(library, account, email, password, onSuccess, onFailure)
          }
        }
      )
    } else {
      onFailure()
    }
  } else {
    onFailure()
  }
}

/**
 *
 * @param library       Library of things.
 * @param id            Unique identifier for a thing.
 * @param property      Name of a thing's property.
 * @returns {String}    The name of the inverse property of a related thing.
 */
function fetchInversePropertyName (library, id, property) {
  let facet
  let inversePropertyName
  let typeId = id.split('/').slice(0, 3).join('/')
  let typeDefinition = fetchTypeDefinition(library, typeId)
  inversePropertyName = inverseFor(typeDefinition, property)
  if ((!inversePropertyName) && typeDefinition && typeDefinition.hasOwnProperty('facets')) {
    for (facet in typeDefinition.facets) {
      if (typeDefinition.facets.hasOwnProperty(facet)) {
        inversePropertyName = inverseFor(fetchTypeDefinition(library, facet), property)
        if (inversePropertyName) {
          break
        }
      }
    }
  }
  return inversePropertyName
}

/**
 * Returns, to a client, a list of changes people have made to a library of things.
 * @param {QueryContext} context                Query context.
 * @param {String} resourceId                   Unique resource identifier.
 * @param {String[]} changeIds                  Ids of changes to return. If empty then return an error to the client.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 */
function fetchLibraryChanges (context, resourceId, changeIds, resultsHandler) {
  if (changeIds) {
    let library = context.library
    let changes = library.caseSensitivePaths
    let path = resourceId.split('/').slice(1)
    while (changes && (path.length > 0)) {
      changes = changes[path.shift()]
    }
    let requestedChanges = []
    let resultType = '/types/changes'
    const offset = requestedOffset(context)
    const limit = requestedLimit(context)
    if (changes) {
      const visibleChanges = {}
      changeIds.forEach(id => {
        const changeRecord = changes[id]
        if (changeRecord.changes.members) {
          const viewableChanges = changeRecord.changes.members.filter((change, index) => {
            if (change.typeOfChange === 'removed') {
              return includeChange(change, library, context.user, context.userId)
            }
            if (!change.id) {
              return false;
            }
            let fileExists = true
            idToFileName(library, change.id, fileName => {
              fileExists = !!fileName
            })
            return fileExists && includeChange(change, library, context.user, context.userId)
          })
          if (viewableChanges.length > 0) {
            visibleChanges[id] = {
              by: changeRecord.by,
              date: changeRecord.date,
              id: id,
              members: viewableChanges.filter(
                (change, index) => (index >= offset) && (index < (offset + limit))),
              totalCount: viewableChanges.length }
          }
        }
      })
      const changeCount = Object.keys(visibleChanges).length
      if (changeCount > 1) {
        resultType = '/types/changes/summary'
        Object.keys(visibleChanges).forEach(changeId => {
          const { by, date } = changes[changeId]
          requestedChanges.push({
            by,
            date,
            id: changeId,
            totalCount: visibleChanges[changeId].totalCount,
            url: `${context.configuration.baseUrl}/${context.library.name}` +
              `/${context.configuration.applicationName}/#${changeId}`
          })
        })
      } else if (changeCount === 1) {
        const visibleChange = visibleChanges[Object.keys(visibleChanges)[0]]
        if (visibleChange.members) {
          visibleChange.members.forEach(change => {
            if (change.typeOfChange !== 'removed') {
              change.href =
                encodeURI(
                  `${context.configuration.baseUrl}/${context.library.name}` +
                  `/${context.configuration.applicationName}/#${change.id}`)
            }
            change.date = visibleChange.date

            // TODO - Retrieve the changed thing. If it has pictures, return the picture information
            // to the client.
          })
        }
        const { by, date, members, totalCount } = visibleChange
        requestedChanges.push({ by, date, members, totalCount })
      }
    }
    context.result = {
      changes: requestedChanges,
      commits: changeIds,
      type: resultType
    }
    resultsHandler.returnObject(context)
  } else {
    resultsHandler.resourceNotFound(
      context, { message: 'Could not retrieve changes because of missing or invalid change ids.' })
  }
}

function fetchThumbnailUrl(context, pictureId, callback) {
  const methodName = fetchThumbnailUrl.name
  const newContext = QueryContext.newInstance(
    context.configuration,
    QueryResultsHandler.newInstance(
      function resourceNotFound (context2) {
        throw new Error(`Could not find the picture with the id "${pictureId}"`)
      },
      null, /* returnFileCallback */
      null, /* returnLocalContentCallback */
      function returnObject (context2) {
        let previewImageExists = false
        const picture = context2.result
        if (picture && (picture.hasOwnProperty('representations')) && picture.representations.hasOwnProperty('members')) {
          const previewPictures = picture.representations.members.filter(representation =>
            representation.name.indexOf('preview') > -1)
          if (callback && previewPictures && (previewPictures.length > 0)) {
            previewImageExists = true
            callback(previewPictures[0].href)
          }
        }
        if (!previewImageExists) {
          callback(null)
        }
      },
      () => null /* userCannotReadCallback */
    ),
    context.request,
    context.response,
    context.library,
    pictureId,
    context.userId,
    false,
    false
  )
  queryResource(newContext, '', pictureId, newContext.resultsHandler)
}

function idToFileName (library, resourceId, callback) {
  const resourcePath = library.home + resourceId
  library.caseSensitiveFileStatus(
    library, resourceId.split('/').slice(1), library.caseSensitivePaths, (error, status) => {
      if (error) {
        if (library.parent) {
          callback(idToFileName(library.parent, resourceId, callback))
        } else {
          callback(null)
        }
      } else {
        if (status.isDirectory) {
           callback(`${resourcePath}/${thingDefinitionFileName}`)
        } else {
           callback(resourcePath)
        }
      }
  })
}

/**
 * Is the given user or one of the groups of users the given user belongs to in the given access control list?
 * @param {Object} acl  An access control list: a collection of users and groups of users granted access.
 * @param {string} userId A user's unique identifier.
 * @param {Object} user A user.
 * @returns {boolean} True if the given user or one of the groups the user is a member of is in the given ACL.
 */
function isUserOrGroupInAcl (acl, userId, user) {
  if (acl.hasOwnProperty(`<${userId}>`)) {
    return true
  } else {
    // The user can read the resource if he or she is a member of a group of users who have been
    // granted read permission on the resource's access control list.
    if (user.hasOwnProperty('groups')) {
      for (let group in user.groups) {
        if (acl.hasOwnProperty(`${group}`)) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * Fetches a resource's summarized description.
 * @param {QueryContext} context    Query context.
 * @param {Array} [properties]      Names of properties whose values should be summarized.
 * @param {String} resourceId       Name of the resource to summarize.
 * @param {Function} next           Function to invoke to return a resource's summary.
 */
function fetchSummary (context, properties, resourceId, next) {
  let library = context.library
  let fileName
  const methodName = 'fetchSummary'
  let resourcePath = library.home + resourceId
  let summary = {}
  logger.info(methodName, `Fetching summary for "${resourceId}"`)
  library.caseSensitiveFileStatus(
    library, resourceId.split('/').slice(1), library.caseSensitivePaths, (error, status) => {
    if (error) {
      if (library.parent) {
        context.library = library.parent
        fetchSummary(context, properties, resourceId, next)
        context.library = library
      } else {
        context.resultsHandler.resourceNotFound(context, error)
      }
    } else {
      if (status.isDirectory) {
        fileName = `${resourcePath}/${thingDefinitionFileName}`
        if (context.fileReadRequests.hasOwnProperty(fileName)) {
          if (!context.fileReadRequests[fileName]) {
            context.fileReadRequests[fileName] = []
          }
          context.fileReadRequests[fileName].push({
            callback: onSummaryFetched,
            context: context,
            library: library,
            resourceId: resourceId,
            properties: properties,
            fileName: fileName,
            summary: summary,
            next: next
          })
        } else {
          fs.stat(fileName, (error2) => {
            if (error2) {
              if (library.parent) {
                context.library = library.parent
                fetchSummary(context, properties, resourceId, next)
                context.library = library
              } else {
                context.resultsHandler.resourceNotFound(context, error2)
              }
            } else {
              if (!context.fileReadRequests[fileName]) {
                context.fileReadRequests[fileName] = []
              }
              context.fileReadRequests[fileName].push({
                callback: onSummaryFetched,
                context: context,
                library: library,
                resourceId: resourceId,
                properties: properties,
                fileName: fileName,
                summary: summary,
                next: next
              })
              fs.readFile(fileName, (error3, data) => {
                let requests = context.fileReadRequests
                if (error3) {
                  context.resultsHandler.resourceNotFound(context, error3)
                } else {
                  logger.info(methodName, `Read file "${fileName}"`)
                  library.cache[fileName] = data
                  if (requests.hasOwnProperty(fileName)) {
                    requests[fileName].forEach((p) => {
                      p.callback(data, p)
                    })
                  }
                }
              })
            }
          })
        }
      } else {
        context.resultsHandler.returnFile(context, resourcePath)
      }
    }
  })
  context.isSummaryQuery = true
}

/**
 * Returns a thing that defines a type of things.
 * @param library       Library that contains thing definitions.
 * @param typeId        The unique identifier for a type of thing.
 * @returns {*|string}  A thing that defines a type of thing: properties common to things of the same type.
 */
function fetchTypeDefinition (library, typeId) {
  let typeDefinition = library.types[`<${typeId}>`]
  if ((!typeDefinition) && library.parent) {
    typeDefinition = fetchTypeDefinition(library.parent, typeId)
  }
  return typeDefinition
}

/**
 * Recursively retrieves a library's definitions for the types of things a library may contain.
 * @param {Library} library     A library of things.
 * @param {string} folderName   File system folder (directory) to search for thing type definitions.
 * @param {Object} types        An object whose properties are references to the types of things the given library
 *                              may contain.
 * @param {string} id           Unique identifier for a type of thing.
 * @return {Object} A non-null object whose properties are references to types of things that can be stored in the
 *                  given library.
 */
function fetchTypes (library, folderName, types, id) {
  let children
  let files = fs.readdirSync(folderName)
  let libraryDefinition
  const methodName = 'fetchTypes'
  let nextFolderName
  let stats
  let typeFileName
  files.forEach((fileName) => {
    if (fileName === typeDefinitionFileName) {
      typeFileName = `${folderName}/${fileName}`
      logger.info(methodName, `Reading thing type definition file "${typeFileName}"`)
      libraryDefinition = converter.asObject(library, folderName, fs.readFileSync(typeFileName))
      if (libraryDefinition) {
        types[id] = libraryDefinition
        if (libraryDefinition.hasOwnProperty('children')) {
          children = libraryDefinition.children
          Object.keys(children).forEach((child) => {
            fetchTypes(library,
              library.home +
              '/' +
              child.slice(1, child.length - 1).split('/').slice(3).join('/'),
              types,
              '<' + child.slice(library.applicationName.length + library.name.length + 4, child.length))
          })
        }
      }
    } else if (fileName.slice(0, 1) !== '.') {
      nextFolderName = `${folderName}/${fileName}`
      stats = fs.statSync(nextFolderName)
      if (stats.isDirectory()) {
        fetchTypes(
          library,
          nextFolderName,
          types,
          id.substring(0, id.length - 1) + '/' + fileName + '>')
      }
    }
  })
  return types
}

/**
 * Returns information about a user and stores it in the given query context.
 * @param {QueryContext} context    Query context.
 * @param {function} callback       Called once user information is retrieved.
 */
function fetchUser (context, callback) {
  const methodName = fetchUser.name
  let newContext = QueryContext.newInstance(
      context.configuration,
      QueryResultsHandler.newInstance(
        function resourceNotFound (context2) {
          throw new Error(`Could not find the user "${context2.resourceId}"`)
        },
        null, /* returnFileCallback */
        null, /* returnLocalContentCallback */
        function returnObject (context2) {
          context.user = context2.result
          logger.info(methodName, `Retrieved user "${converter.asJson(context.user)}"`)
          if (callback) {
            callback()
          }
        },
        null /* userCannotReadCallback */
      ),
      context.request,
      context.response,
      context.library,
      context.userId,
      '/types/users/Administrator',
      false,
      false
    )
  newContext.externalizeReferences = false
  logger.info(methodName, 'Fetching user "' + context.userId + '"')
  queryResource(newContext, '', context.userId, newContext.resultsHandler)
}

async function gitAllFilesChanged(commit1, dir) {
  const files = []
  return git.walk({
    fs,
    dir,
    trees: [git.TREE({ ref: commit1 })],
    map: async function(filePath, [A]) {
      if (filePath === '.') {
        return
      }
      return {
        file: `/${filePath}`,
        typeOfChange: 'added'
      }
    }
  })
}

async function gitFilesChanged(commit1, commit2, dir) {
  const files = []
  return git.walk({
    fs,
    dir,
    trees: [git.TREE({ ref: commit1 }), git.TREE({ ref: commit2 })],
    map: async function(filePath, [A, B]) {
      if (filePath === '.') {
        return
      }
      let typeOfChange = 'equal'
      if (!A || !B) {
        if (A && (await A.type() !== 'tree')) {
          typeOfChange = 'added'
        }
        if (B && await B.type() !== 'tree') {
          typeOfChange = 'removed'
        }
      }
      if (A && B && (((await A.type()) === 'tree') || ((await B.type()) === 'tree'))) {
        return;
      }
      const aId = A && await A.oid()
      const bId = B && await B.oid()
      if ((typeOfChange === 'equal') && (aId !== bId)) {
        typeOfChange = 'modified'
      }
      return {
        file: `/${filePath}`,
        typeOfChange
      }
    }
  })
}

/**
 * Examines the given library's Git repository (where the library's things are stored) and asynchronously returns
 * information about recent changes to that repository.
 * @param {Library} library    A library of things.
 * @returns {Promise<any>}     Promise that returns recent changes made to the given library.
 */
async function getLatestChanges (library) {
  const methodName = 'getLatestChanges'
  logger.debug(methodName, `library: "${library}"`)
  logger.info(methodName, `Getting latest changes to library: "${library.name}"`)
  return new Promise((resolve, reject) => {
    let cutoffDate = moment(new Date()).subtract(RECENT_CHANGES_NUMBER_OF_DAYS, 'd')
    logger.debug(methodName, `Opening repository at "${library.repositoryPath}"`)
    git.currentBranch({
      fs,
      dir: library.repositoryPath,
      fullName: false
    }).then(branch => {
      logger.info(methodName, `On current branch, named "${branch}"`)
      git.log({
        fs,
        dir: library.repositoryPath
      }).then(async commits => {
        const latestChanges = []
        // If there is only a single commit, then return all files that were committed.
        if (commits.length === 1) {
          const files = await gitAllFilesChanged(commits[0].oid,library.repositoryPath)
          const changes = files.filter(f => {
            return f.file.indexOf(thingDefinitionFileName) >= 0
          })
          const members = []
          changes.forEach(change => {
            members.push({
              file: change.file,
              typeOfChange: change.typeOfChange
            })
          })
          const change = {
            by: commits[0].commit.author.name,
            changes: {
              members,
              offset: 0,
              totalCount: changes.length
            },
            date: gitTimestampToDate({ timestamp, timezoneOffset } = commits[0].commit.author),
            hasMoreThanOne: changes.length > 1,
            id: commits[0].oid
          }
          latestChanges.push(change)
          resolve(readLatestChanges(library, latestChanges))
        } else if (commits.length > 0) {
          for (let i = 0; i < commits.length - 1; i++) {
            const files = await gitFilesChanged(commits[i].oid, commits[i + 1].oid, library.repositoryPath)
            const changeDate = gitTimestampToDate(commits[i].commit.author)
            if (moment(changeDate).isBefore(cutoffDate)) {
              break;
            }
            const changes = files.filter(f => {
              return f.typeOfChange !== 'equal' &&
                f.file.indexOf(thingDefinitionFileName) >= 0
            })
            const members = []
            changes.forEach(change => {
              members.push({
                file: change.file,
                typeOfChange: change.typeOfChange
              })
            })
            const change = {
              by: commits[i].commit.author.name,
              changes: {
                members,
                offset: 0,
                totalCount: changes.length
              },
              date: changeDate.toISOString(),
              hasMoreThanOne: changes.length > 1,
              id: commits[i].oid
            }
            latestChanges.push(change)
          }
          resolve(readLatestChanges(library, latestChanges))
        }
      })
    })
  })
}

/**
 * Returns the date and time for a timestamp stored in Git.
 * @param timestamp: { timestamp: number, timezoneOffset: number } A timestamp value stored in Git.
 * @returns {Date} The given timestamp's date and time in Greenwich Mean Time (GMT).
 */
function gitTimestampToDate({ timestamp, timezoneOffset }) {
  // Git stores timestamps as a Unix timestamp (seconds since 1/1/1970), multiply by 1000 to convert to milliseconds
  // Git also stores a commit author's time zone as number of minutes difference between GMT.
  return new Date(timestamp * 1000)
  // return new Date((timestamp * 1000) + (timezoneOffset * 60000))
}

/**
 * Should the given change to a library be reported back to clients?
 * @param change
 * @param {Library} library
 * @param user
 * @param {string} userId
 * @returns {false|boolean|*}
 */
function includeChange(change, library, user, userId) {
  // TODO - If the change is a collection include it if any property other than its children property
  //  changed.
  return ((change.typeOfChange === 'added') ||
    (change.typeOfChange === 'removed') ||
    (change.typeOfChange === 'renamed') ||
    (!change.isCollection) ||
    (change.id.indexOf('/types/collections') > -1)) &&
      library.canRead(library, `<${change.id}>`, user, userId)
}

/**
 * Adds property definitions defined in a one type of thing--a super-type--to another type--a sub-type.
 * @param {Library} library     A library of things.
 * @param {string} subtypeId    Unique ID for a type of thing that may itself be described by a broader type of thing.
 * @param {object} subtype      Defines a type of thing that may itself be described by a broader type of thing.
 * @param {string} supertypeId  Unique id for the definition of types of things that can be used to define other types
 *                              of things.
 * @throws An error if the there is no type of thing with the given super type id defined within the given library.
 */
function inheritProperties (library, subtypeId, subtype, supertypeId) {
  const methodName = 'inheritProperties'
  let supertype = library.types[supertypeId]
  if (supertype) {
    if (supertype.hasOwnProperty('properties')) {
      Object.keys(supertype.properties).forEach(property => {
        if (property !== 'facets') {
          if (subtype.properties.hasOwnProperty(property)) {
            logger.debug(
              methodName,
              `Overriding the property named "${property}" defined by the type named "${supertypeId}"`)
            // Iterate over the super type's property definitions.
            Object.keys(supertype.properties[property]).forEach(attribute => {
              // Inherit property attributes defined in ancestor types.
              if (!subtype.properties[property].hasOwnProperty(attribute)) {
                subtype.properties[property][attribute] = supertype.properties[property][attribute]
              }
            })
          } else {
            // Inherit property definition from ancestor type.
            logger.debug(methodName, `Adding inherited property "${property}" to the type with id "${subtypeId}"`)
            subtype.properties[property] = supertype.properties[property]
          }
        }
      })
      if (supertype.hasOwnProperty('facets')) {
        for (let facet in supertype.facets) {
          let facetId = '</' + facet.slice(1, facet.length - 1).split('/').slice(3).join('/') + '>'
          inheritProperties(library, subtypeId, subtype, facetId)
        }
      }
    }
  } else {
    throw new Error(`Couldn't find type with id "${supertypeId}" in the library named "${library.name}"`)
  }
}

/**
 * Asynchronously reads security information that states which users can read which persistent things.
 * @param {Library} library     A library of things that contains security information.
 * @param {function) callback   Invoked after security has been initialized.
 */
function initializeSecurity (library, callback) {
  // TODO - Don't load readAcls from a file, they are loaded from the things themselves.
  const methodName = 'initializeSecurity'
  logger.info(methodName, 'Initializing security')
  if (library.parent) {
    callback(null)
  } else {
    mapEmailAddressesToUserAccounts(library, (error, emailsToAccounts) => {
      logger.info(methodName, 'Finished initializing security')
      library.emailsToAccounts = emailsToAccounts
      callback(error)
    })
  }
}

/**
 *
 * @param typeDefinition    A thing that defines a type of thing.
 * @param property          Name of a property common to things of the type defined by the given type definition.
 * @returns {*|String}      The name of the given property's inverse property: the name of a corresponding property
 *                          whose value is related to values with the given property name.
 */
function inverseFor (typeDefinition, property) {
  let inversePropertyName
  let p
  let propertyDefinition
  if (typeDefinition && typeDefinition.hasOwnProperty('properties')) {
    for (p in typeDefinition.properties) {
      propertyDefinition = typeDefinition.properties[p]
      if (propertyDefinition.hasOwnProperty('inverse') && (propertyDefinition.inverse === property)) {
        inversePropertyName = p
        break
      }
    }
  }
  return inversePropertyName
}

/**
 * Is the given text string an absolute reference to a thing? An absolute reference refers to a thing by a path
 * from the root of a hierarchy of things.
 * @param {string} text  A non-null, non-empty text string.
 * @returns {isReference|boolean} True if the given string is an absolute, and not a relative, reference.
 */
function isAbsoluteReference (text) {
  return isReference && (text.charAt(1) === '/')
}

/**
 * Is the given text string a reference to a thing?
 * @param {string} text     A non-null, non-empty text string.
 * @returns {boolean}       True if the given string refers to a thing.
 */
function isReference (text) {
  return text && (typeof text === 'string') && (text.charAt(0) === '<') && (text.charAt(text.length - 1) === '>')
}

/**
 * Does a given resource identifier refer to a type of thing?
 * @param {Library} library     Library of things.
 * @param {string} resourceId   Unique resource identifier.
 * @return {boolean} true if the given resource id refers to a type of thing.
 */
function isTypeOfThing (library, resourceId) {
  let id = `<${resourceId}>`
  if (library.types.hasOwnProperty(id)) {
    return true
  } else if (library.parent && (library.parent.types.hasOwnProperty(id))) {
    return true
  }
  return false
}

/**
 * Laods read and write access control lists for digital representations of things.
 * @param library A library of things.
 * @param {string[]} fileNames  Name of files whose contents refer to a thing's digital representation.
 */
function loadRepresentationAccessControls(library, fileNames) {
  const methodName = 'loadRepresentationAccessControls'
  logger.info(methodName, 'Loading digital representation access controls...')
  const work = []
  fileNames.forEach(fileName => {
    work.push((next) => {
      fs.readFile(fileName, (error, data) => {
        if (!error) {
          logger.info(`Reading representation "${fileName}"`)
          const thing = JSON.parse(data)
          if (thing.hasOwnProperty('canRead')) {
            library.canReadAccessControlLists[`<${fileName.slice(library.home.length)}>`] = { ...thing.canRead }
          }
          if (thing.hasOwnProperty('canWrite')) {
            library.canWriteAccessControlLists[`<${fileName.slice(library.home.length)}>`] = { ...thing.canWrite }
          }
          next()
        }
      })
    })
  })
  throttledWorker.doWork(work, (results) => {})
}

/**
 * Asynchronously initializes a mapping between user email addresses and the users' accounts.
 * @param library               The library of things that holds users' accounts.
 * @param {function} callback   Called to pass back a mapping between user email addresses and user accounts.
 */
function mapEmailAddressesToUserAccounts (library, callback) {
  const fileName = `${library.home}/types/users/${thingDefinitionFileName}`
  const methodName = 'mapEmailAddressesToUserAccounts'
  let user
  let users
  let work = []
  library.userEmailAddressesToIds = {}
  fs.readFile(fileName, (error, data) => {
    if (error) {
      callback(error)
    } else {
      users = JSON.parse(data)
      if (users.children) {
        Object.keys(users.children).forEach((userId) => {
          work.push((next) => {
            fs.readFile(
              `${library.home}${userId.slice(1, userId.length - 1)}/${thingDefinitionFileName}`,
              (error, data) => {
                let result = []
                if (error) {
                  logger.warn(
                    methodName,
                    `Error occurred while reading the file "${fileName}" ${error ? JSON.stringify(error) : ''}`)
                } else {
                  user = JSON.parse(data)
                  if (user.emails && user.account) {
                    user.emails.forEach((email) => {
                      result = { email: email, accountId: user.account }
                    })
                  }
                }
                next(result)
              }
            )
          })
        })
      }
      if (work) {
        throttledWorker.doWork(work, (results) => {
          let emailsToAccounts = {}
          if (results) {
            results.forEach((result) => {
              if (result.length > 0) {
                emailsToAccounts[result[0].email] = result[0].accountId
              }
            })
          }
          callback(null, emailsToAccounts)
        })
      } else {
        callback(null)
      }
    }
  })
}

/**
 * Creates, and returns, a new library.
 * @param {LibraryConfiguration} libraryConfiguration The new library's configuration information.
 * @param {function} callback Function called to return a new library.
 */
function newInstance (libraryConfiguration, callback) {
  const methodName = 'newInstance'
  const library = new Library(libraryConfiguration)
  getLatestChanges(library).then(changes => {
    library.changes = changes
    library.changes.forEach(change => {
      if (!library.caseSensitivePaths['types']['changes']) {
        library.caseSensitivePaths['types']['changes'] = {}
      }
      library.caseSensitivePaths['types']['changes'][change.id] = {
        by: change.by, date: change.date, changes: change.changes }
    })
    logger.debug(methodName, `Setting changes to library "${library.name}" to "${changes}`)
    callback(library)
  })
}

/**
 * Returns to a web client data that describes a persistent resource.
 * @param {string} [data]       JSON that describes a persistent resource.
 * @param {string} property     The name of a persistent resource's property to return the value of.
 * @param {string} resourceId   The unique identifier of the fetched persistent resource.
 * @param {Array} parameters    Addition parameters necessary to return a response to a web client.
 */
function onResourceFetched (data, property, resourceId, parameters) {
  const methodName = 'onResourceFetched'
  const {
    context,
    fileName,
    library,
    resultsHandler
  } = parameters
  context.resourceId = resourceId
  context.result = JSON.parse(data || library.cache[fileName])

  // TODO - We need to check that the current user can read this resource.
  // library.canRead(context.library, resourceId, context.user, context.userId

  if (context.isSummaryQuery) {
    returnResourceSummary(context, resultsHandler)
  } else {
    addIsTypeAttribute(library, resourceId, context.result)
    context.result.type = context.library.typeIdForId(resourceId)
    if (context.externalizeReferences) {
      logger.info(methodName, 'Externalizing values for ' + fileName)
      /* context.isMetadataQuery = false // TODO - Is this necessary, do we need to restore the value? */
      // context.isSummaryQuery = true
      externalizeThing(context, context.result, resourceId, resultsHandler)
      // context.isSummaryQuery = false
    } else {
      context.property = property
      resultsHandler.returnObject(context)
    }
  }
}

function onSummaryFetched (data, parameters) {
  const methodName = 'onSummaryFetched'
  const {
    context,
    fileName,
    library,
    properties,
    resourceId,
    summary
  } = parameters
  const thing = converter.asObject(library, resourceId, data)
  logger.info(methodName, `Contents of file "${fileName}" retrieved`)
  summary.id = resourceId
  summary.isSummary = true
  summary.name = thing.name
  summary.path = thing.path
  summary.shortDescription = (thing.shortDescription || thing.description || '')
  summary.type = `${library.typeIdForId(resourceId)}`
  // TODO - Add typeName property?
  if (context.isUserSignedIn()) {
    // TODO - find the thing's type and map that to code that adds additional properties to the summary that are only
    // returned for signed in users who have the appropriate permission.
    console.log('Add additional summarized properties for the signed in user for the type of thing: ' + summary.type)
  }
  if (properties) {
    summarizeProperties(context, properties, thing, summary)
  }
  parameters.next(summary)
}

/**
 * Queries a library of persistent things.
 * @param {QueryContext} context  Query context.
 */
function query (context) {
  let library = context.library
  let libraryName = library.name
  const methodName = 'query'
  let resourceId = context.resourceId
  logger.info(methodName, `Querying node with ID: "${resourceId}" from library "${libraryName}"`)
  fetchUser(context, () => {
    if (library.canRead(context.library, context.resourceId, context.user, context.userId)) {
      if (context.isRepresentationQuery) {
        queryRepresentation(context, '', resourceId, context.resultsHandler)
      } else {
        queryResource(context, '', resourceId, context.resultsHandler)
      }
    } else {
      context.resultsHandler.userCannotRead(context)
    }
  })
}

function queryRepresentation (context, property, url, resultsHandler) {
  let library = context.library
  const methodName = 'queryRepresentation'
  let resourcePath = library.home + url
  const components = url.split('/')
  const filename = components[components.length - 2]
  const thingId = components.slice(0, components.length - 2).join('/');
  logger.info(
    methodName,
    `Querying representation named ${filename} of the thing with the id "${thingId}" for user "${context.userId}" in library "` +
      `${context.library.name}"`)
  const filePath = components.slice(0, components.length - 1)
  const representationFilename = filePath[components.length - 2] + '.lnk.json'
  filePath[components.length - 2] = representationFilename
  library.caseSensitiveFileStatus(library, filePath.slice(1), library.caseSensitivePaths, (error, status) => {
    if (error) {
      if (library.parent) {
        context.library = library.parent
        queryRepresentation(context, property, url, resultsHandler)
        context.library = library
      } else {
        resultsHandler.resourceNotFound(context, error)
      }
    } else {
      if (!status.isDirectory) {
        const relativePath = filePath.join('/')
        const pathToFile = library.home + relativePath
        logger.info(methodName, `Reading representation file "${pathToFile}"`)
        fs.stat(pathToFile, (error2) => {
          if (error2) {
            if (library.parent) {
              context.library = library.parent
              queryRepresentation(context, property, url, resultsHandler)
              context.library = library
            } else {
              resultsHandler.resourceNotFound(context, error2)
            }
          } else {
            if (canRead(context.library, thingId, context.user, context.userId)) {
              if (library.cache.hasOwnProperty(pathToFile)) {
                returnRepresentation(context, JSON.parse(library.cache[pathToFile]), relativePath, resultsHandler)
              } else {
                if (context.fileReadRequests.hasOwnProperty(pathToFile)) {
                  if (!context.fileReadRequests[pathToFile]) {
                    context.fileReadRequests[pathToFile] = []
                  }
                  context.fileReadRequests[pathToFile].push({
                    callback: (data, property, resourceId, parameters) => {
                      returnRepresentation(context, JSON.parse(library.cache[pathToFile]), relativePath, resultsHandler)
                    },
                    context: context,
                    fileName: pathToFile,
                    library: library,
                    resourceId: thingId,
                    resultsHandler: resultsHandler
                  })
                } else {
                  if (!context.fileReadRequests[pathToFile]) {
                    context.fileReadRequests[pathToFile] = []
                  }
                  context.fileReadRequests[pathToFile].push({
                    callback: (data, property, resourceId, parameters) => {
                      const representationDefinition = JSON.parse(data)
                      returnRepresentation(context, JSON.parse(library.cache[pathToFile]), relativePath, resultsHandler)
                    },
                    context: context,
                    fileName: pathToFile,
                    library: library,
                    resourceId: thingId,
                    resultsHandler: resultsHandler
                  })
                  fs.readFile(pathToFile, (error3, data) => {
                    let requests = context.fileReadRequests
                    if (error3) {
                      resultsHandler.resourceNotFound(context, error3)
                    } else {
                      logger.info(methodName, `Read representation definition file "${pathToFile}"`)
                      library.cache[pathToFile] = data
                      if (requests.hasOwnProperty(pathToFile)) {
                        requests[pathToFile].forEach(p => {
                          p.callback(data, property, p.resourceId, p)
                        })
                      }
                    }
                  })
                }
              }
            } else {
              context.resultsHandler.userCannotRead(context)
            }
          }
        })
      }
    }
  })
}

/**
 * Queries a resource that corresponds to a persistent thing.
 * @param {QueryContext} context                Query context.
 * @param {String} property
 * @param {String} resourceId                   Unique resource identifier.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 */
function queryResource (context, property, resourceId, resultsHandler) {
  let library = context.library
  const methodName = 'queryResource'
  let resourcePath = library.home + resourceId
  let fileName
  let isMetadataQuery = context.isMetadataQuery
  logger.info(
    methodName,
    `Querying resource "${resourceId}" at path "${resourcePath}" for user "${context.userId}" in library "` +
    `${context.library.name}"`)
  if (/\/types\/changes/.test(resourceId)) {
    let changeIds = null
    logger.info(`Requesting change information for library '${context.library.name}`)
    if (context && context.queryParameters && context.queryParameters.ids) {
      changeIds = context.queryParameters.ids.split(',')
    }
    fetchLibraryChanges(context, resourceId, changeIds, resultsHandler)
  } else {
    library.caseSensitiveFileStatus(library, resourceId.split('/').slice(1), library.caseSensitivePaths, (error, status) => {
      if (error) {
        if (library.parent) {
          context.library = library.parent
          queryResource(context, property, resourceId, resultsHandler)
          context.library = library
        } else {
          resultsHandler.resourceNotFound(context, error)
        }
      } else {
        if (status.isDirectory) {
          if (status.folder) {
            fileName = library.home + status.folder
          } else {
            fileName = resourcePath
          }
          fileName += `/${(isMetadataQuery ? typeDefinitionFileName : thingDefinitionFileName)}`
          // if (isMetadataQuery) {
          //   context.isMetadataQuery = false;
          // }
          fs.stat(fileName, (error2) => {
            if (error2) {
              if (library.parent) {
                context.library = library.parent
                queryResource(context, property, resourceId, resultsHandler)
                context.library = library
                if (isMetadataQuery) {
                  context.isMetadataQuery = false
                }
              } else {
                resultsHandler.resourceNotFound(context, error2)
              }
            } else {
              if (library.cache.hasOwnProperty(fileName)) {
                if (canRead(context.library, resourceId, context.user, context.userId)) {
                  onResourceFetched(
                    library.cache[fileName],
                    property,
                    resourceId, {
                      context: context,
                      fileName: fileName,
                      library: library,
                      resourceId: resourceId,
                      resultsHandler: resultsHandler
                    }
                  )
                } else {
                  context.resultsHandler.userCannotRead(context)
                }
              } else {
                if (context.fileReadRequests.hasOwnProperty(fileName)) {
                  if (!context.fileReadRequests[fileName]) {
                    context.fileReadRequests[fileName] = []
                  }
                  context.fileReadRequests[fileName].push({
                    callback: onResourceFetched,
                    context: context,
                    fileName: fileName,
                    library: library,
                    resourceId: resourceId,
                    resultsHandler: resultsHandler
                  })
                } else {
                  if (!context.fileReadRequests[fileName]) {
                    context.fileReadRequests[fileName] = []
                  }
                  context.fileReadRequests[fileName].push({
                    callback: onResourceFetched,
                    context: context,
                    fileName: fileName,
                    library: library,
                    resourceId: resourceId,
                    resultsHandler: resultsHandler
                  })
                  fs.readFile(fileName, (error3, data) => {
                    let requests = context.fileReadRequests
                    if (error3) {
                      resultsHandler.resourceNotFound(context, error3)
                    } else {
                      logger.info(methodName, `Read file "${fileName}"`)
                      library.cache[fileName] = data
                      if (requests.hasOwnProperty(fileName)) {
                        requests[fileName].forEach((p) => {
                          p.callback(data, property, p.resourceId, p)
                        })
                      }
                    }
                  })
                }
              }
            }
          })
        } else {
          logger.info(methodName, `Returning file at "${library.home}${resourceId}"`)
          context.request.url = resourceId
          resultsHandler.returnFile(context, library.home + resourceId)
        }
      }
    })
  }
}

function readLatestChanges(library, commits) {
  return new Promise((resolve, reject) => {
    const work = []
    commits.forEach((commit) => {
      work.push((next) => {
        let changes = commit.changes
        let count = changes.totalCount
        let work2 = []
        changes.members.forEach((fileChange) => {
          work2.push((next2) => {
            let fileName = fileChange.file
            let id = fileName.slice(0, fileName.length - (thingDefinitionFileName.length + 1))
            let thing
            fs.readFile(`${library.home}/${fileName}`, (error, data) => {
              if (!error) {
                thing = JSON.parse(data)
                const changeInfo = {
                  id,
                  isCollection: thing.hasOwnProperty('children'),
                  name: thing.name,
                  path: thing.path,
                  typeId: library.typeIdForId(id),
                  typeOfChange: fileChange.typeOfChange
                }
                if (thing.hasOwnProperty('pictures')) {
                  changeInfo.pictures = thing.pictures
                  // TODO - Retrieve the picture information and include it in the change info.
                }
                fileChange = Object.assign(fileChange, changeInfo)
              }
              next2()
            })
          })
        })
        throttledWorker.doWork(work2, () => {
          next()
        })
      })
      throttledWorker.doWork(work, () => {
        resolve(commits)
      })
    })
  })
}

/**
 * Asynchronously returns recent changes made to the given library.
 * @param {Library} library              A library of things.
 * @param {QueryContext} queryContext    Query context.
 * @returns {Promise<any>}
 */
function recentChanges (library, queryContext) {
  const methodName = 'recentChanges'
  logger.debug(methodName, `library: "${library}"`)
  return new Promise((resolve, reject) => {
    if (!library.changes) {
      getLatestChanges(library).then((changes) => {
        logger.debug(methodName, `Setting recent changes: "${changes}" on library "${library.name}"`)
        library.changes = changes
        resolve(summarizeLibraryChanges(library, queryContext))
      })
    } else {
      resolve(summarizeLibraryChanges(library, queryContext))
    }
  })
}

function requestedOffset(context) {
  if (context.queryParameters.offset) {
    let temp = parseInt(context.queryParameters.offset, 0)
    if (temp && (temp > 0)) {
      return temp
    }
  }
  return 0
}

function requestedLimit(context) {
  if (context.queryParameters.limit) {
    let temp = parseInt(context.queryParameters.limit, context.configuration.limit)
    if (temp && (temp > 0)) {
      return temp
    }
  }
  return 20
}

function retrieveThumbnailUrl(pictures) {
  // return 'Thumbnail URL goes here'
  //
  // const queryContext =
  //   QueryContext.newInstance(
  //     context.configuration,
  //     QueryResultsHandler.newInstance(
  //       function resourceNotFound (context2) {
  //         // throw new Error(`Could not find the user "${context2.resourceId}"`)
  //       },
  //       null, /* returnFileCallback */
  //       null, /* returnLocalContentCallback */
  //       function returnObject (context2) {
  //         // logger.info(methodName, `Retrieved user "${converter.asJson(context.user)}"`)
  //         if (callback) {
  //           callback()
  //         }
  //       },
  //       null /* userCannotReadCallback */
  //     ),
  //     context.request,
  //     context.response,
  //     context.library,
  //     context.userId,
  //     '/types/users/Administrator',
  //     false,
  //     false
  //   )
  // newContext.externalizeReferences = false
  // logger.info(methodName, 'Fetching user "' + context.userId + '"')
  // queryResource(newContext, '', context.userId, newContext.resultsHandler)
}

function returnExternalizedObject (count, context, externalization, resultsHandler) {
  if (count === 0) {
    context.result = externalization
    resultsHandler.returnObject(context)
  }
}

/**
 * Returns a thing's digital representation.
 * @param {QueryContext} context Contextual information for a query for a thing's representation.
 * @param {Object} representation The definition for a thing's digital representation.
 * @param {string} file The path to a file whose contents are a thing's digital representation.
 * @param resultsHandler Returns query results to the client.
 */
function returnRepresentation (context, representation, file, resultsHandler) {
  const { configuration, library, user, userId } = context
  const pathToFile = `/${library.name}${file.slice(0, file.length - '.lnk.json'.length)}`
  if (representation.hasOwnProperty('canRead')) {
    if (isUserOrGroupInAcl(representation.canRead, userId, user)) {
      resultsHandler.returnLocalContent(context, context.configuration.representations, pathToFile)
    } else {
      resultsHandler.userCannotRead(context)
    }
  } else {
    resultsHandler.returnLocalContent(context, context.configuration.representations, pathToFile)
  }
}

/**
 * Returns to a query submitter summarized information about one of this library's resources.
 * @param {QueryContext} context   Query context.
 * @param {QueryResultsHandler} resultsHandler  Query results handler.
 */
function returnResourceSummary (context, resultsHandler) {
  let i = 0
  let ids
  let library = context.library
  const methodName = 'returnResourceSummary'
  let properties
  let propertiesList
  const { queryParameters, result } = context
  let resourcesToSummarize = {}
  let temp
  logger.info(methodName, `Returning summary of "${context.resourceId}"`)
  // If asked to summarize the value of a thing's properties (the properties are specified in a comma-separated list)
  if (queryParameters && queryParameters.properties) {
    propertiesList = queryParameters.properties
    if (propertiesList) {
      properties = propertiesList.split(',')
      properties.forEach((property) => {
        let resource
        logger.info(methodName, `Summarizing property "${property}" of "${context.resourceId}"`)
        resourcesToSummarize[property] = {}
        resourcesToSummarize[property].totalCount = 0
        resourcesToSummarize[property].ids = []
        resourcesToSummarize.path = context.result.path
        if (context.result.hasOwnProperty(property)) {
          if (result.hasOwnProperty(property)) {
            if (result[property] instanceof Array) {
              result[property].forEach((resource) => {
                if (library.canRead(context.library, resource, context.user, context.userId)) {
                  resourcesToSummarize[property].totalCount += 1
                  resourcesToSummarize[property].ids.push(converter.stripReferenceMarks(resource))
                }
              })
            } else {
              if (typeof result[property] === 'object') {
                for (resource in result[property]) {
                  if (result[property].hasOwnProperty(resource)) {
                    if (library.canRead(context.library, resource, context.user, context.userId)) {
                      resourcesToSummarize[property].totalCount += 1
                      resourcesToSummarize[property].ids.push(converter.stripReferenceMarks(resource))
                    }
                  }
                }
              } else {
                resultsHandler.resourceNotFound(
                  context, {
                    description: `Can't summarize the property named "${property}" of the thing with the id ` +
                      `"${context.resourceId}" because the property's value isn't a collection of things`
                  })
                properties = []
              }
            }
          }
        } else {
          let typeId = library.typeIdForId(context.resourceId)
          let type = fetchTypeDefinition(context.library, typeId)
          if (type &&
            type.properties &&
            type.properties.hasOwnProperty(property) &&
            type.properties[property].computed) {
            // TODO - Compute the property's value.
            console.log('Compute')
            // TODO - this is hard-coded for now.
            if ((typeId === '/types/libraries') && (property === 'recentChanges')) {

            }
          }
        }
      })
      properties.forEach((property) => {
        if (resourcesToSummarize.hasOwnProperty(property)) {
          const offset = requestedOffset(context)
          resourcesToSummarize[property].offset = offset
          const limit = requestedLimit(context)
          resourcesToSummarize[property].limit = limit
          ids = resourcesToSummarize[property].ids
          ids = ids.slice(offset, Math.min(ids.length, offset + limit))
          summarizeCollection(context, properties, ids, (summaries) => {
            let members = []
            delete resourcesToSummarize[property].ids
            summaries.forEach((summary) => {
              addIsTypeAttribute(library, summary[0].id, summary[0])
              const type = fetchTypeDefinition(context.library, summary[0].type)
              if (type) {
                if (type.singularName) {
                  summary[0].typeName = type.singularName
                }
                if (type.isNamePlural) {
                  summary[0].isNamePlural = true
                }
              }
              members.push(summary[0])
            })
            resourcesToSummarize[property].members = members
            i += 1
            if (i === properties.length) {
              context.result = resourcesToSummarize
              addIsTypeAttribute(library, context.resourceId, context.result)
              context.resultsHandler.returnObject(context)
            }
          })
        }
      })
    } else {
      summarize(context)
    }
  } else {
    summarize(context)
  }
}

/**
 * Returns the contents of a file to the client.
 * @param {Library} library     Library of things that contains the file.
 * @param {Request} request     Client request for a file.
 * @param response              Response to client.
 */
function serveFile (library, request, response) {
  const methodName = 'serveFile'
  library.fileServer.serve(request, response, (error) => {
    if (error) {
      logger.info(methodName, `Error returning file "${request.url}"`)
      logger.info(methodName, `Error: "${error.message}"`)
      response.writeHead(error.status, error.headers)
      response.end()
    }
  })
}

/**
 * Summarizes a persistent thing's state by replacing the thing's properties whose values are collections (vectors)                                                                                                 ±±±±±±
 * with scalar properties whose values are the size of the collections. For example, if the given thing has a
 * property called 'children' which is an object whose properties are the unique IDs of the thing's children, this
 * method will return a version of the given thing, without a 'children' property, but with a 'childrenCount'
 * property whose value is the number of properties (children) of the thing's 'children' property.
 * @param {QueryContext} context    Query context.
 */
function summarize (context) {
  let countPropertyName
  let property
  let summary = {}
  let thing = context.result
  if (thing) {
    for (property in thing) {
      if (thing.hasOwnProperty(property)) {
        countPropertyName = property + 'Count'
        if (thing[property] instanceof Array) {
          summary[countPropertyName] = thing[property].length
        } else if (thing[property] instanceof Object) {
          summary[countPropertyName] = Object.keys(thing[property]).length
        } else {
          summary[property] = thing[property]
        }
      }
    }
  }
  context.result = summary
  addIsTypeAttribute(context.library, context.resourceId, context.result)
  context.resultsHandler.returnObject(context)
}

/**
 * Returns summaries that describe things within a collection.
 * @param {QueryContext} context    Query context.
 * @param {Array} [properties]      Name of properties whose values should be summarized.
 * @param {Array} ids               Array of the unique IDs of things to summarize.
 * @param {Function} callback       Called and passed a collection of summaries.
 */
function summarizeCollection (context, properties, ids, callback) {
  let summaries = {}
  let work = []
  ids.forEach((id) => {
    if (context.library.canRead(context.library, id, context.user, context.userId)) {
      work.push((next) => {
        fetchSummary(context, properties, id, next)
      })
    }
  })
  if (work) {
    throttledWorker.doWork(work, (summaries) => {
      callback(summaries)
    })
  } else {
    callback(summaries)
  }
}

/**
 * Returns a summary of changes people have made to the given library. The summary does not contain the details
 * of which things were changed. The summary also omits details about changes to things that the user requesting
 * the summary isn't allowed to view.
 * @param {Library} library       A library of things.
 * @param {QueryContext} context  A query context.
 * @returns {Array}               An array of objects summarizing changes people have made to the given library.
 */
function summarizeLibraryChanges (library, context) {
  const summarizedChanges = []
  library.changes.forEach(commit => {
    let viewableChanges = commit.changes.members
    if (commit.changes && commit.changes.members && (commit.changes.members.length > 0)) {
      viewableChanges = commit.changes.members.filter(change => {
        if (change.typeOfChange === 'removed') {
          return includeChange(change, library, context.user, context.userId);
        } else {
          if (!change.id) {
            return false;
          }
          let fileExists = true
          idToFileName(library, change.id, fileName => {
            fileExists = !!fileName
          })
          return fileExists && includeChange(change, library, context.user, context.userId)
        }
      })
    }
    const viewableChangesCount = viewableChanges.length
    if (viewableChangesCount > 0) {
      summarizedChanges.push({
        by: commit.by,
        changesCount: viewableChangesCount,
        date: commit.date,
        hasMoreThanOne: viewableChangesCount > 1,
        id: commit.id
      })
    }
  })
  return summarizedChanges
}

/**
 * Summarizes properties of a thing where the properties' values are collections. A collection value is summarized
 * by the number of items in the collection.
 * @param {QueryContext} context    Query context.
 * @param {Array} properties        Names of properties to summarize.
 * @param thing                     Persistent thing to summarize.
 * @param summary                   Summary of the given persistent thing.
 */
function summarizeProperties (context, properties, thing, summary) {
  let count
  let countPropertyName
  const library = context.library
  properties.forEach((property) => {
    let ref
    if (thing.hasOwnProperty(property)) {
      countPropertyName = property + 'Count'
      if (thing[property] instanceof Array) {
        count = thing[property].length
        thing[property].forEach((id) => {
          if (!library.canRead(
            library, decodeURI(converter.stripApplicationAndLibrary(id)), context.user, context.userId)) {
            count -= 1
          }
        })
        summary[countPropertyName] = count
      } else if (thing[property] instanceof Object) {
        count = Object.keys(thing[property]).length
        for (ref in thing[property]) {
          if (thing[property].hasOwnProperty(ref)) {
            if (!library.canRead(
              library, decodeURI(converter.stripApplicationAndLibrary(ref)), context.user, context.userId)) {
              count -= 1
            }
          }
        }
        summary[countPropertyName] = count
      }
    }
  })
}

/**
 * Calculates the number of things contained within a given library.
 * @param {Library} library            A library of things.
 * @param {QueryContext} queryContext
 * @returns {Promise}                  A promise.
 */
function thingCount (library, queryContext) {
  return new Promise((resolve, reject) => {
    if (!library.numberOfThings) {
      library.numberOfThings =
        calculateThingCount(library, library.home + '/types', 0, library.caseSensitivePaths)
    }
    resolve(library.numberOfThings)
  })
}


/**
 * Asynchronously returns a URL to a preview image.
 * @param {Library} library              A library of things.
 * @param {QueryContext} queryContext    Query context.
 * @returns {Promise<any>}
 */
function thumbnailUrl(library, queryContext) {
  const methodName = 'thumbnailUrl'
  logger.debug(methodName, `library: "${library}"`)
  return retrieveThumbnailUrl(queryContext.result.pictures)
}

/**
 * Returns the unique identifier for the type of thing of a thing with the given id. This function works only after
 * the given library has loaded its definitions of types of things.
 * @param {string} id          A thing's unique identifier.
 * @returns {string}           An empty string or a string that is a unique identifier for a type of thing.
 */
function typeIdForId (id) {
  let typeId = ''
  if (id && (id.length > 1) && this.types && this.types.typeTree) {
    let p = this.types.typeTree
    id.slice(1, id.length).split('/').forEach(component => {
      if (p.hasOwnProperty(component)) {
        p = p[component]
        typeId += `/${component}`
      }
    })
    if ((!typeId) && this.parent) {
      typeId = this.parent.typeIdForId(id)
    }
  }
  return typeId
}

function typeIdForPath (library, path) {
  if (library.types) {
    let reference = '<' + path + '>'
    if (library.types.hasOwnProperty(reference)) {
      return path
    } else if (library.parent) {
      return library.typeIdForPath(library.parent, path)
    }
    return null
  }
}

/**
 * Sets the given account's last signed in time to now, and saves the account to disk.
 * @param {Library} library     Library of things where users' account information is stored.
 * @param {Account} account     A user's Sqwerl account.
 * @param {function} callback   Function called after updating the account or if an error occurs.
 */
function updateLastSignedInTime (library, account, callback) {
  const methodName = 'updateLastSignedInTime'
  if (account) {
    const accountId = account.id
    if (accountId) {
      logger.info(methodName, `Updating last signed in time for the account with the id "${accountId}"`)
      const now = new Date()
      delete account.id
      account.lastSignedInTime = now
      account.modifiedBy = '</types/users/Administrator>'
      account.modifiedOn = now
      writeJsonFile(
        library.writablePath + accountId.slice(1, accountId.length - 1) + '/' + thingDefinitionFileName,
        account, {
          'indent': 2,
          'sortKeys': true
        }
      ).then(() => {
        logger.info(methodName, `Updated last signed in time for account with the id "${accountId}"`)
        callback()
      }, (error) => {
        callback(error)
      })
    } else {
      callback(new Error('Missing account ID'))
    }
  } else {
    callback(new Error('Missing account'))
  }
}

/**
 * Does a user control who can access a resource?
 * @param {String} resourceId   A resource's unique identifier.
 * @param {Object} user         A user.
 * @param {String} userId       The given user's unique identifier.
 * @return {boolean} true if the given user controls access to the given resource.
 */
function userControlsResource (resourceId, user, userId) {
  let isController = false
  const methodName = 'userControlsResource'
  if (user.hasOwnProperty('controls')) {
    isController = user.controls.hasOwnProperty(resourceId)
  }
  logger.info(
    methodName, `The user "${userId}" ${(isController ? 'controls' : 'does not control')} the resource "${resourceId}"}`)
  return isController
}

/**
 * Is the user performing a query an Administrator?
 * @param {Object} user         A user.
 * @param {string} userId       The given user's unique identifier.
 * @return {boolean} true if then given user is an administrator.
 */
function userIsAdministrator (user, userId) {
  const methodName = 'userIsAdministrator'
  if (user.groups) {
    const isAdministrator = user.groups.hasOwnProperty('/types/groups/Administrators')
    logger.info(methodName, `The user "${userId}" ` +
      (isAdministrator ? 'is an administrator' : 'isn\'t an administrator'))
    return isAdministrator
  }
  return false
}

// TODO - Exported for unit tests. Should not be exported and should not need to be exported for unit tests.
exports.addIsTypeAttribute = addIsTypeAttribute

exports.idToFileName = idToFileName
exports.newInstance = newInstance
exports.query = query
