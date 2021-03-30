import { createJSONType } from './base'
import type { Validator, Converter, JSONType } from './base'

const identify = <I>(input: I) => input

export const StringType = createJSONType(
  'StringType' as const,
  (input) => {
    return typeof input === 'string' ? true : `expected string, accepted input: ${input}`
  },
  identify as Converter<string, string>,
  identify
)
export const NumberType = createJSONType(
  'NumberType' as const,
  (input) => {
    return typeof input === 'number' ? true : `expected number, accepted input: ${input}`
  },
  identify as Converter<number, number>,
  identify
)
export const BooleanType = createJSONType(
  'BooleanType' as const,
  (input) => {
    return typeof input === 'boolean' ? true : `expected boolean, accepted input: ${input}`
  },
  identify as Converter<boolean, boolean>,
  identify
)
export const NullType = createJSONType(
  'NullType' as const,
  (input) => {
    return input === null ? true : `expected null, accepted input: ${input}`
  },
  identify as Converter<null, null>,
  identify
)

export const createListType = <I, T, K extends string, CK extends string>(kind: CK, type: JSONType<I, T, K>) => {
  const validate: Validator<I[]> = (input) => {
    if (Array.isArray(input)) {
      let result: true | string = true
      for (let value of input) {
        result = type.validate(value)
        if (typeof result === 'string') {
          return `expected null, accepted input: ${input} in list`
        }
      }
      return true
    } else {
      return `expected null, accepted input: ${input}`
    }
  }

  const convert: Converter<I[], T[]> = (input) => {
    return input.map(type.convert)
  }

  const reverseConverter: Converter<T[], I[]> = (input) => {
    return input.map(type.reverseConverter)
  }

  return createJSONType(
    `${kind}: ListType<${type.kind}>` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const createObjectType = <Obj extends Record<string, JSONType<any, any, string>>>(objectType: Obj) => {

}
