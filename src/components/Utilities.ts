import osizeof from 'object-sizeof';
const kb = 1024;
const mb = 1048576;
const gb = 1073741824;

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

export function sizeof(obj: any): string {
  const size: number = osizeof(obj);

  return formatSize(size);
}

function maxStrLen(strs: string[]) {
  let len: number = 0;

  for (let i = 0; i < strs.length; i++) {
    if (strs[i].length > len) {
      len = strs[i].length;
    }
  }

  return len;
}

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
      // console.log(key);
      const size = osizeof(key) + osizeof(obj[key]);
      // let size = osizeof(obj[key]);
      totalSize += size;
      sizes.push('[' + formatSize(size) + ']: ');
      vals.push(obj[key] + '\n');
    }
    sizeLen = maxStrLen(sizes) + 1;

    for (let i = 0; i < keys.length; i++) {
      str += keys[i].padEnd(keyLen) + sizes[i].padStart(sizeLen) + vals[i];
    }

    str += 'total'.padEnd(keyLen) + ('[' + sizeof(obj) + '] ').padEnd(keyLen) + '\n';
  }

  return str;
}
