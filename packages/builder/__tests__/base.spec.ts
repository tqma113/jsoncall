import {
  createJSONType,
  validate,
  convert,
  reverseConverter,
} from '../src/index'
import { ValidateError } from '../src/error'

describe('builder>base', () => {
  it('simple', () => {
    const NumberString = createJSONType(
      'NumberString',
      (input) => {
        if (typeof input === 'string') {
          const result = Number(input)
          if (!isNaN(result)) {
            return true
          } else {
            return new ValidateError('NumberString', JSON.stringify(input))
          }
        } else {
          return new ValidateError('string', JSON.stringify(input))
        }
      },
      (input: string): number => {
        return Number(input)
      },
      (input: number): string => {
        return '' + input
      }
    )

    expect(validate(NumberString, '123')).toBeTruthy()

    expect(validate(NumberString, 'foo')).toMatchObject({
      expected: 'NumberString',
      accept: '"foo"',
    })

    expect(validate(NumberString, null as any)).toBeTruthy()
    expect(validate(NumberString, {} as any)).toBeTruthy()
    expect(validate(NumberString, [] as any)).toBeTruthy()
    expect(validate(NumberString, 0 as any)).toMatchObject({
      expected: 'string',
      accept: '0',
    })
    expect(validate(NumberString, true as any)).toMatchObject({
      expected: 'string',
      accept: 'true',
    })
    expect(validate(NumberString, undefined as any)).toMatchObject({
      expected: 'string',
      accept: undefined,
    })

    expect(convert(NumberString, '123')).toBe(123)
    expect(reverseConverter(NumberString, 123)).toBe('123')
    expect(reverseConverter(NumberString, convert(NumberString, '123'))).toBe(
      '123'
    )
  })
})
