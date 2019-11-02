import * as Utilities from '../components/Utilities';
import {numTrim,
  formatSize,
  sizeof,
  maxStrLen,
  sizeofObj} from '../components/Utilities';

describe('Utilites Unit Tests', ()=>{
  let formatSizeSpy: any;
  let sizeofSpy: any;
  let maxStrLenSpy: any;
  let sizeofObjSpy: any;

  beforeEach(() => {
    formatSizeSpy = jest.spyOn(Utilities, 'formatSize');
    sizeofSpy = jest.spyOn(Utilities, 'sizeof');
    maxStrLenSpy = jest.spyOn(Utilities, 'maxStrLen');
    sizeofObjSpy = jest.spyOn(Utilities, 'sizeofObj');
  });

  describe('numTrim', () => {
    it('Check that numTrim works as expected', () => {
      const tests: number[][] = [
        [1000.0009, 3, 1000],
        [1000.9999, 2, 1000.99],
        [0.009954, 3, 0.009],
        [1.24, 1, 1.2]
      ];

      // eslint-disable-next-line guard-for-in
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(test);
        expect(numTrim(test[0], test[1])).toBe(test[2]);
      }
    });
  });

  describe('formatSize', () => {
    it('Check to make sure formatSize works as expected', () => {
      expect(formatSize(1073741823)).toBe('1023.999 MiB');
      expect(formatSize(1073741824)).toBe('1.000 GiB');
      expect(formatSize(1073741825)).toBe('1.000 GiB');

      expect(formatSize(1048575)).toBe('1023.999 KiB');
      expect(formatSize(1048576)).toBe('1.000 MiB');
      expect(formatSize(1048577)).toBe('1.000 MiB');

      expect(formatSize(1023)).toBe('1023 Bytes');
      expect(formatSize(1024)).toBe('1.000 KiB');
      expect(formatSize(1025)).toBe('1.000 KiB');
    });
  });

  describe('sizeof', () => {
    it('Checking if sizeof returns the correct data', () => {
      expect(sizeof(123)).toBe('8 Bytes');
      expect(sizeof('a')).toBe('2 Bytes');
      expect(sizeof({name: 'test', num: 123}))
          .toBe('30 Bytes');
      expect(sizeof([1, 2, 3])).toBe('24 Bytes');
      expect(sizeof([])).toBe('0 Bytes');
      expect(sizeof({})).toBe('0 Bytes');
    });
  });

  describe('maxStrLen', () => {
    it('Makes sure that maxStrLen works as expected', () => {
      const tests = [
        [['123', 'aaaaa', '1'], 5],
        [['a', 'a', 'a'], 1],
        [['aa', 'testing'], 7],
        [['test'], 4],
        [[''], 0],
        [[], 0]
      ];

      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        // @ts-ignore
        expect(maxStrLen(test[0])).toBe(test[1]);
      }
    });
  });

  describe('sizeofObj', () => {
    it('', () => {
      expect(sizeofObj({name: 'test', num: 123})).toBe(
          'name   [16 Bytes]: test\n' +
          'num    [14 Bytes]: 123\n' +
          'total [30 Bytes]\n');

      expect(sizeofObj(123)).toBe('');
      expect(sizeofObj('a')).toBe('');
      expect(sizeofObj({name: 'test', num: 123}))
          .toBe('name   [16 Bytes]: test\n' +
              'num    [14 Bytes]: 123\n' +
              'total [30 Bytes]\n');
      expect(sizeofObj([1, 2, 3])).toBe(
          '0      [10 Bytes]: 1\n' +
          '1      [10 Bytes]: 2\n' +
          '2      [10 Bytes]: 3\n' +
          'total [24 Bytes]\n');
      expect(sizeofObj([])).toBe('total [0 Bytes]\n');
      expect(sizeofObj({})).toBe('total [0 Bytes]\n');
    });
  });
});
