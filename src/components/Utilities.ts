import osizeof from 'object-sizeof';
import * as d3
  from 'd3';
import * as TimSort
  from 'timsort';
const kb = 1024;
const mb = 1048576;
const gb = 1073741824;

/**
 * Purpose: shorthand for console.log/warn/error - I'm lazy
 */

// export let log: (message?: any, ...optionalParams: any[]) => void;
// // eslint-disable-next-line prefer-const
// log = console.log;
//
// export let warn: (message?: any, ...optionalParams: any[]) => void;
// // eslint-disable-next-line prefer-const
// warn = console.warn;
//
// export let error: (message?: any, ...optionalParams: any[]) => void;
// // eslint-disable-next-line prefer-const
// error = console.error;

/**
 * Purpose: formats a number in human readable form with up to 3 decimal places
 * of precision
 *
 * @param {number} size: number to be interpreted as a size of bytes
 * @return {string}: human readable size string
 */
function formatSize(size: number) {
  let sizeStr: string = '';

  if (size >= gb) {
    sizeStr = (size / gb).toFixed(3) + ' GiB';
  } else if (size >= mb) {
    sizeStr = (size / mb).toFixed(3) + ' MiB';
  } else if (size >= kb) {
    sizeStr = (size / kb).toFixed(3) + ' KiB';
  } else {
    sizeStr = size + ' Bytes';
  }

  return sizeStr;
}

/**
 * Purpose: returns the size of the given object in a human readable format
 *
 * @param {any} obj: the object to get the size of
 * @return {string} returns: the human readable size string
 */
export function sizeof(obj: any): string {
  const size: number = osizeof(obj);

  return formatSize(size);
}

/**
 * Purpose: returns the longest string in an array of strings.
 *
 * @param {string[]} strs: an array of strings
 * @return {number}: the length of the longest string in the array
 */
function maxStrLen(strs: string[]): number {
  let len: number = 0;

  for (let i = 0; i < strs.length; i++) {
    if (strs[i].length > len) {
      len = strs[i].length;
    }
  }

  return len;
}

/**
 * Purpose: returns a string with the size of each individual key-value pair on
 * an object.
 *
 * @param {any} obj: the object to get the sizes for
 * @return {string}: a string with the size of each individual key-value pair
 * on an object.
 */
export function sizeofObj(obj: any): string {
  const keys: string[] = Object.keys(obj);
  let str = '';
  let keyLen:number = 0;
  let sizeLen:number = 0;
  const sizes: string[] = [];
  const vals: string[] = [];
  let totalSize:number = 0;

  console.log(Object.keys(obj));

  keyLen = maxStrLen(keys) + 1;

  if (typeof obj === 'object') {
    for (const key in obj) {
      if (key !== null) {
        const size = osizeof(key) + osizeof(obj[key]);
        totalSize += size;
        sizes.push('[' + formatSize(size) + ']: ');
        vals.push(obj[key] + '\n');
      }
    }
    sizeLen = maxStrLen(sizes) + 1;

    for (let i = 0; i < keys.length; i++) {
      str += keys[i].padEnd(keyLen) + sizes[i].padStart(sizeLen) + vals[i];
    }

    str += 'total'.padEnd(keyLen) +
      ('[' + sizeof(obj) + '] ').padEnd(keyLen) + '\n';
  }

  return str;
}
