/*globals exports, require*/

'use strict';

const crypto = require('crypto');
const email = require('email');
const emailPattern = /[a-zA-Z0-9_\.+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]{2,15}/;
var fs = require('fs');
const http = require('http');
const queryString = require('querystring');
const url = require('url');
const winston = require('winston');

/**
 * Configures a secure connection to an Email server that this application sends sign up request emails to.
 *
 * @param configuration  This application's configuration.
 */
function configureEmailServer(configuration) {
  configuration.emailServer = email.server.connect({
    user: configuration.signUpEmailSender,
    password: configuration.signUpEmailPassword,
    host: configuration.signUpEmailServer,
    ssl: true
  });
}

/**
 * Sends an email request to create a new account.
 *
 * @param configuration     Configuration information.
 * @param request           Request from a web client.
 * @param response          Response back to a web client.
 * @param {string} data     HTTP Post request's form data.
 */
function confirmSignUp(configuration, request, response, data) {
  var email = extractEmailAddress(data);
  var key = crypto.createHash('sha256').update(configuration.encryptionPassword).digest();
  if (email) {
    if (isValidEmailAddress(email)) {
      configuration.emailServer.send({
        from: configuration.signUpEmailSender,
        subject: 'Sign up request',
        text: encrypt(configuration, key, email),
        to: configuration.signUpEmailSender
      }, function (error, message) {
        var errorLog;
        if (error) {
          response.writeHead(500, {'Content-Type': 'text/plain'});
          response.write('Unable to send sign up confirmation email.');
          response.end();
          errorLog = {};
          errorLog.codes = [];
          errorLog.codes.push(error.code);
          errorLog.messages = [];
          errorLog.messages.push(error.message);
          if (error.previous) {
            errorLog.codes.push(error.previous.code);
            errorLog.messages.push(error.previous.message);
          }
          logError(configuration, errorLog);
        } else {
          signedUpSuccess(configuration, request, response, email);
        }
      });
    } else {
      handleInvalidEmailAddress(response);
    }
  } else {
    handleMissingEmailAddress(response);
  }
}

/**
 * Returns an encrypted version of the given plaintext encrypted using the given key.
 *
 * @param configuration     This server's configuration information.
 * @param key               Encryption key (text used to encrypt and later decrypt this function's result).
 * @param plainText         Text to encrypt.
 * @returns {string} Encrypted version of given plaintext.
 */
function encrypt(configuration, key, plainText) {
  var cipher = crypto.createCipheriv('aes-256-cbc', key, configuration.encryptionInitializationVector);
  var encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

/**
 * Returns a supplied email address within the given HTTP post data.
 *
 * @param {string} formData  An HTTP POST's data payload.
 * @returns {string} A user-supplied email address or null if the given POST data doesn't contain an email value.
 */
function extractEmailAddress(formData) {
  var data = queryString.parse(formData),
      email = null;
  if (data && data.hasOwnProperty('email')) {
      email = data.email;
  }
  return email;
}

/**
 * Displays a web page that asks a user to confirm the email address she submitted on the sign up page.
 *
 * @param configuration   This server's configuration information.
 * @param request         A web client's request.
 * @param response        Response to a web client.
 * @param {string} data   An HTTP Post request's form data.
 */
function handleSignUp(configuration, request, response, data) {
  var email = extractEmailAddress(data);
  if (email) {
    if (isValidEmailAddress(email)) {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(configuration.templates['confirm-sign-up']({ email: email }));
      response.end();
    } else {
      handleInvalidEmailAddress(response);
    }
  } else {
    handleMissingEmailAddress(response);
  }
}

/**
 * Notifies a web client that a supplied email address value is not a valid email address.
 *
 * @param response Web client response.
 */
function handleInvalidEmailAddress(response) {
  response.writeHead(400, {'Content-Type': 'text/plain'});
  response.write('Invalid email address');
  response.end();
}

/**
 * Notifies a web client that a required email field in a POST was missing.
 *
 * @param response Web client response.
 */
function handleMissingEmailAddress(response) {
  response.writeHead(400, {'Content-Type': 'text/plain'});
  response.write('Email address required');
  response.end();
}

/**
 * Is the given text a valid email address (does the text conform to the format for acceptable email addresses)?
 *
 * @param email         An email address.
 * @returns {boolean}   True if the given text is an email address.
 */
function isValidEmailAddress(email) {
  return emailPattern.test(email);
}

/**
 * Logs a debug message.
 *
 * @param configuration This server's configuration information.
 * @param message       An error message.
 */
function logDebug(configuration, message) {
  logger(configuration).debug(message);
}

/**
 * Logs an error message.
 *
 * @param configuration This server's configuration information.
 * @param message       An error message.
 */
function logError(configuration, message) {
  logger(configuration).error(message);
}

/**
 * Logs an information message.
 *
 * @param configuration This server's configuration information.
 * @param message       An error message.
 */
function logInfo(configuration, message) {
  logger(configuration).info(message);
}

/**
 * Returns a logger that writes this application's log messages.
 *
 * @param configuration This server's configuration information.
 * @returns A logger.
 */
function logger(configuration) {
  if (!configuration.logger) {
    winston.level = configuration.logLevel || 'warn';
    configuration.logger = winston;
  }
  return configuration.logger;
}

/**
 * Notifies a web client that the user has successfully signed up.
 *
 * @param configuration     This server's configuration information.
 * @param request           A web client's request.
 * @param response          Response to a web client.
 * @param {string} email    A user-supplied email address.
 */
function signedUpSuccess(configuration, request, response, email) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(configuration.templates['sign-up-thanks']({email: email}));
  response.end();
}

exports.configureEmailServer = configureEmailServer;
exports.confirmSignUp = confirmSignUp;
exports.handleSignUp = handleSignUp;
exports.isValidEmailAddress = isValidEmailAddress;
