import { describe, it } from 'node:test';
import { parsePosInt } from '../src/helpers.js';
import assert from 'node:assert';

describe('parsePosInt', () => {
  it("should throw if value is '0'", () => {
    assert.throws(() => parsePosInt('0'));
  });

  it('should throw if value is negative', () => {
    assert.throws(() => parsePosInt('-5'));
  });

  it('should throw if value is not integer', () => {
    assert.throws(() => parsePosInt('2.3'));
  });

  it('should parse positive integers', () => {
    assert.strictEqual(parsePosInt('1'), 1);
    assert.strictEqual(parsePosInt('2'), 2);
    assert.strictEqual(parsePosInt('5'), 5);
    assert.strictEqual(parsePosInt('123'), 123);
  });
});
