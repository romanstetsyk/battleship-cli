import { describe, it } from 'node:test';
import { getRowLetter } from '../src/helpers.js';
import assert from 'node:assert';

describe('getRowLetter', () => {
  const A = 65;
  for (let i = 0; i <= 25; i += 1) {
    it(`should return ${String.fromCharCode(A + i)} for input ${i}`, () => {
      assert.strictEqual(getRowLetter(i), String.fromCharCode(A + i));
    });
  }
});
