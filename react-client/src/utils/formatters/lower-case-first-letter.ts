/**
 * Returns the given text with the first letter changed to lower case.
 * @param text
 */
const lowerCaseFirstLetter = (text: string): string => text ? text[0].toLowerCase() + text.slice(1) : ''

export default lowerCaseFirstLetter
