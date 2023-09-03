/**
 * Encrypts a file.
 */
const cryptography = require('crypto');
const fs = require('fs');
const logger = require('sqwerl-logger').newInstance('Encrypt');
const readLine = require('readline');

if (process.argv.length > 2) {
  let plaintextFileName = process.argv[2],
    input = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
    }),
    encryptedFileName = plaintextFileName + '.encrypted';
  input.question('Enter password for encrypting or decrypting file: ', function (password) {
    input.close();
    encrypt(plaintextFileName, encryptedFileName, password, function () {
      console.log('Finished encrypting file "' + plaintextFileName + '" as "' + encryptedFileName + '".');
    });
  });
} else {
  logger.error('Encrypt', 'Usage: node encrypt_file <input_file>');
  logger.error('Encrypt', '       Where <input_file> is the file to encrypt.');
}

function encrypt(plaintextFileName, encryptedFileName, password, callback) {
  const inputStream = fs.createReadStream(plaintextFileName);
  const outputStream = fs.createWriteStream(encryptedFileName);
  let cipher = cryptography.createCipher('aes-128-cbc', password);
  inputStream.on('data', function (data) {
    outputStream.write(new Buffer(cipher.update(data), 'binary'));
  });
  inputStream.on('end', function () {
    outputStream.write(new Buffer(cipher.final('binary'), 'binary'));
    outputStream.end();
    outputStream.on('close', function () {
      callback();
    });
  });
}
