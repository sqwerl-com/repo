const logger = require('sqwerl-logger').newInstance('LibraryConfiguration')

/**
 * Creates and initializes a library's configuration information.
 * @param {string} applicationName  A non-null, non-empty name of the application that provides access to a library.
 * @param {string} name             A non-null, non-empty name for the library.
 * @param {Library} [parent]        A library's optional parent library.
 * @param {String} home             A non-null, non-empty path to the directory where a library's data are stored.
 * @param {String} repositoryPath   A non-null, non-empty path to a library's Git repository.
 * @param {String} writablePath     A non-null, non-empty path to a version of the library that can be modified.
 * @returns {LibraryConfiguration}  A non-null library configuration.
 */
const LibraryConfiguration = (applicationName, name, parent, home, repositoryPath, writablePath) => {
  logger.info(LibraryConfiguration.name, 'Constructing new library configuration')
  return { applicationName, name, parent, home, repositoryPath, writablePath }
}

exports.LibraryConfiguration = LibraryConfiguration
