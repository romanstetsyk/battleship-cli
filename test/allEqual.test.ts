import { describe, it } from 'node:test';
import { allEqual } from '../src/helpers.js';
import assert from 'node:assert';

describe('allEqual', () => {
  it('should throw if array is empty', () => {
    assert.throws(() => allEqual([]), new Error("Array can't be empty"));
  });

  it('should return true for array length 1', () => {
    assert.ok(allEqual(['1']));
    assert.ok(allEqual(['test']));
  });

  it('should work for array length > 1', () => {
    assert.ok(allEqual(Array(2).fill('A')));
    assert.ok(allEqual(Array(4).fill('test')));
    assert.ok(allEqual(Array(8).fill('')));
    assert.ok(allEqual(Array(8).fill('4')));
    assert.strictEqual(allEqual(Array(2).fill('A').concat('a')), false);
    assert.strictEqual(allEqual(['1', '2']), false);
  });
});
