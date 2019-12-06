/**
 * This file is used for config file for consoleLogger, it is
 * getting called in ConsoleLogComponent. config variable stores
 * the config of the file.
 * @param {string} config:  store the config option when debugging:
 *  INFO: print console.info() on the browser console windows
 *  WARN: print console.warn() on the browser console windows
 *  ERROR: print console.error() on the brower console windows
 * the order of the config string does not matter
 */
const config: string= "INFO, WARN, ERROR";

export default config;