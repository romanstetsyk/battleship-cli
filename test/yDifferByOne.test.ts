import { describe, it } from 'node:test';
import { yDifferByOne } from '../src/helpers.js';
import assert from 'node:assert';

describe('yDifferByOne', () => {
  it('should throw if array is empty', () => {
    assert.throws(() => yDifferByOne([]), new Error("Array can't be empty"));
  });

  it('should throw if array contains not numbers', () => {
    assert.throws(
      () => yDifferByOne(['a']),
      new Error(
        'Elements should be of type `${number}`, where n is an integer',
      ),
    );
    assert.throws(
      () => yDifferByOne(['A', 'B']),
      new Error(
        'Elements should be of type `${number}`, where n is an integer',
      ),
    );
    assert.throws(
      () => yDifferByOne(['1', '2', 'E']),
      new Error(
        'Elements should be of type `${number}`, where n is an integer',
      ),
    );
  });

  it('should return true for array length 1', () => {
    assert.ok(yDifferByOne(['6']));
    assert.ok(yDifferByOne(['123']));
  });

  it('should work for array length > 1', () => {
    assert.ok(yDifferByOne(['4', '5']));
    assert.ok(yDifferByOne(['8', '9', '10']));
    assert.ok(yDifferByOne(['2', '3', '4', '5', '6', '7', '8', '9', '10']));
    assert.strictEqual(yDifferByOne(['2', '3', '4', '5', '7']), false);
  });

  it('should throw if elements are not in accending order', () => {
    assert.strictEqual(yDifferByOne(['5', '4', '3']), false);
  });
});
