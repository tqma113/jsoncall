import { NumberType, StringType, createJSONCallType } from 'jc-builder'
import { createJSONCall } from '../src/index'

describe('call', () => {
  it('simple', () => {
    const call = createJSONCall(
      createJSONCallType('call', NumberType, StringType),
      (input) => {
        return '' + input
      },
      JSON.stringify,
      JSON.parse
    )

    expect(call('"foo"').value).toMatchObject({
      expected: 'number',
      accept: '"foo"',
    })
    expect(call('0').value).toBe('"0"')
    expect(call('true').value).toMatchObject({
      expected: 'number',
      accept: 'true',
    })
    expect(call('null').value).toMatchObject({
      expected: 'number',
      accept: 'null',
    })
    expect(call('{}').value).toMatchObject({
      expected: 'number',
      accept: '{}',
    })
    expect(call('[]').value).toMatchObject({
      expected: 'number',
      accept: '[]',
    })
  })
})
