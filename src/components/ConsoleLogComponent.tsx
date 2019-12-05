import config from './.config'; // Relative path to your File

/**
 /
 * used to read console log configuration from a file to control
 * what is need to be printed on console log
 */
export default class ConsoleLogComponent {
  /**
   * actual logging function
   * @param {string} functionName: function's name;
   * @param {any} message: actual error message, could be string or boolean
   *  @param {string} option: options at the place where you use it,
   *    either INFO, WARN or ERROR
   */
  consoleLogger(functionName:string, message: any, option:string): void {
    if (config.includes('INFO') && option.includes('INFO')) {
      console.info(functionName+'(): '+message);
    } else if (config.includes('WARN') && option.includes('WARN')) {
      console.warn(functionName+'(): '+message);
    } else if (config.includes('ERROR') && option.includes('ERROR')) {
      console.error(functionName+'(): '+message);
    }
  }
}
