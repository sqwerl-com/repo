"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFromObject = exports.loadFromFile = void 0;
var bun_1 = require("bun");
var index_ts_1 = require("../../logger/src/index.ts");
var _logger = (0, index_ts_1.default)('configuration', 'info');
/**
 * Initializes an object's properties with an application's configuration values.
 * @param configuration Object whose properties contain values for an application's configuration.
 * @param properties Definitions for object properties that hold an application's configuration.
 */
var ApplicationConfiguration = function (configuration, properties) {
    var targetConfiguration = {};
    if (properties !== undefined) {
        _initialize(configuration, targetConfiguration, properties);
    }
    return targetConfiguration;
};
/**
 * Throws an exception if the given file name is empty.
 * @param filename The name of a JSON file that contains an application's configuration.
 */
var checkFilename = function (filename) {
    if (filename.length === 0) {
        throw new Error("Missing configuration file name. The name of a valid JSON file is required.");
    }
};
/**
 * Initializes an application's configuration.
 * @param sourceConfiguration An object whose properties are an application's configuration.
 * @param targetConfiguration An application's configuration information.
 * @param properties Define the properties of the source configuration that define an application' configuration.
 */
var _initialize = function (sourceConfiguration, targetConfiguration, properties) {
    _logger.info(_initialize, 'Initializing application configuration');
    if (properties !== undefined) {
        properties.forEach(function (property) {
            targetConfiguration[property.name] =
                (property.isRequired === true)
                    ? _initializeRequiredConfigurationValue(sourceConfiguration, property.name, property.missingError)
                    : (sourceConfiguration[property.name] || property.defaultValue);
        });
    }
};
/**
 * Initializes a required application configuration value. Throws an error if the given configuration doesn't
 * assign the property with the given name a value.
 * @param configuration JavaScript object whose properties contains values for configuring an application.
 * @param propertyName The name of a required application configuration property.
 * @param missingError Error message to output if property with the given name has not been assigned a value in the
 * given configuration.
 * @return The value of the given configuration object's property with the given name.
 */
var _initializeRequiredConfigurationValue = function (configuration, propertyName, missingError) {
    var value = configuration[propertyName];
    if ((value !== undefined) && (value.length === 0)) {
        throw new Error(missingError === undefined ? "Application configuration value \"".concat(propertyName, "\" is required") : missingError);
    }
    return value;
};
/**
 * Loads an application's configuration from a JSON file.
 * @param filename The name of a JSON file.
 * @param properties Definitions for object properties that hold an application's configuration.
 * @return An object that contains an application's configuration.
 */
var loadFromFile = function (filename, properties) { return __awaiter(void 0, void 0, void 0, function () {
    var configurationFile;
    return __generator(this, function (_a) {
        checkFilename(filename);
        _logger.info(exports.loadFromFile, "Reading configuration file \"".concat(filename, "\" from current working directory \"").concat(process.cwd, "\"..."));
        configurationFile = bun_1.Bun.file(filename);
        return [2 /*return*/, new Promise(function () {
                var text = configurationFile.text().then(function () { return ApplicationConfiguration(text, properties); });
            })];
    });
}); };
exports.loadFromFile = loadFromFile;
/**
 * Loads an application's configuration information from a given object.
 * @param object An object that provides an application's configuration information.
 * @param properties Definitions for object properties that hold an application's configuration.
 * @return An object that contains an application's configuration.
 */
var loadFromObject = function (object, properties) {
    return ApplicationConfiguration(object, properties);
};
exports.loadFromObject = loadFromObject;
//# sourceMappingURL=index.js.map