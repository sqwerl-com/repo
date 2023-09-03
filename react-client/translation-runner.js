const { allLocales } = require('./package.json')
const manageTranslations = require('react-intl-translations-manager').default

manageTranslations({
  languages: allLocales,
  messagesDirectory: 'src/translations/messages',
  translationsDirectory: 'src/translations/locales/'
})
