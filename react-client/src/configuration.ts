export interface ConfigurationType {
  anonymousUserId: string
  anonymousUserName: string
  applicationName: string
  basePath: string
  baseUrl: string
  catalogLibraryName: string
  defaultLibraryId: string
  defaultLibraryName: string
  homeId: string
  VERSION: string
}

const Configuration = {
  /**
   * Unique ID for anonymous users (users who haven't had their identities verified).
   * @type {string}
   */
  anonymousUserId: 'guest@sqwerl.com',

  /**
   * Name for anonymous users.
   * @type {string}
   */
  anonymousUserName: 'guest',

  /**
   * The name of the server application that this client application communicates with. This client application
   * embeds this server application's name in the URLs it opens in order to communicate with the server.
   * @type {string}
   */
  applicationName: 'sqwerl',

  /**
   * The base path of the URL that points to this application.
   */
  basePath: '/app/',

  /**
   * The base URL of the first thing this client application displays. Typically, this is a path to the default
   * library of things that all guest (anonymous) users are allowed to view.
   * @type {string}
   */
  baseUrl: '/sqwerl/Main',

  /**
   * The name of the default catalog of things. A catalog is a library of things that describe users, user accounts,
   * and security settings.
   * @type {string}
   */
  catalogLibraryName: 'catalog',

  /**
   * The unique identifier for the library of things that guest users view when they start this application.
   * @type {string}
   */
  defaultLibraryId: '/types/libraries/Main',

  /**
   * The name of the default library of things that guest (anonymous) users are allowed to view.
   * @type {string}
   */
  defaultLibraryName: 'Main',

  /**
   * The ID of the first thing this application displays.
   * @type {string}
   */
  homeId: '/types/views/initial',

  /**
   * The version number of the protocol that this client application uses to communicate to its server application.
   * @type {string}
   */
  VERSION: '0.1.2'
}

export default Configuration
