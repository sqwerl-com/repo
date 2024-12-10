/**
 * The Sqwerl REST server's initial execution point.
 */
const configuration = require('sqwerl-application-configuration')

let logger

const router = require('./router')

const SearchIndex = require('./search_index')

const server = require('./server')

const signUp = require('sqwerl-sign-up')

if (process.argv.length > 2) {
  let config = configuration.newInstanceFromFile(process.argv[2], [{
    isRequired: true,
    missingError: 'The \'applicationName\' configuration property must specify the application\'s name.',
    name: 'applicationName'
  }, {
    defaultValue: 'http://localhost:8080',
    name: 'baseUrl'
  }, {
    defaultValue: 'http://localhost:8080/representations',
    name: 'contentUrl'
  }, {
    isRequired: true,
    missingError: 'The \'catalogLibraryName\' configuration property must specify the name of the catalog' +
      ' (base) library.',
    name: 'catalogLibraryName'
  }, {
    isRequired: true,
    missingError: 'The \'catalogLibraryPath\' configuration property must specify a path to the catalog library.',
    name: 'catalogLibraryPath'
  }, {
    isRequired: true,
    missingError: 'The \'catalogLibraryWritablePath\' configuration property must specify a path to a' +
      ' catalog library whose contents this application can alter.',
    name: 'catalogLibraryWritablePath'
  }, {
    isRequired: true,
    missingError: 'The \'catalogLibraryRepositoryPath\' configuration property must specify a path to the' +
      ' catalog library\'s Git repository.',
    name: 'catalogLibraryRepositoryPath'
  }, {
    isRequired: true,
    missingError: 'The \'clientSourcePath\' configuration property must specify the path to the client' +
      ' application\'s source code.',
    name: 'clientSourcePath'
  }, {
    defaultValue: 10,
    name: 'collectionLimit'
  }, {
    isRequired: true,
    missingError: 'The \'defaultLibraryName\' configuration property must specify the name of the default' +
      ' (guest) library.',
    name: 'defaultLibraryName'
  }, {
    isRequired: true,
    missingError: 'The \'defaultLibraryPath\' configuration property must specify the path to a copy of' +
      ' the default (guest) library that this application can alter.',
    name: 'defaultLibraryPath'
  }, {
    isRequired: true,
    missingError: 'The \'defaultLibraryPath\' configuration property must specify the path to the default' +
      ' (guest) library.',
    name: 'defaultLibraryWritablePath'
  }, {
    isRequired: true,
    missingError: 'The \'defaultLibraryRepositoryPath\' configuration property must specify the path the the' +
      ' default (guest) library\'s Git repository.',
    name: 'defaultLibraryRepositoryPath'
  }, {
    isRequired: true,
    missingError: 'The \'helpSourcePath\' configuration property must specify the path to the application\'s' +
      ' online help.',
    name: 'helpSourcePath'
  }, {
    defaultValue: 'info',
    name: 'loggingLevel'
  }, {
    defaultValue: 250,
    name: 'maximumSearchResultCount'
  }, {
    defaultValue: 8080,
    name: 'port'
  }, {
    isRequired: true,
    missingError: 'The \'representations\' configuration property must specify a path to digital representations' +
      ' of things.',
    name: 'representations'
  }, {
    isRequired: true,
    missingError: 'The \'signUpConfiguration\' configuration property must specify a path to sign up' +
      ' configuration information.',
    name: 'signUpConfiguration'
  }, {
    defaultValue: 0,
    name: 'signUpFailureRate'
  }, {
    isRequired: true,
    missingError: 'The \'securityTokenEncryptionKey\' configuration property must specify the encryption key' +
      ' for security tokens.',
    name: 'securityTokenEncryptionKey'
  }, {
    name: 'useHttps'
  }])
  logger = require('sqwerl-logger').newInstance('Index', config.loggingLevel || 'info')
  /* TODO - Add this back in later.
  if (config.signUpConfiguration) {
    config.signUpConfiguration = configuration.loadFromFile(config.signUpConfiguration)
    signUp.configureEmailServer(config.signUpConfiguration)
  }
   */
  const searcher = SearchIndex.SearchIndex(config)
  searcher.load(config.catalogLibraryPath, '/types', function () {
    searcher.load(config.defaultLibraryPath, '/types', function () {
      new router.Router(config, (error, router) => {
        if (error) {
          logger.error('main', error || error.toString())
        } else {
          searcher.addLibrary(config.catalogLibraryPath, router.libraries[config.catalogLibraryName])
          searcher.addLibrary(config.defaultLibraryPath, router.libraries[config.defaultLibraryName])
          searcher.buildIndex()
          server.start(router, searcher)
          console.log('server start finished')
        }
      })
    })
  })
} else {
  const applicationName = 'sqwerl-nodejs-server'
  logger.error(applicationName, 'Usage: node index.js <configuration file>')
  logger.error(applicationName, '       Where <configuration file> is a JSON file that specifies this ' +
    'application\'s configuration.')
}
