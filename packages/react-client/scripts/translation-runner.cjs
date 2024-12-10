/**
 * Script that builds JSON files that map keys to localized text.
 *
 * Takes the contents of the src/messages/application.json file and creates multiple
 * *.json files in the src/translations/locales directory that map keys to text for
 * particular locales (locales are typically described as regions/contries, languages/dialects, etc.).
 */
const { allLocales } = require('../package.json')
const manageTranslations = require('react-intl-translations-manager').default

manageTranslations({
  languages: allLocales,
  messagesDirectory: 'src/translations/messages',
  translationsDirectory: 'src/translations/locales/'
})
