const router = require('../../../main/javascript/router')
const test = require('tap').test

test('Router properly configured.', t => {
  const configuration = {
    'applicationName': 'test',
    'catalogLibraryName': 'sqwerl-catalog',
    'catalogLibraryPath': 'src/test/resources/sqwerl-catalog',
    'catalogLibraryRepositoryPath': 'src/test/resources/sqwerl-catalog',
    'clientSourcePath': 'resources',
    'defaultLibraryName': 'default',
    'defaultLibraryPath': 'src/test/resources/default',
    'defaultLibraryRepositoryPath': 'src/test/resources/default',
    'helpSourcePath': 'resources'
  }
  const r = new router.Router(configuration)
  t.equals(r.catalogLibraryName, configuration.catalogLibraryName)
  t.equals(r.clientSourcePath, configuration.clientSourcePath)
  t.end()
})
