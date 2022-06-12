const LOG_PREFIX = "[WEKIT]";

export class Log {
  static debug(...args: any[]) {
    console.debug(LOG_PREFIX, ...args);
  }
  static info(...args: any[]) {
    console.info(LOG_PREFIX, ...args);
  }
  static warn(...args: any[]) {
    console.warn(LOG_PREFIX, ...args);
  }
  static error(...args: any[]) {
    console.error(LOG_PREFIX, ...args);
  }
}
