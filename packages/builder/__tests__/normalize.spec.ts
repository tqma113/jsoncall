import { check } from 'jc-schema'
import {
  normalize,
  createDeriveType,
  NumberType,
  type,
  ValidateError,
  StringType,
  Union,
} from '../src'
import createBuilderSchema from './fixtures/foo'

describe('normalize', () => {
  it('foo', () => {
    const int = createDeriveType(NumberType)(
      'int' as const,
      type(NumberType),
      (input) => {
        if (Number.isInteger(input)) {
          return true
        } else {
          return new ValidateError('int', JSON.stringify(input))
        }
      },
      (input) => {
        return input
      },
      (input) => {
        return input
      },
      'int'
    )
    const DateType = createDeriveType(Union(StringType, NumberType))(
      'Date' as const,
      type(Union(StringType, NumberType)),
      (input) => {
        const date = new Date(input)
        if (isNaN(date.getTime())) {
          return true
        } else {
          return new ValidateError('Date', JSON.stringify(input))
        }
      },
      (input) => {
        return new Date(input)
      },
      (input) => {
        return input.getTime()
      },
      'Date'
    )
    const builderSchema = createBuilderSchema({ int, Date: DateType })
    const schema = normalize(builderSchema)

    expect(schema.entry).toMatch('baz')
    expect(schema.modules.length).toBe(3)

    const module1 = schema.modules[0]
    expect(module1.id).toMatch('foo')
    expect(module1.linkDefinations.length).toBe(0)
    expect(module1.typeDefinations.length).toBe(16)
    expect(module1.callDefinations.length).toBe(0)
    expect(module1.deriveDefinations.length).toBe(2)
    expect(module1.exportDefination?.names.length).toBe(18)

    const module2 = schema.modules[1]
    expect(module2.id).toMatch('bar')
    expect(module2.linkDefinations.length).toBe(1)
    expect(module2.typeDefinations.length).toBe(2)
    expect(module2.callDefinations.length).toBe(0)
    expect(module2.deriveDefinations.length).toBe(0)
    expect(module2.exportDefination?.names.length).toBe(2)

    const module0 = schema.modules[2]
    expect(module0.id).toMatch('baz')
    expect(module0.linkDefinations.length).toBe(2)
    expect(module0.typeDefinations.length).toBe(3)
    expect(module0.callDefinations.length).toBe(3)
    expect(module0.deriveDefinations.length).toBe(0)
    expect(module0.exportDefination?.names.length).toBe(6)

    expect(check(schema)).toBe(null)
  })
})
