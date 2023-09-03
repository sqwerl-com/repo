/**
 * Tests the integrity of a library of things.
 */

/* This test is synchronous. */
let canReadAcl = {}
let canWriteAcl = {}
const emailValidator = require('./email_validator')
const fs = require('fs')
let inverseReferences = {}

/**
 * Regular expression for testing that string values properly encode a date time value in ISO 8601 format.
 */
const iso8601DateTimeRegularExpression = /^\d{4}-[0-1]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+(Z|[+-][0-2]\d:[0-5]\d)?)?$/

/**
 * The file name extension for link files that describe information about things that are stored outside of a Git
 * repository.
 * @type {string}
 */
const LINK_FILE_EXTENSION = '.lnk.json'

const logger = require('sqwerl-logger').newInstance('Tester')

const moment = require('moment')

let paths = {}

/**
 * Primitive, or built-in, types.
 * @type {Object}
 */
const primitives = {
  'boolean': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      if ((value !== true) && (value !== false)) {
        throw new Error(
          'The value of the property "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must be a Boolean value (true or false).'
        )
      }
    }
  },
  'email': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      if (value) {
        if (!emailValidator.validate(value)) {
          throw new Error(
            'The value "' +
            value +
            '" of the property named "' +
            propertyName +
            '" of the thing with the ID "' +
            thingId +
            '" is not a valid e-mail address.'
          )
        }
      } else {
        throw new Error(
          'The property named "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must contain a valid e-mail address.'
        )
      }
    }
  },
  'file': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      // TODO - Check that the value refers to a file.
    }
  },
  'integer': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      if ((parseFloat(value) !== parseInt(value, 10)) || isNaN(value)) {
        throw new Error(
          'The value of the property "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must be an integer value.'
        )
      }
    }
  },
  'objects': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      // TODO - Check that the value is an object.
      logger.info('checkValue', 'Checking object value: Unimplemented functionality. Checking object value "' + value + '", propertyName = "' + propertyName + '", thingId = "' + thingId + '"')
    }
  },
  'representations': {
    'checkValue': function (configuration, value, propertyName, thingId, folder) {
      var components,
        file,
        representation
      if (value && (!(value instanceof Array) && (value instanceof Object))) {
        if (folder) {
          components = folder.split('/')
          folder = components.slice(0, components.length - 1).join('/')
        }
        Object.keys(value).forEach(function (id) {
          if (value.hasOwnProperty(id)) {
            file = folder + thingId + '/' + id
            if (value[id] !== '') {
              throw Error(
                `The thing with the ID "${thingId}" has a representation property named "${id}" ` +
                  'whose value isn\'t an empty string.')
            }
            if (fs.existsSync(file)) {
              if (id.endsWith(LINK_FILE_EXTENSION)) {
                checkRepresentationLink(configuration, thingId, file)
              } else {
                throw Error(
                  `The thing with the id "${thingId}" has a representation property named "${id}" ` +
                    `whose value does not end with "${LINK_FILE_EXTENSION}"`)
              }
            } else {
              throw new Error(
                'The representation with the ID "' +
                id +
                '" of the thing with the ID "' +
                thingId +
                '" does not have a corresponding file at "' +
                file +
                '".'
              )
            }
          }
        })
      }
    }
  },
  'text': {
    'checkValue': function (configuration, value, propertyName, thingId, folder, isRequired) {
      if ((typeof value) !== 'string') {
        throw new Error(
          'The value of the property "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must be a text string.'
        )
      }
    }
  },
  'timestamp': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      if ((typeof value) !== 'string') {
        throw new Error(
          'The value of the property "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must be a text string date time in ISO 8602 format.'
        )
      }
      if (iso8601DateTimeRegularExpression.exec(value) === null) {
        throw new Error(
          'The value "' +
          value +
          '" of the property "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must be an ISO 8601 date time value (for example: "2014-11-21T00:00:00.000-07:00".'
        )
      }
      var date = moment(value, 'YYYY-MM-DDTHH:mm:ss.SSZ')
      logger.info('checkValue', 'Parsed timestamp "' + value + '" to date time "' + date.format() + '"')
    }
  },
  'unsignedInteger': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      var i = parseInt(value, 10)
      if (((parseFloat(value) !== i) || isNaN(value)) || (i < 0)) {
        throw new Error(
          'The value of the property "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must be a non-negative integer.'
        )
      }
    }
  },
  'url': {
    'checkValue': function (configuration, value, propertyName, thingId) {
      if ((!value) || (value.length === 0) || ((typeof value) !== 'string')) {
        throw new Error(
          'The value of the property "' +
          propertyName +
          '" of the thing with the ID "' +
          thingId +
          '" must be a valid URL (uniform resource locator). See https://url.spec.whatwg.org/'
        )
      }
    }
  }
}

const resource = require('./resource')

let sortedCollections = {}

/**
 * Persistent things.
 * @type {Object}
 */
let things = {}

/**
 * Metadata that defines persistent things.
 * @type {Object}
 */
const types = {
  /**
   * The definition (schema) for objects that define a type (class) of thing.
   * @type {Object}
   */
  'types': {
    properties: {
      addedBy: {
        description: 'The user who added a type of thing to a library of things.',
        inverse: 'created',
        name: 'Created by',
        required: true,
        shortDescription: 'The user who added a type of thing.',
        type: '</types/users>'
      },
      addedOn: {
        description: 'The date and time when a user added a type of thing to a library of things.',
        name: 'Created on',
        required: true,
        shortDescription: 'Day and time when a user added a type of thing to a library.',
        type: 'timestamp'
      },
      archived: {
        description: 'Has a thing been archived (marked as irrelevant or obsolete)?',
        name: 'Archived',
        required: false,
        shortDescription: 'Has a thing been archived?',
        type: 'boolean'
      },
      canRead: {
        description: 'The users and groups of users allowed to read a type definition.',
        name: 'Can read',
        required: false,
        shortDescription: 'Who can view a type of thing\'s properties?',
        sortedBy: ['name'],
        type: {
          '</types>': ''
        }
      },
      canWrite: {
        description: 'The user and groups of users allowed to change a type definition.',
        name: 'Can write',
        required: false,
        shortDescription: 'Who can change a type of thing\'s properties?',
        sortedBy: ['name'],
        type: {
          '</types>': ''
        }
      },
      children: {
        description: 'A thing\'s children.',
        name: 'Children',
        required: false,
        shortDescription: 'A composite thing\'s child things.',
        type: {
          '</types>': ''
        }
      },
      controller: {
        description: 'The user who controls a type definition.',
        inverse: 'controls',
        name: 'Controller',
        required: true,
        shortDescription: 'The person who controls who can view or modify a type definition.',
        type: '</types/users>'
      },
      description: {
        description: 'Text that describes a type (class) of things that have similar properties.',
        name: 'Description',
        required: false,
        shortDescription: 'Describes a type of things.',
        type: 'text'
      },
      'extends': {
        description: 'A type that a new type extends (enhances).',
        name: 'Extends',
        required: true,
        shortDescription: 'The type that this type is based on.',
        type: '</types>'
      },
      facets: {
        description: 'Named collections of properties common to a type of thing.',
        inverse: 'faceted',
        name: 'Facets',
        required: false,
        shortDescription: 'Facets of what a type of thing is.',
        sortedBy: ['name'],
        type: {
          '</types/facets>': ''
        }
      },
      isNamePlural: {
        description: 'Is the name of a thing pluralized (like these notes, instead of this notes)?',
        name: 'Is name plural',
        required: false,
        shortDescription: 'Is the name of a thing a plural noun?',
        type: 'boolean'
      },
      name: {
        description: 'The name for a type (class) of thing.',
        name: 'Name',
        required: true,
        shortDescription: 'Type name.',
        type: 'text'
      },
      path: {
        description: 'The names of the types of things that define the path that identifies this type of thing.',
        name: 'Path',
        required: true,
        shortDescription: 'The path to this type of thing.',
        type: 'text'
      },
      properties: {
        description: 'The properties that all things of the type may have.',
        name: 'Properties',
        required: true,
        shortDescription: 'Properties common to a type of thing.',
        type: 'objects'
      },
      shortDescription: {
        description: 'Text that describes a type definition in less than 80 characters.',
        name: 'Short description',
        shortDescription: 'Text that briefly describes a type of object.',
        type: 'text'
      },
      singularName: {
        description: 'Text that describes the type for a single instance of this type of thing.',
        name: 'Singular name',
        shortDescription: 'Name for one of these types of things.',
        type: 'text'
      },
      sortedBy: {
        description: 'The names of the properties that members of a collection of things are sorted by.',
        name: 'Sorted by',
        shortDescription: 'Sorted by',
        type: ['text']
      }
    }
  }
}

const worker = require('./throttled_worker').newInstance()

/**
 * If a given collection of things is supposed to be sorted, adds the collection to a list of collections to test for
 * sort order.
 * @param {string} folder
 * @param {string} thingId
 * @param {string} propertyName
 * @param {object} propertyDefinition
 * @param {array} collection
 */
function addCollection (folder, thingId, propertyName, propertyDefinition, collection) {
  if (collection && (collection.length > 1) && propertyDefinition.hasOwnProperty('sortedBy')) {
    let collectionId = thingId + '.' + propertyName
    if (!sortedCollections.hasOwnProperty(collectionId)) {
      sortedCollections[collectionId] = {
        collectionPropertyName: propertyName,
        folder: folder,
        references: collection,
        sortedBy: propertyDefinition.sortedBy,
        thingId: thingId
      }
    }
  }
}

/**
 * Adds a reference to a thing to a collection of references.
 * @param thingId            Required unique identifier of the thing that contains a reference to another thing.
 * @param type               Required object that defines the type of thing that contains a reference to another thing.
 * @param {string} property  Required name of the thing's property that contains a reference to another thing.
 * @param value              Required reference value.
 */
function addReference (thingId, type, property, value) {
  const methodName = 'addReference'
  if (!thingId) {
    throw new Error('Missing id of thing that refers to another thing')
  }
  if (!type) {
    throw new Error('Missing type of thing that refers to another thing')
  }
  if (!property) {
    throw new Error('Missing name of the property of a thing whose value refers to another thing')
  }
  if (!value) {
    throw new Error('Missing reference to a thing')
  }
  logger.info(
    methodName,
    'thingId = "' + thingId + '", type = "' + type.name + '", property = "' + property + '", value = "' + value + '"')
  if (type.properties[property] && type.properties[property].hasOwnProperty('inverse')) {
    let key = (value.trim()[1] === '/')
      ? value.substring(1, value.length - 1)
      : thingId + '/' + value.substring(1, value.length - 1)
    if (!inverseReferences[key]) {
      inverseReferences[key] = {}
    }
    let inverse = type.properties[property].inverse
    if (!inverseReferences[key][inverse]) {
      inverseReferences[key][inverse] = {}
    }
    inverseReferences[key][inverse][thingId] = ''
  }
  if (!things[thingId]) {
    things[thingId] = {}
  }
  if (!things[thingId][property]) {
    things[thingId][property] = {}
  }
  if (value.trim()[1] === '/') {
    things[thingId][property][value.substring(1, value.length - 1)] = ''
  } else {
    things[thingId][property][thingId + '/' + value.substring(1, value.length - 1)] = ''
  }
}

function checkRepresentationLink (configuration, thingId, file) {
  const data = fs.readFileSync(file)
  try {
    let link = JSON.parse(data)
    checkRepresentationLinkProperties(link, file)
    if (link && link.name) {
      if (fs.existsSync(configuration.representations + thingId + '/' + link.name)) {
        updateAcls(thingId, link)
      }
    } else {
      // TODO - throw exception missing name linked representation file name.
    }
  } catch (exception) {
    throw new Error(
      'An error occurred while reading the JSON link file \'' +
      file +
      '\', \n  error = \'' +
      exception +
      '\'' +
      '\', \n  file contents = \'' +
      data
    )
  }
}

/**
 * Checks that the given link object contains allowed properties. Throws an error, if the given link object contains
 * properties that Sqwerl doesn't process.
 * @param {string} link  Describes a thing's digital representation (file) stored outside of a Git repository.
 * @param {string} file  The path to a file whose contents describe a thing's digital representation.
 */
function checkRepresentationLinkProperties(link, file) {
  const allowedProperties = ['canRead', 'href', 'name', 'title']
  const properties = Object.keys(link)
  let unknownProperties = properties.filter(property =>
    allowedProperties.indexOf(property) === -1)
  if (unknownProperties.length > 0) {
    if (unknownProperties.length === 1) {
      throw new Error(
        `The property named "${unknownProperties[0]}" is not allowed within the link file "${file}"`)
    } else {
      throw new Error(
        `The properties named "${unknownProperties.toString()}" are not allowed within the link file "${file}"`)
    }
  }
}

/**
 * Do the facets of a type of thing define a property?
 * @param type          Required type of thing.
 * @param thingId       Required unique identifier of a thing of the given type.
 * @param property      Required name of a property of the given thing.
 * @param reference     Required reference to a persistent thing.
 * @return {boolean}    True if the given property of the given object is defined by one of the given type's facets.
 */
function definedByFacet (type, thingId, property, reference) {
  let components
  let facetId
  let facetProperty
  let facetType
  let foundDefinition = false
  let referencedTypeId = typeIdOf(reference)
  let referencedType = types[referencedTypeId]
  components = referencedTypeId.split('/')
  while ((!referencedType) && (components.length > 1)) {
    components.pop()
    referencedType = types[components.join('/')]
  }
  if (referencedType) {
    // If the type of referenced object is defined in terms of facets, then go through the type's facets
    // to find the definition of a property that can refer to the given thing.
    if (referencedType.facets) {
      for (facetId in referencedType.facets) {
        if (referencedType.facets.hasOwnProperty(facetId)) {
          facetType = types[facetId.slice(1, facetId.length - 1)]
          for (facetProperty in facetType.properties) {
            if (facetType.properties.hasOwnProperty(facetProperty)) {
              if (facetType.properties[facetProperty].inverse === property) {
                foundDefinition = true
                addReference(thingId, type, property, reference)
                break
              }
            }
          }
        }
      }
    } else {
      throw new Error(
        'Can\'t find a thing with the id "' +
        reference +
        '", of the type "' +
        referencedTypeId +
        '\'')
    }
  }
  return foundDefinition
}

function exists (folder, parentFolder, thing) {
  let exists
  try {
    exists = fs.existsSync(folder + thing)
    if ((!exists) && parentFolder) {
      exists = fs.statSync(parentFolder + thing)
    }
  } catch (error) {
    if (parentFolder) {
      try {
        exists = fs.statSync(parentFolder + thing)
      } catch (error) {
        exists = false
      }
    } else {
      exists = false
    }
  }
  return exists
}

/**
 * Retrieves thing's sort keys. Returns the values of a thing's properties that the thing is sorted by.
 *
 * @param {String} folder
 * @param {String} thingId
 * @param {Array} properties
 * @param {function} next
 */
function fetchKeys (folder, parentFolder, thingId, properties, next) {
  let file = folder + '/' + thingId.split('/').slice(2).join('/') + '/thing.json'
  fs.stat(file, function (error) {
    if (error && parentFolder) {
      fetchKeys(parentFolder, null, thingId, properties, next)
    } else {
      fs.readFile(file, function (error2, data) {
        let key = ''
        let thing
        if (error2) {
          throw new Error(
            'Could not read file "' +
            file +
            '". Error: ' +
            error)
        } else {
          thing = JSON.parse(data)
          properties.forEach(function (propertyName) {
            if (!thing[propertyName]) {
              throw new Error(
                'Trying to sort the thing "' +
                thingId +
                '" by its property named "' +
                propertyName +
                '" which is empty or missing.')
            }
            key += thing[propertyName]
          })
          next(key)
        }
      })
    }
  })
}

/**
 * Returns the unique identifier for the thing that a file with the given name represents.
 * @param {String} file     A required file name.
 * @return {String}         A persistent thing's unique identifier.
 */
function fileToId (file) {
  let id = ''
  let a = file.split('/')
  let isPath = false
  let i
  let methodName = 'fileToId'
  for (i = 0; i < a.length - 1; i += 1) {
    if (a[i] === 'types') {
      isPath = true
    }
    if (isPath) {
      id += '/' + a[i]
    }
  }
  logger.info(methodName, 'file = "' + file + '", id = "' + id + '"')
  return id
}

/**
 * Checks to see if a file exists within a library.
 * @param path      Required file's resource ID.
 * @param folder    Required folder where a library's things are stored.
 * @return {Boolean} true if the file exists within of the given folder (or one of its sub-folders).
 */
function findFile (path, folder) {
  let wasFound = false
  let components = referenceToPath(path).split('/')
  let folderComponents = folder.split('/')
  let targetFolder = folder + '/' + components.slice(2, components.length - 1).join('/')
  let file = components.pop()
  let files
  let i
  const methodName = 'findFile'
  let fileToFind =
    folderComponents.slice(0, folderComponents.length - 1).join('/') + '/' +
    components.slice(1, components.length).join('/') +
    '/' +
    file
  logger.info(methodName, 'Looking for file "' + fileToFind + '", folder "' + targetFolder + '"')
  try {
    files = fs.readdirSync(targetFolder)
    for (i = 0; i < files.length; i += 1) {
      if (file === files[i]) {
        wasFound = true
        break
      }
    }
  } catch (error) {
    logger.info(methodName, 'Couldn\'t find file "' + fileToFind + '"')
  }
  return wasFound
}

function finished () {
  const methodName = 'finished'
  logger.info(
    methodName,
    'Finished testing ' +
    Object.keys(things).length.toLocaleString() +
    ' things and ' +
    Object.keys(types).length.toLocaleString() +
    ' types.')
}

/**
 * Attempts to convert the given value to a reference to a thing.
 * @param {object} value   A value that may or may not be a reference to a thing.
 * @returns {string | null}  A string that refers to a persistent thing, or null if the given value isn't a reference
 *                           to a thing.
 */
function convertToReference (value) {
  let result = null
  if (value) {
    let text = value.toString()
    if (text) {
      let v = text.trim()
      result = ((v.length > 1) && (v[0] === '<') && (v[v.length - 1] === '>')) ? v : null
    }
  }
  return result
}

/**
 * Loads data from a collection of files.
 * @param {object} configuration            Application configuration.
 * @param {string} [parent]                 Parent folder that contains a library of things.
 * @param {string} dataFilename             Name of the files that contain the data we want to load.
 * @param {function} readDataCallback       Called to read a data file.
 * @param {function} [next]                 Called to get the next file or folder to load.
 * @param {function} [loadParentCallback]   Called after all type information has been read from the given folder's
 *                                          child folders.
 * @param {function} [nextLoadCallback]     Called to load more information after the load function is done.
 */
function load (configuration, parent, dataFilename, readDataCallback, next, loadParentCallback, nextLoadCallback) {
  let base = parent
  const methodName = 'load'
  let work = []
  fs.stat(base, function (error, status) {
    if (error) {
      logger.error(methodName, 'Could not read file "' + base + '".')
    } else {
      if (status.isDirectory()) {
        testFolderNameDoesNotContainPeriods(base)
        fs.readdir(base, function (error, files) {
          if (error) {
            logger.error(methodName, error)
          } else {
            files.forEach(function (f) {
              if (f[0] !== '.') {
                if (!resource.isValidResourceId(f)) {
                  throw new Error('The name of the file "' + base + '/' + f + '" contains invalid characters.')
                }
                work.push(function (next) {
                  load(configuration, base + '/' + f, dataFilename, readDataCallback, next, loadParentCallback)
                })
              }
            })
            worker.doWork(work, function () {
              if (next) {
                next(null)
              } else if (loadParentCallback) {
                loadParentCallback(nextLoadCallback)
              }
            })
          }
        })
      } else {
        if (base.split('/').pop() === dataFilename) {
          readDataCallback(base, next)
        } else {
          next(null)
        }
      }
    }
  })
}

/**
 * Loads things.
 * @param {object} configuration           Application configuration.
 * @param {string} folder                  Folder that contains files that defines things.
 * @param {function} [loadParentCallback]  Called after things have been loaded from the given folder.
 */
function loadThings (configuration, folder, loadParentCallback) {
  load(configuration, folder, 'thing.json', function (file, next) {
    readDataFile(configuration, folder, file, next)
  }, null, loadParentCallback, null)
}

/**
 * Loads objects that define the properties of types of persistent things.
 * @param {object} configuration            Application configuration.
 * @param {string} folder                   Folder that contains files that define types of things.
 * @param {function} [loadParentCallback]   Callback function invoked after all type information has been loaded from
 *                                          the given folder.
 */
function loadTypes (configuration, folder, loadParentCallback) {
  load(
    configuration,
    folder,
    'type.json',
    function (file, next) {
      readTypeFile(configuration, folder, file, next)
    },
    null,
    loadParentCallback,
    function () {
      loadThings(configuration, folder, loadParentCallback)
    }
  )
}

/**
 * Reads, and parses, a file that defines a thing (a book, an author, a web page, and so on).
 * @param {Object} configuration  Application configuration.
 * @param {String} folder         Name of the folder that contains files that define types of things.
 * @param {String} file           Name of the file whose contents define a thing's properties.
 * @param {Function} next         Called to load the next data file.
 */
function readDataFile (configuration, folder, file, next) {
  let collection = []
  let components
  let thing
  let i
  let id
  const methodName = 'readDataFile'
  let path
  let value
  logger.info(methodName, 'Reading data file "' + file + '"')
  fs.readFile(file, function (error, data) {
    let expression, property, p
    if (error) {
      logger.error(methodName, error)
    } else {
      try {
        thing = JSON.parse(data)
        testPropertiesAreInAlphabeticalOrder(file, thing)
      } catch (e) {
        logger.info(methodName, 'Error occurred while loading thing metadata file "' + file + '".')
        throw e
      }
      id = fileToId(file)
      components = id.split('/')
      let typeId = components.slice(0, components.length - 1).join('/')
      let thingId = fileToId(file)
      things[thingId] = {}
      paths[id] = { name: thing.name, path: thing.path }
      for (property in thing) {
        if (thing.hasOwnProperty(property)) {
          value = thing[property]
          things[thingId][property] = {}
          if (typeof value === 'string') {
            expression = value.trim()
            // If the value is a reference to a persistent thing, then add the reference.
            if (expression.indexOf('<') === 0) {
              // If the reference is an absolute reference (a path from the root of a library of
              // persistent things) then add the reference. Otherwise, the reference is a relative
              // reference (a path from some other persistent thing). Then convert the relative
              // reference to an absolute reference and add that absolute reference.
              if (expression.charAt(1) === '/') {
                things[thingId][property][referenceToPath(expression)] = ''
              } else {
                things[thingId][property][thingId + '/' + referenceToPath(expression)] = ''
              }
            }
          } else {
            if (value instanceof Array) {
              for (i = 0; i < value.length; i += 1) {
                if (typeof value[0] === 'string') {
                  // TODO - Duplicated from above. Refactor.
                  expression = value[0].trim()
                  // If the value is a reference to a persistent thing, then add the reference.
                  if (expression.indexOf('<') === 0) {
                    // If the reference is an absolute reference (a path from the root of a library of
                    // persistent things) then add the reference. Otherwise, the reference is a relative
                    // reference (a path from some other persistent thing). Then convert the relative
                    // reference to an absolute reference and add that absolute reference.
                    if (expression.charAt(1) === '/') {
                      path = referenceToPath(expression)
                      things[thingId][property][path] = ''
                    } else {
                      path = thingId + '/' + referenceToPath(expression)
                      things[thingId][property][path] = ''
                    }
                    collection.push(path)
                  }
                }
              }
            } else {
              if (value instanceof Object) {
                for (p in value) {
                  if (value.hasOwnProperty(p)) {
                    // TODO - Duplicated from above. Refactor.
                    expression = p
                    // If the value is a reference to a persistent thing, then add the reference.
                    if (expression.indexOf('<') === 0) {
                      things[thingId][p] = {}
                      // If the reference is an absolute reference (a path from the root of a library of
                      // persistent things) then add the reference. Otherwise, the reference is a relative
                      // reference (a path from some other persistent thing). Then convert the relative
                      // reference to an absolute reference and add that absolute reference.
                      if (expression.charAt(1) === '/') {
                        path = referenceToPath(expression)
                        things[thingId][property][path] = ''
                      } else {
                        path = thingId + '/' + referenceToPath(expression)
                        things[thingId][property][path] = ''
                      }
                      collection.push(path)
                    }
                  }
                }
              }
            }
          }
        }
      }
      testChildren(configuration, file, thing)
      testThing(configuration, folder, typeId, id, thing, {}, {}, false)
      next(thing)
    }
  })
}

/**
 * Reads, and parses, a file that defines a type of thing.
 * @param {object} configuration  Application configuration.
 * @param {string} folder         Name of the folder that contains files that define types of things.
 * @param {string} file           Name of the file whose contents define the properties of a type of thing.
 * @param {function} next         Called to load the next type file.
 */
function readTypeFile (configuration, folder, file, next) {
  const methodName = 'readTypeFile'
  fs.readFile(file, function (error, data) {
    if (error) {
      logger.error(methodName, error)
    } else {
      let typeId = fileToId(file)
      let typeObject
      try {
        typeObject = JSON.parse(data)
        logger.debug(methodName, 'Type definition: ' + data)
        types[typeId] = typeObject
        testThing(configuration, folder, '/types', typeId, typeObject, {}, {}, true)
      } catch (e) {
        logger.error(methodName, 'Error occurred while loading type definition file "' + file + '".\n' + e)
        throw e
      }
      next(typeObject)
    }
  })
}

/**
 * Returns the path part of a thing reference. Checks that the given reference starts with a less than sign and
 * ends with a greater than sign and returns everything between the less than and greater than sign.
 * @param {string} reference     Required reference to a persistent thing.
 * @return {string} The path to the persistent thing that the given reference refers to.
 */
function referenceToPath (reference) {
  const methodName = 'referenceToPath'
  logger.debug(methodName, 'Converting reference "' + reference + '" to path')
  if ((reference.charAt(0) !== '<') || (reference.charAt(reference.length - 1) !== '>')) {
    throw new Error(
      'The reference "' +
      reference +
      '" is not enclosed within less than and greater than signs.'
    )
  }
  let path = reference.slice(1, reference.length - 1)
  logger.debug(methodName, 'path = "' + path + '"')
  return path
}

/**
 * Tests the files that contain the information that makes up a library of things.
 * @param {object} configuration    Application configuration.
 */
function test (configuration) {
  let folder = configuration.defaultLibraryPath
  const methodName = 'test'
  let parentFolder = configuration.catalogLibraryPath
  logger.info(methodName, 'Testing things...')
  logger.info(methodName, '  folder: \'' + configuration.defaultLibraryPath + '\'')
  logger.info(methodName, '  parentFolder: \'' + configuration.catalogLibraryPath + '\'')
  loadTypes(
    configuration,
    folder,
    parentFolder
      ? function () {
        load(
          configuration,
          parentFolder,
          'type.json',
          function (file, next) {
            readTypeFile(configuration, folder, file, next)
          },
          null,
          function () {
            loadThings(
              configuration,
              folder,
              parentFolder
                ? function () {
                  loadThings(configuration, parentFolder, function () {
                    testReferences(configuration, folder, parentFolder)
                    // TODO - Remove testAcls function or change how it works.
                    // testAcls(configuration, folder, parentFolder)
                    testCollections(configuration, folder, parentFolder, function () {
                      testPaths()
                      finished()
                    })
                  })
                }
                : null
            )
          },
          null
        )
      }
      : function () {
        loadThings(configuration, folder, function () {
          testReferences(configuration, folder, parentFolder)
          testAcls(configuration, folder, parentFolder)
          testCollections(configuration, folder, parentFolder, function () {
            testPaths()
            finished()
          })
        })
      }
  )
}

/**
 * Test access control lists (ACLs).
 * @param {object} configuration     Application configuration.
 * @param {string} folder            Root folder of a library of things.
 * @param {string} [parentFolder]    Root folder of a parent library of things.
 */
function testAcls (configuration, folder, parentFolder) {
  let acl
  let components
  let id
  let parentAcl
  let t
  if (parentFolder) {
    components = parentFolder.split('/')
    parentAcl = JSON.parse(fs.readFileSync(components.slice(0, components.length - 1).join('/') + '/read_acls.json'))
  }
  components = folder.split('/')
  acl = JSON.parse(fs.readFileSync(components.slice(0, components.length - 1).join('/') + '/read_acls.json'))
  for (id in canReadAcl) {
    if (canReadAcl.hasOwnProperty(id)) {
      if (acl.hasOwnProperty(id)) {
        for (t in canReadAcl[id]) {
          if (canReadAcl[id].hasOwnProperty(t)) {
            if (acl[id][t] === canReadAcl[id][t]) {
              delete acl[id][t]
            }
          }
        }
        if (Object.keys(acl[id]) > 0) {
          throw new Error('Read ACL mismatch for the thing with the id "' + id + '".')
        }
        delete canReadAcl[id]
      } else {
        if (parentAcl && parentAcl.hasOwnProperty(id)) {
          for (t in canReadAcl[id]) {
            if (canReadAcl[id].hasOwnProperty(t)) {
              if (parentAcl[id][t] === canReadAcl[id][t]) {
                delete parentAcl[id][t]
              }
            }
          }
          if (Object.keys(parentAcl[id]) > 0) {
            throw new Error('Read ACL mismatch for the thing with the id "' + id + '".')
          }
          delete canReadAcl.id
        } else {
          throw new Error(
            'Missing read access control list for the thing with the id "' + id + '".'
          )
        }
      }
    }
  }
  if (canReadAcl.length > 0) {
    throw new Error('There are unmatched read access control lists.')
  }
}

/**
 * Tests that a thing's children property contains references to a thing's children. For a given persistent thing
 * defined in the given file, test that all things defined in child folders of the folder containing the given
 * file are referenced within the given thing's 'children' property.
 *
 * @param configuration     Application configuration.
 * @param {string} file     Name of a file whose contents define a persistent thing.
 * @param {Object} thing    The persistent thing (defined by the contents of the given file).
 */
function testChildren (configuration, file, thing) {
  let files
  let folder = file.substring(0, file.lastIndexOf('/'))
  let status = fs.statSync(folder)
  if (status.isDirectory()) {
    files = fs.readdirSync(folder)
    files.forEach(function (f) {
      let id
      let path = folder + '/' + f
      let s = fs.statSync(path)
      let subFiles
      if (s.isDirectory()) {
        subFiles = fs.readdirSync(path)
        subFiles.forEach(function (subFile) {
          if (subFile === 'thing.json') {
            id = fileToId(path + '/' + subFile)
            if (thing.hasOwnProperty('children')) {
              if (!thing.children.hasOwnProperty('<' + id + '>')) {
                throw new Error(
                  'The "children" property of the thing with the ID "' +
                  fileToId(path) +
                  '" is missing a reference to the child "' +
                  '<' +
                  id +
                  '>".'
                )
              }
            } else {
              throw new Error(
                'The thing with the ID "<' +
                fileToId(path + '/' + subFile) +
                '>" has children but doesn\'t have a "children" property.'
              )
            }
          }
        })
      }
    })
  }
}

function testCollection (configuration, folder, parentFolder, collectionId, done) {
  let collection = sortedCollections[collectionId]
  const methodName = 'testCollection'
  let work = []
  collection.references.forEach(function (reference) {
    work.push(function (next) {
      fetchKeys(folder, parentFolder, referenceToPath(reference), collection.sortedBy, next)
    })
  })
  worker.doWork(
    work,
    function (keys) {
      let previousKey = null
      logger.info(
        methodName,
        'Testing the values of the properties "' +
        collection.sortedBy +
        '" of the things within the collection "' +
        collectionId +
        '" for their sort order'
      )
      keys.forEach(function (key) {
        if (previousKey && previousKey[0] && (previousKey[0].toLowerCase() > key[0].toString().toLowerCase())) {
          throw new Error(
            'The values of the property named "' +
            collection.collectionPropertyName +
            '" of the thing with the ID "<' +
            collection.thingId +
            '>" are not in the proper sort order.\n' +
            'The value "' +
            previousKey[0] +
            '" does not come before the value "' +
            key[0] +
            '".'
          )
        }
        previousKey = key
      })
      done()
    }
  )
}

/**
 * Test sort order of members of sorted collections of things.
 * @param {object} configuration   Application configuration.
 * @param {string} folder          Root folder of a library of things.
 * @param {string} [parentFolder]  Root folder of a parent library of things.
 */
function testCollections (configuration, folder, parentFolder, successFunction) {
  let collectionId
  let id
  let work = []
  for (collectionId in sortedCollections) {
    if (sortedCollections.hasOwnProperty(collectionId)) {
      id = collectionId
      work.push((function (id) {
        return function (next) {
          testCollection(configuration, folder, parentFolder, id, next)
        }
      })(id))
    }
  }
  worker.doWork(
    work,
    function () {
      delete sortedCollections[collectionId]
      if (Object.keys(sortedCollections).length === 0) {
        successFunction()
      }
    }
  )
}

/**
 * Tests that the given folder's name doesn't contain periods unless it's referring to the current directory or
 * the current directory's parent directory. We don't allow periods because the folder names appear in the URLs to
 * things stored in Sqwerl libraries and Sqwerl uses periods in the tail end of URLs to refer to a thing's property.
 * @param {string} [folder]
 */
function testFolderNameDoesNotContainPeriods(folder) {
  if (folder) {
    const components = folder.split('/')
    components.forEach(component => {
      if ((component !== '.') && (component !== '..') && (component.indexOf('.') >= 0)) {
        throw new Error(`The folder (directory) named "${folder}" contains a period.\n` +
          'Folder names cannot contain periods.')
      }
    })
  }
}

/**
 * Tests things' path properties.
 */
function testPaths () {
  let i
  let id
  let idComponents
  const methodName = 'testPaths'
  let name
  let path
  let pathComponents
  let x
  for (id in paths) {
    if (paths.hasOwnProperty(id)) {
      logger.info(methodName, 'Testing paths "' + id + '"')
      path = paths[id].path
      logger.info(methodName, id + '.path = ' + path)
      pathComponents = path.split('/')
      name = pathComponents[pathComponents.length - 1]
      if (paths[id].name !== name) {
        throw new Error(
          'The name of the thing with the id "' +
          id +
          '" does not match the name in the thing\'s path: "' +
          name +
          '"'
        )
      }
      idComponents = id.split('/')
      for (i = 1; i < idComponents.length - 1; i += 1) {
        x = idComponents.slice(0, i + 1).join('/')
        if (paths[x] && (paths[x].name !== pathComponents[i])) {
          throw new Error(
            'The name "' +
            pathComponents[i] +
            '" within the path "' +
            path +
            '" of the object with the id "' +
            id +
            '" does not match the name of a thing on the path.'
          )
        }
      }
    }
  }
}

/**
 * Tests that a things properties are defined in ascending alphabetical order.
 * @param {string} file   Name of a file whose contents define a persistent thing.
 * @param {object} thing  A persistent thing created from the given file's contents.
 */
function testPropertiesAreInAlphabeticalOrder (file, thing) {
  let index = 0
  const methodName = 'testPropertiesAreInAlphabeticalOrder'
  let needsReordering = false
  let properties = []
  let property
  for (property in thing) {
    if (thing.hasOwnProperty(property)) {
      properties.push(property)
    }
  }
  const sortedProperties = properties.slice().sort()
  for (let p in thing) {
    if (thing.hasOwnProperty(p)) {
      if (sortedProperties[index] !== properties[index]) {
        throw new Error(
          'The property "' +
          p +
          '" of the thing with the id "' +
          fileToId(file) +
          '" is not in alphabetical order.')
      }
      index += 1
    }
  }
}

/**
 * Tests that all references to persistent things actually refer to persistent things within a library of
 * persistent things.
 * @param {object} configuration   Application configuration.
 * @param {string} folder          Name of the root folder of a library of things.
 * @param {string} [parentFolder]  Name of the root folder of a parent library of things.
 */
function testReferences (configuration, folder, parentFolder) {
  let components
  const methodName = 'testReferences'
  let existingThings = {}
  let thing
  let property
  let p2
  let wasFound
  let sourceType
  let sourceTypeId
  let parentComponents
  let propertyDefinition
  let inverseExists
  let reference
  let i
  for (thing in things) {
    if (things.hasOwnProperty(thing)) {
      logger.info(methodName, 'Testing references "' + thing + '"')
      for (property in things[thing]) {
        if (things[thing].hasOwnProperty(property)) {
          logger.info(
            methodName,
            'things[thing][property] === things["' + thing + '"]["' + property + '"] = "' +
            things[thing][property] +
            '"')
          for (p2 in things[thing][property]) {
            if (things[thing][property].hasOwnProperty(p2)) {
              logger.info(methodName, 'Testing reference of "' + thing + '["' + p2 + '"]')
              if ((!things.hasOwnProperty(p2)) && (!existingThings.hasOwnProperty(p2))) {
                logger.info(methodName, 'Looking for file referenced by id "' + p2 + '"')
                wasFound = findFile('<' + p2 + '>', folder)
                if ((wasFound === false) && parentFolder) {
                  wasFound = findFile('<' + p2 + '>', parentFolder)
                }
                if (wasFound) {
                  existingThings[p2] = ''
                  if (!resource.isValidResourceId(referenceToPath('<' + p2 + '>'))) {
                    throw new Error('The resource name "' + p2 + '" contains invalid characters.')
                  }
                  logger.info(methodName, 'Found referenced file "' + p2 + '"')
                } else {
                  throw new Error(
                    'The property "' +
                    property +
                    '" of the thing with the ID "' +
                    thing +
                    '" refers to a thing with the ID "' +
                    p2 +
                    '" that doesn\'t exist.'
                  )
                }
              } else {
                logger.info(methodName, 'Found referenced object "' + p2 + '"')
              }
            }
          }
        }
      }
    }
  }
  components = folder.split('/')
  folder = components.slice(0, components.length - 1).join('/')
  if (parentFolder) {
    parentComponents = parentFolder.split('/')
    parentFolder = parentComponents.slice(0, parentComponents.length - 1).join('/')
  }
  for (thing in inverseReferences) {
    if (inverseReferences.hasOwnProperty(thing)) {
      logger.info(methodName, 'Testing inverse references to "' + thing + '"')
      for (property in inverseReferences[thing]) {
        if (inverseReferences[thing].hasOwnProperty(property)) {
          for (p2 in inverseReferences[thing][property]) {
            if (inverseReferences[thing][property].hasOwnProperty(p2)) {
              logger.info(
                methodName,
                'Testing inverse reference to "' + p2 + '" from "' + thing + '"["' + property + '"]')
              if (!existingThings.hasOwnProperty(p2)) {
                if (!exists(folder, parentFolder, p2)) {
                  throw new Error(
                    'The property "' +
                    property +
                    '" of the thing with the ID "' +
                    thing +
                    '" must refer back to the thing with the ID "' +
                    p2 +
                    '" that doesn\'t exist.'
                  )
                }
                existingThings[p2] = ''
              }
              sourceTypeId = thing.split('/').slice(0, 3).join('/')
              sourceType = types[sourceTypeId]
              if (!sourceType) {
                throw new Error(
                  'Could not find a source type with the id "' +
                  sourceTypeId +
                  '" referenced by the property "' +
                  property +
                  '" of the thing "' +
                  thing +
                  '".'
                )
              }
              propertyDefinition = sourceType.properties[property]
              inverseExists = false
              if (propertyDefinition) {
                if (!things[thing]) {
                  throw new Error('Could not find the thing with the ID "' + thing + '".')
                }
                reference = things[thing][property]
                if (typeof reference === 'string') {
                  inverseExists = (reference === p2)
                } else if (reference instanceof Array) {
                  for (i = 0; i < reference.length; i += 1) {
                    if (p2 === reference[i]) {
                      inverseExists = true
                      break
                    }
                  }
                } else if (reference instanceof Object) {
                  if (reference.hasOwnProperty(p2)) {
                    inverseExists = true
                  }
                }
                if (!inverseExists) {
                  throw new Error(
                    'The property "' +
                    property +
                    '" of the thing "' +
                    thing +
                    '" does not refer back to the thing "' +
                    p2 +
                    '".'
                  )
                }
              } else {
                // For things (not types of things, make sure that the thing contains properties
                // required by its type definition.
                if (!types[thing]) {
                  for (p2 in sourceType.properties) {
                    if (sourceType.properties.hasOwnProperty(p2)) {
                      if (sourceType.properties[p2].hasOwnProperty('required') &&
                        sourceType.properties[p2].required &&
                        (!sourceType.properties[p2].computed)) {
                        if (!things[thing].hasOwnProperty(p2)) {
                          throw new Error(
                            'The thing with the ID "' +
                            thing +
                            '" does not have the required property "' +
                            p2 +
                            '" defined by the type with the ID "' +
                            sourceTypeId +
                            '\''
                          )
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  logger.info(methodName, 'Finished testing references.')
}

/**
 * Tests that a persistent thing conforms to its type.
 * @param {object} configuration         Application configuration.
 * @param {string} folder                Name of the folder that contains files that define types of things.
 * @param {string} [typeId]              Unique identifier for a type of thing.
 * @param {string} thingId               Unique identifier for a persistent thing.
 * @param {object} thing                 Persistent thing.
 * @param {object} checkedProperties     Object whose properties are the identifiers of the given thing's properties
 *                                       that have been checked for conformance to their definitions.
 * @param {object} undefinedProperties   Object whose properties are the identifiers of the given thing's properties
 *                                       that haven't been matched to a definition within the thing's type or
 *                                       super-types.
 * @param {boolean} isType               Is the thing to test a definition for a type of thing?
 */
function testThing (configuration, folder, typeId, thingId, thing, checkedProperties, undefinedProperties, isType) {
  let collection
  let type
  let typePropertyDefinitions
  let definition
  let hasProperty
  let value
  let valueType
  let i
  let isRequired
  let typePath
  let t
  let primitiveType
  let primitive
  let v
  let foundPrimitive
  let thingProperty
  let components
  let superTypeId
  let property
  let properties
  const methodName = 'testThing'
  logger.info(methodName, 'Testing thing "' + thingId + '" against the type "' + typeId + '".')
  if (typeId) {
    type = types[typeId]
    if (type && type.hasOwnProperty('properties')) {
      typePropertyDefinitions = type.properties
      for (definition in typePropertyDefinitions) {
        if (typePropertyDefinitions.hasOwnProperty(definition)) {
          if (!checkedProperties.hasOwnProperty(definition)) {
            hasProperty = thing.hasOwnProperty(definition)
            let isComputed = typePropertyDefinitions[definition].computed
            isRequired = typePropertyDefinitions[definition].required
            if (isRequired && (!isComputed) && (!hasProperty)) {
              throw new Error(
                'The thing with the ID "' +
                thingId +
                '" is missing the required property "' +
                definition +
                '" defined in the type with the id "' +
                typeId +
                '".'
              )
            }
            checkedProperties[definition] = ''
            if (undefinedProperties.hasOwnProperty(definition)) {
              delete undefinedProperties[definition]
            }
            if (hasProperty) {
              value = thing[definition]
              valueType = type.properties[definition].type
              if (valueType instanceof Array) {
                if (value instanceof Array) {
                  if ((typeof valueType[0]) === 'string') {
                    primitiveType = null
                    for (primitive in primitives) {
                      if (primitives.hasOwnProperty(primitive)) {
                        if (valueType[0] === primitive) {
                          primitiveType = primitives[primitive]
                          break
                        }
                      }
                    }
                    if (primitiveType) {
                      for (i = 0; i < value.length; i += 1) {
                        primitiveType.checkValue(configuration, value[i], definition, thingId, folder)
                      }
                    } else {
                      typePath = valueType[0].trim().substring(1, valueType[0].length - 1)
                      for (i = 0; i < value.length; i += 1) {
                        if (typeIdOf(value[i]).indexOf(typePath) !== 0) {
                          throw new Error(
                            'The reference "' +
                            value[i] +
                            '" of type "<' +
                            typeIdOf(value[i]) +
                            '>" located at index ' +
                            i +
                            ' of the property named "' +
                            definition +
                            '" defined in the type "<' +
                            typeId +
                            '>" of the object with the ID "' +
                            thingId +
                            '" isn\'t compatible with the required type "<' +
                            typePath +
                            '>".'
                          )
                        }
                        addReference(thingId, type, definition, value[i])
                      }
                      addCollection(folder, thingId, definition, type.properties[definition], value)
                    }
                  } else {
                    // TODO - If the value is an object, then it is the type definition for
                    // inline object values.
                    logger.info(
                      methodName,
                      'Unimplemented functionality: ' +
                      'Value is an object treat as type definition for inline object values.')
                  }
                } else {
                  throw new Error(
                    'The property "' +
                    definition +
                    '" of the thing with the ID "' +
                    thingId +
                    '" must be an ordered list of values.'
                  )
                }
              } else if (valueType instanceof Object) {
                if (value instanceof Array) {
                  throw new Error(
                    'The property "' +
                    definition +
                    '" of the thing with the ID "' +
                    thingId +
                    '" must be a set of unique values.'
                  )
                }
                if (value instanceof Object) {
                  t = Object.keys(valueType)[0]
                  if ((typeof t) === 'string') {
                    primitiveType = null
                    for (primitive in primitives) {
                      if (primitives.hasOwnProperty(primitive)) {
                        if (t === primitive) {
                          primitiveType = primitives[primitive]
                          break
                        }
                      }
                    }
                    if (primitiveType) {
                      for (i = 0; i < value.length; i += 1) {
                        primitiveType.checkValue(configuration, value[i], definition, thingId, folder)
                      }
                    } else {
                      typePath = t.trim().substring(1, t.length - 1)
                      if (value instanceof Array) {
                        for (i = 0; i < value.length; i += 1) {
                          if (typeIdOf(value[i]).indexOf(typePath) !== 0) {
                            throw new Error(
                              'The reference "' +
                              value[i] +
                              '" at the index ' +
                              i +
                              '" of the property "' +
                              definition +
                              '" defined in the type with the ID "' +
                              typeId +
                              '" of the object with the ID "' +
                              thingId +
                              '" isn\'t compatible with the required type "<' +
                              typePath +
                              '>".'
                            )
                          }
                          addReference(thingId, type, definition, value[i])
                        }
                        addCollection(folder, thingId, definition, type.properties[definition], value)
                      } else {
                        collection = []
                        for (v in value) {
                          if (value.hasOwnProperty(v)) {
                            if (typeIdOf(v).indexOf(typePath) !== 0) {
                              if (!definedByFacet(type, thingId, definition, v)) {
                                throw new Error(
                                  'The reference "' +
                                  v +
                                  '" of the property "' +
                                  definition +
                                  '" defined in the type with the ID "' +
                                  typeId +
                                  '" of the object with the ID "' +
                                  thingId +
                                  '" isn\'t compatible with the required type "<' +
                                  typePath +
                                  '>".'
                                )
                              }
                            }
                            collection.push(v)
                            addReference(thingId, type, definition, v)
                          }
                        }
                        addCollection(folder, thingId, definition, type.properties[definition], collection)
                      }
                    }
                  } else {
                    // TODO - If the value is an object, then it is the type definition for
                    // inline object values.
                    logger.warn(
                      methodName,
                      'Unimplemented functionality ' +
                      '-- Value is an object so treat it as a type definition for inline object values.')
                  }
                } else {
                  throw new Error(
                    'The property "' +
                    definition +
                    '" of the thing with the ID "' +
                    thingId +
                    '" must be a set of unique values.'
                  )
                }
              } else {
                let referencedType = convertToReference(valueType)
                if (referencedType) {
                  let reference = convertToReference(value)
                  if (reference) {
                    // TODO - check that the value refers to a thing of the correct type.
                    logger.warn(methodName, 'Need to check that the value "' +
                      reference +
                      '" refers to a thing of the type "' +
                      referencedType +
                      '"')
                  } else {
                    throw new Error(
                      'The value "' +
                      value +
                      '" of the object with the ID "' +
                      thingId +
                      '" cannot be assigned to the property named "' +
                      definition +
                      '", of type "' +
                      valueType +
                      '", defined by the type "' +
                      typeId +
                      '" because the value does not refer to a thing')
                  }
                } else {
                  foundPrimitive = false
                  for (primitive in primitives) {
                    if (primitives.hasOwnProperty(primitive)) {
                      if (valueType === primitive) {
                        primitives[primitive].checkValue(configuration, value, definition, thingId, folder)
                        foundPrimitive = true
                        break
                      }
                    }
                  }
                  if (!foundPrimitive) {
                    if ((typeof value) === 'string') {
                      v = value.trim()
                      if (((v.length > 1) && (v[0] === '<') && (v[v.length - 1] === '>'))) {
                        addReference(thingId, type, definition, v)
                      }
                    } else {
                      throw new Error(
                        'The value ' +
                        JSON.stringify(value) +
                        ' cannot be assigned to the property named "' +
                        definition +
                        '", of type "' +
                        valueType +
                        '", defined by the type "' +
                        typeId +
                        '"')
                    }
                  }
                }
              }
            }
          }
        }
      }
      for (thingProperty in thing) {
        if (thing.hasOwnProperty(thingProperty)) {
          if ((!checkedProperties.hasOwnProperty(thingProperty)) && (!typePropertyDefinitions.hasOwnProperty(thingProperty))) {
            undefinedProperties[thingProperty] = ''
          }
        }
      }
    }
    components = typeId.split('/')
    superTypeId = typeId.split('/').slice(0, components.length - 1).join('/')
    if (isType) {
      if (typeId === '/types') {
        superTypeId = 'types'
      }
    }
    updateAcls(thingId, thing)
    testThing(configuration, folder, superTypeId, thingId, thing, checkedProperties, undefinedProperties, isType)
  } else {
    properties = ''
    for (property in undefinedProperties) {
      if (undefinedProperties.hasOwnProperty(property)) {
        properties += property + '\n'
      }
    }
    if (properties.length > 0) {
      throw new Error(
        'The following properties:\n' +
        properties +
        'are not defined for the thing with the ID "' +
        thingId +
        '", defined in the folder "' +
        folder +
        '".'
      )
    }
  }
}

/**
 * Returns the identifier for the type of object named by a given object identifier.
 * @param {string} reference    Required unique ID of a persistent thing.
 * @return {string}             The unique name of a type of thing.
 */
function typeIdOf (reference) {
  let s = reference.substring(1, reference.length - 1)
  s = s.split('/')
  s = s.slice(0, s.length - 1).join('/')
  return (s.length === 0) ? '/types' : s
}

/**
 * Updates the given thing's read/write access control lists (ACLs). A thing's access control list specifies which
 * users or groups of users are granted permission to perform an operation on a thing.
 * @param {string} thingId  Required unique ID of persistent thing.
 * @param {object} thing    Required persistent thing.
 */
function updateAcls (thingId, thing) {
  if (thing.hasOwnProperty('canRead')) {
    let acl = thing.canRead
    if (acl && (!(acl instanceof Array)) && (acl instanceof Object) && (Object.keys(acl).length > 0)) {
      canReadAcl['<' + thingId + '>'] = acl
    }
  }
  if (thing.hasOwnProperty('canWrite')) {
    let acl = thing.canWrite
    if (acl && (!(acl instanceof Array)) && (acl instanceof Object) && (Object.keys(acl).length > 0)) {
      canWriteAcl[thingId] = acl
    }
  }
}

exports.test = test
