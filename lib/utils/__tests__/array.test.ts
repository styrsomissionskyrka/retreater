import * as array from '../array';

describe('array.arrayify', () => {
  it('always returns an array', () => {
    expect(array.arrayify([])).toEqual([]);
    expect(array.arrayify('a')).toEqual(['a']);
    expect(array.arrayify(['a'])).toEqual(['a']);
  });
});
