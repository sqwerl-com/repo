/**
 * Validates that strings are formatted as proper e-mail addresses.
 * {RegExp}
 */
const atom = '[^\\s\\(\\)><@,;:\\\\\\"\\.\\[\\]]+';

// TODO - See http://stackoverflow.com/questions/2049502/what-characters-are-allowed-in-email-address
//  Characters allowed in name: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~.
//  Characters allowed in server: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.
const emailPattern = /^(.+)@(.+)$/;

const ipPattern = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;

const logger = require('sqwerl-logger').newInstance('EmailValidator');

const userPattern = new RegExp('^([^\\s\\(\\)><@,;:\\\\\\\"\\.\\[\\]]+|(\"[^\"]*\"))(\\.([^\\s\\(\\)><@,;:\\\\\\\"\\.\\[\\]]+|(\"[^\"]*\")))*$');

/**
 * Is the domain portion of an e-mail address valid?
 *
 * @param {string} domain   Required part of an e-mail address that specifies the user's domain.
 * @return {boolean} true if the given domain specifier is valid.
 */
function checkDomains(domain) {
  let domainArray = domain.split('.');
  let count = domainArray.length;
  let isValid = true;
  let i;
  const methodName = 'checkDomains';
  const pattern = new RegExp('^' + atom + '$');
  for (i = 0; i < count; i += 1) {
    if (domainArray[i].search(pattern) === -1) {
      isValid = false;
      break;
    }
  }
  logger.debug(methodName, 'domain "' + domain + '" ' + (isValid ? 'is valid.' : 'is invalid.'));
  return isValid;
}

/**
 * Is the IP address portion of an e-mail address valid?
 *
 * @param {string} ip   Required internet dotted numeric address.
 * @return {boolean}    true if the given ip specifier is valid.
 */
function checkIp(ip) {
  let i;
  let isInvalidAddress = false;
  const methodName = 'checkIp';
  for (i = 0; i < 4; i += 1) {
    if (ip[i] > 255) {
      isInvalidAddress = true;
      break;
    }
  }
  logger.debug(methodName, 'IP "' + ip + '" ' + (isInvalidAddress ? 'is invalid.' : 'is valid.'));
  return isInvalidAddress;
}

/**
 * Does the given string contain characters not allowed within an e-mail address?
 *
 * @param {string} s    Required string that is part of an e-mail address.
 * @return {boolean}    true if the given string contains characters that are not allowed in an e-mail address.
 */
function containsInvalidCharacters(s) {
  let hasInvalidCharacters = false;
  let i;
  const methodName = 'containsInvalidCharacters';
  let size = s.length;
  for (i = 0; i < size; i += 1) {
    if (s.charCodeAt(i) > 127) {
      hasInvalidCharacters = true;
      break;
    }
  }
  logger.debug(
    methodName,
    'The string "' +
      s +
      '" ' +
      (hasInvalidCharacters ? 'has invalid characters' : 'doesn\'t contain invalid characters.'));
  return hasInvalidCharacters;
}

/**
 * Validates that a given e-mail address is valid according to the rules for specifying e-mail addresses.
 *
 * @param {string} address  Require e-mail address.
 * @return {boolean}        false if the string cannot be a valid e-mail address.
 */
function validate(address) {
  let isValid = false;
  const methodName = 'validate';
  if (address) {
    let matchArray = address.match(emailPattern);
    if (matchArray) {
      let user = matchArray[1];
      let domain = matchArray[2];
      if (user &&
        domain &&
        (!containsInvalidCharacters(user)) &&
        (!containsInvalidCharacters(domain) &&
        user.match(userPattern))) {
        let ip = domain.match(ipPattern);
        isValid = ip ? checkIp(ip) : checkDomains(domain);
      }
    }
  }
  logger.debug(methodName, 'The address "' + address + '" ' + (isValid ? 'is valid.' : 'is not valid.'));
  return isValid;
}

exports.validate = validate;
