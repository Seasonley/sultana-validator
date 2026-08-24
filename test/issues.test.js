import { describe, it } from 'vitest'
import assert from 'node:assert'

import {
  Not, Range, Equals, Blank, Truthy, Required,
  Length, Each, validate,
} from '../src/index'

/**
 * 本文件是对候选人问题点的"验证性"测试：
 * - 每个用例断言的是 *合理/期望* 行为（并非当前实现）。
 * - 用例运行 **失败** = 该候选问题成立；运行 **通过** = 该候选不成立（假设证伪）。
 *
 * 请勿在未决定修复前强行将其变绿——这是排查证据，交由决策后再处理。
 */
describe('Candidate issues (verification — failures indicate confirmed problems)', () => {
  describe('1) Required uses `in`: prototype-inherited keys count as present', () => {
    it('an empty/plain object must NOT satisfy [Required] for inherited keys like toString/constructor', () => {
      const validation = {
        toString: [Required],
        constructor: [Required],
        own: [Required],
      }
      const [valid, errors] = validate(validation, { own: 1 })
      assert.strictEqual(valid, false)
      assert.deepEqual(errors, {
        toString: ['must be present'],
        constructor: ['must be present'],
      })
    })
  })

  describe('2) Blank uses `!value`: any falsy value passes Blank, docs say empty string only', () => {
    it('Blank must reject non-empty falsy values (0, false, null, undefined, NaN)', () => {
      for (const bad of [0, false, null, undefined, NaN]) {
        const [valid] = validate({ a: [Blank] }, { a: bad })
        assert.strictEqual(
          valid,
          false,
          `Blank should reject ${String(bad)} (docs: shortcut for Equals(""))`,
        )
      }
    })
    it('Blank must still accept the empty string', () => {
      assert.strictEqual(validate({ a: [Blank] }, { a: '' })[0], true)
    })
  })

  describe('3) _validateListHelper reads v.prototype — arrow functions crash validate()', () => {
    it('validate() must not throw when a validator is an arrow function', () => {
      const even = (n) => n % 2 === 0
      let threw = null
      let result
      try {
        result = validate({ a: [even] }, { a: 4 })
      } catch (e) {
        threw = e
      }
      assert.strictEqual(threw, null, `validate() threw: ${threw && threw.message}`)
      assert.ok(result && result[0])
    })
  })

  describe('4) Exceptions thrown by validators are swallowed into stale global errMsg', () => {
    // Seed the module-global errMsg with an unrelated, known message, then trigger
    // a validator that throws internally. The leaked message proves the error the
    // caller sees is inherited from unrelated state — not the field it validated.
    it('Each() over a non-collection leaks an unrelated stale error message', () => {
      validate({ seed: [Equals(42)] }, { seed: 0 }) // sets errMsg = 'must be equal to 42'
      const [valid, errors] = validate({ a: [Each([Range(0, 5)])] }, { a: 3 })
      assert.strictEqual(valid, false)
      // It must NOT reuse the unrelated seed message from the previous validation.
      assert.notStrictEqual(errors.a[0], 'must be equal to 42')
    })
    it('a bare (non-array) nested object rule validates nothing and leaks a stale message', () => {
      validate({ seed: [Equals(42)] }, { seed: 0 })
      const [valid, errors] = validate({ bar: { baz: [Equals(2)] } }, { bar: { baz: 2 } })
      assert.strictEqual(valid, true) // expected: nested rules should validate
      assert.deepEqual(errors, {}) // currently: fails with a leaked unrelated message
    })
  })

  describe('5) Equals does reference comparison (deep-equal objects never match; NaN never equal)', () => {
    // User decision: NOT fixing C1 — reference equality is the intended behavior.
    it.skip('SKIPPED by decision — deep-equal objects', () => {
      const [valid] = validate({ a: [Equals({ k: 1 })] }, { a: { k: 1 } })
      assert.strictEqual(valid, true)
    })
    it.skip('SKIPPED by decision — NaN', () => {
      const [valid] = validate({ a: [Equals(NaN)] }, { a: NaN })
      assert.strictEqual(valid, true)
    })
  })

  describe('6) Not(Not(x)) boolean is right, but the failure message reverts to the inner wording', () => {
    it('double negation should behave like the original validator (message parity)', () => {
      const [valid, errors] = validate({ a: [Not(Not(Truthy))] }, { a: false })
      assert.strictEqual(valid, false)
      assert.deepEqual(errors, { a: ['must be True-equivalent value'] })
    })
  })

  describe('7) Range / GreaterThan / LessThan use one message for inclusive and exclusive bounds', () => {
    it('exclusive Range failing at the boundary should hint at exclusivity', () => {
      const [, errors] = validate({ a: [Range(1, 10, false)] }, { a: 1 })
      assert.deepEqual(errors.a, ['must fall strictly between 1 and 10'])
    })
  })
})

describe('Sanity — Length/validate still behave (non-issue guard)', () => {
  it('plain validate still works', () => {
    assert.deepEqual(validate({ a: [Required, Equals(1)] }, { a: 1 }), [true, {}])
  })
  it('Length guards', () => {
    assert.throws(() => Length(0, 0), /non-zero minimum or maximum/)
    assert.throws(() => Length(-1), /negative/)
  })
})