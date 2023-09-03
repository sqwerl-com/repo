"use strict";function configureEmailServer(e){e.emailServer=email.server.connect({user:e.signUpEmailSender,password:e.signUpEmailPassword,host:e.signUpEmailServer,ssl:!0})}function confirmSignUp(e,r,i,n){var s=extractEmailAddress(n),t=crypto.createHash("sha256").update(e.encryptionPassword).digest();s?isValidEmailAddress(s)?e.emailServer.send({from:e.signUpEmailSender,subject:"Sign up request",text:encrypt(e,t,s),to:e.signUpEmailSender},function(n,t){var a;n?(i.writeHead(500,{"Content-Type":"text/plain"}),i.write("Unable to send sign up confirmation email."),i.end(),a={},a.codes=[],a.codes.push(n.code),a.messages=[],a.messages.push(n.message),n.previous&&(a.codes.push(n.previous.code),a.messages.push(n.previous.message)),logError(e,a)):signedUpSuccess(e,r,i,s)}):handleInvalidEmailAddress(i):handleMissingEmailAddress(i)}function encrypt(e,r,i){var n=crypto.createCipheriv("aes-256-cbc",r,e.encryptionInitializationVector),s=n.update(i,"utf8","base64");return s+=n["final"]("base64")}function extractEmailAddress(e){var r=queryString.parse(e),i=null;return r&&r.hasOwnProperty("email")&&(i=r.email),i}function handleSignUp(e,r,i,n){var s=extractEmailAddress(n);s?isValidEmailAddress(s)?(i.writeHead(200,{"Content-Type":"text/html"}),i.write(e.templates["confirm-sign-up"]({email:s})),i.end()):handleInvalidEmailAddress(i):handleMissingEmailAddress(i)}function handleInvalidEmailAddress(e){e.writeHead(400,{"Content-Type":"text/plain"}),e.write("Invalid email address"),e.end()}function handleMissingEmailAddress(e){e.writeHead(400,{"Content-Type":"text/plain"}),e.write("Email address required"),e.end()}function isValidEmailAddress(e){return emailPattern.test(e)}function logDebug(e,r){logger(e).debug(r)}function logError(e,r){logger(e).error(r)}function logInfo(e,r){logger(e).info(r)}function logger(e){return e.logger||(winston.level=e.logLevel||"warn",e.logger=winston),e.logger}function signedUpSuccess(e,r,i,n){i.writeHead(200,{"Content-Type":"text/html"}),i.write(e.templates["sign-up-thanks"]({email:n})),i.end()}const crypto=require("crypto"),email=require("email"),emailPattern=/[a-zA-Z0-9_\.+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]{2,15}/;var fs=require("fs");const http=require("http"),queryString=require("querystring"),url=require("url"),winston=require("winston");exports.configureEmailServer=configureEmailServer,exports.confirmSignUp=confirmSignUp,exports.handleSignUp=handleSignUp,exports.isValidEmailAddress=isValidEmailAddress;