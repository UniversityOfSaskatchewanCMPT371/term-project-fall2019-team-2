import osizeof from 'object-sizeof';
import $
  from 'jquery';

const kb = 1024;
const mb = 1048576;
const gb = 1073741824;


/**
 * Purpose: like the native JS toFixed, but without rounding
 * @param {number} num: number to convert
 * @param {number} precision: precision
 * @return {number}: the number with the specified number of decimal places
 */
export function numTrim(num: number, precision: number) {
  const mult = Math.pow(10, precision);
  return (Math.trunc(num * mult) / mult);
}

/**
 * Purpose: formats a number in human readable form with up to 3 decimal places
 * of precision
 *
 * @param {number} size: number to be interpreted as a size of bytes
 * @return {string}: human readable size string
 */
export function formatSize(size: number) {
  let sizeStr: string = '';

  if (size >= gb) {
    sizeStr = `${numTrim((size / gb), 3).toFixed(3)} GiB`;
  } else if (size >= mb) {
    sizeStr = `${numTrim((size / mb), 3).toFixed(3)} MiB`;
  } else if (size >= kb) {
    sizeStr = `${numTrim((size / kb), 3).toFixed(3)} KiB`;
  } else {
    sizeStr = `${size} Bytes`;
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
export function maxStrLen(strs: string[]): number {
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

  keys.push('total');
  keyLen = maxStrLen(keys) + 1;
  keys.pop();

  if (typeof obj === 'object') {
    for (const key in obj) {
      if (key !== null) {
        const size = osizeof(key) + osizeof(obj[key]);
        sizes.push(`[${formatSize(size)}]: `);
        vals.push(`${obj[key]}\n`);
      }
    }
    sizeLen = maxStrLen(sizes) + 1;

    for (let i = 0; i < keys.length; i++) {
      str += keys[i].padEnd(keyLen) + sizes[i].padStart(sizeLen) + vals[i];
    }

    str += 'total'.padEnd(keyLen) +
      ('[' + sizeof(obj) + ']').padEnd(keyLen) + '\n';
  }

  return str;
}

/**
 * Purpose: returns a fake file event with a local file as the data source.
 * This function is only used in development so that we don't have to manually
 * select a file to upload every time we save.
 */
export async function loadTestCsv(): Promise<any> {
  const fileName = '100_Sales_Records.csv';

  const filedata = await $.ajax({
    url: '/' + fileName,
  });

  return {
    target: {
      files: [new File([filedata], fileName,
          {type: '.csv,text/csv'})]
    }
  };
}
