import { beforeEach, describe, it } from 'node:test';
import { parseShipSizes } from '../src/helpers.js';
import assert from 'node:assert';

describe('parseShipSizes', () => {
  let cl: ReturnType<typeof parseShipSizes>;
  beforeEach(() => {
    cl = parseShipSizes();
  });

  it('should ignore second arg on first call', () => {
    const res = cl('2', [1, 2, 3]);
    assert.deepStrictEqual(res, [2]);
  });

  it('should not ignore second arg on second call', () => {
    cl('2', [1, 2, 3]);
    const res = cl('4', [2]);
    assert.deepStrictEqual(res, [2, 4]);
  });

  it('should throw if value is not valid', () => {
    assert.throws(() => cl('0', []));
    assert.throws(() => cl('-6', []));
    assert.throws(() => cl('8.8', []));
  });
});
