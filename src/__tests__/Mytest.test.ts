import {fizzBuzz} from '../components/Mytest';

test('FizzBuzz test', () =>{
  expect(fizzBuzz(2)).toBe('1 2 ');
  expect(fizzBuzz(3)).toBe('1 2 Fizz ');
});
