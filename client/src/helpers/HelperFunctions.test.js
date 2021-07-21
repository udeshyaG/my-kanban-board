import { multiply, makeLowerCase } from './HelperFunctions';

test('Run the multiplication test', () => {
  expect(multiply(2, 6)).toBe(12);
  expect(multiply(2, -9)).toBe(-18);
});

test('Run the lower case test', () => {
  expect(makeLowerCase('HOMER is gooD')).toBe('homer is good');
  expect(makeLowerCase('sdFFdd895&juiPPP')).toBe('sdffdd895&juippp');
});
