import Bun from 'bun'
import { loadFromFile } from 'configuration'
import Logger from 'logger'
import SearchIndex from '@/search-index'


const logger = Logger('Server', 'info')

if (process.argv.length > 2) {
  const configuration = loadFromFile(process.argv[2], [{
    defaultValue: '8080',
    name: 'port'
  }, {
    defaultValue: 'http;//localhost:8080',
    name: 'baseUrl'
  }, {
    defaultValue: 'http://localhost:8080/representations',
    name: 'contentUrl'
  }, {
    isRequired: true,
    missingError: 'The \"libraryName\" configuration property must name the library this server provides access to.',
    name: 'libraryName'
  }, {
    isRequired: true,
    missingError: 'The \"libraryPath\" configuration property must be set to the directory/folder that contains a library of things.',
    name: 'libraryPath'
  }])
} else {
  const applicationName = 'server'
  logger.error(applicationName, 'Usage <server> <configurationFile>')
  logger.error(applicationName, '  Where <server> is a command to run this server,')
  logger.error(applicationName, '  for example: bun src/index.ts')
  logger.error(applicationName, '  and <configurationFile> is a JSON file that contains ' +
    'this application\'s configuration.')
}

const server = Bun.serve({
	port: 3167,
	fetch(req: any) {
		return new Response('Bun!')
	}
});
