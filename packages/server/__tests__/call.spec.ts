import { NumberType, StringType, createJSONCallType } from 'jc-builder'
import { createJSONCall } from '../src/index'

describe('call', () => {
  it('simple', () => {
    const call = createJSONCall(
      createJSONCallType('call', NumberType, StringType),
      (input) => {
        return '' + input
      }
    )(JSON.stringify, JSON.parse)

    expect(call('"foo"')).toMatchObject({
      expected: 'number',
      accept: '"foo"',
    })
    expect(call('0')).toBe('"0"')
    expect(call('true')).toMatchObject({
      expected: 'number',
      accept: 'true',
    })
    expect(call('null')).toMatchObject({
      expected: 'number',
      accept: 'null',
    })
    expect(call('{}')).toMatchObject({
      expected: 'number',
      accept: '{}',
    })
    expect(call('[]')).toMatchObject({
      expected: 'number',
      accept: '[]',
    })
  })
})
