import { createJSONType } from './base'
import type { Validator, Converter, JSONType } from './base'

const identify = <I>(input: I) => input

export const StringType = createJSONType(
  'StringType' as const,
  (input) => {
    return typeof input === 'string'
      ? true
      : `expected string, accepted: ${input}`
  },
  identify as Converter<string, string>,
  identify
)
export const NumberType = createJSONType(
  'NumberType' as const,
  (input) => {
    return typeof input === 'number'
      ? true
      : `expected number, accepted: ${input}`
  },
  identify as Converter<number, number>,
  identify
)
export const BooleanType = createJSONType(
  'BooleanType' as const,
  (input) => {
    return typeof input === 'boolean'
      ? true
      : `expected boolean, accepted: ${input}`
  },
  identify as Converter<boolean, boolean>,
  identify
)
export const NullType = createJSONType(
  'NullType' as const,
  (input) => {
    return input === null ? true : `expected null, accepted: ${input}`
  },
  identify as Converter<null, null>,
  identify
)
export const AnyType = createJSONType(
  'AnyType' as const,
  (_input) => {
    return true
  },
  identify as Converter<any, any>,
  identify
)
export const NoneType = createJSONType(
  'NoneType' as const,
  (input) => {
    return input === undefined ? true : `expected undefined, accepted: ${input}`
  },
  identify as Converter<undefined, undefined>,
  identify
)

export const createListType = <I, T, K extends string, CK extends string>(
  kind: CK,
  type: JSONType<I, T, K>
) => {
  const validate: Validator = (input) => {
    if (Array.isArray(input)) {
      let result: true | string = true
      for (let value of input) {
        result = type.validate(value)
        if (typeof result === 'string') {
          return `${result} in list`
        }
      }
      return true
    } else {
      return `expected list, accepted: ${input}`
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

export type InputType<
  J extends JSONType<any, any, string>
> = J extends JSONType<infer I, any, string> ? I : never
export type ToType<J extends JSONType<any, any, string>> = J extends JSONType<
  any,
  infer T,
  string
>
  ? T
  : never
export type KindType<J extends JSONType<any, any, string>> = J extends JSONType<
  any,
  any,
  infer K
>
  ? K
  : never

export type InputObjectType<
  Obj extends Record<string, JSONType<any, any, string>>
> = {
  [key in keyof Obj]: InputType<Obj[key]>
}

export type ToObjectType<
  Obj extends Record<string, JSONType<any, any, string>>
> = {
  [key in keyof Obj]: ToType<Obj[key]>
}

export type KindObjectType<
  Obj extends Record<string, JSONType<any, any, string>>
> = {
  [key in keyof Obj]: KindType<Obj[key]>
}

export const createObjectType = <
  Obj extends Record<string, JSONType<any, any, string>>,
  CK extends string,
  I = InputObjectType<Obj>,
  T = ToObjectType<Obj>
>(
  kind: CK,
  objectType: Obj
) => {
  const validate: Validator = (input) => {
    if (typeof input === 'object' && input !== null) {
      let result: true | string = true
      for (let key in input) {
        result = objectType[key].validate(input[key])
        if (typeof result === 'string') {
          return `${result} in object`
        }
      }
      return true
    } else {
      return `expected object, accepted: ${input}`
    }
  }

  const convert: Converter<I, T> = (input) => {
    let result: T = {} as T
    for (let key in objectType) {
      // @ts-ignore
      result[key] = objectType[key].convert(input[key])
    }
    return result
  }

  const reverseConverter: Converter<T, I> = (input) => {
    let result: I = {} as I
    for (let key in objectType) {
      // @ts-ignore
      result[key] = objectType[key].reverseConverter(input[key])
    }
    return result
  }

  return createJSONType(
    `${kind}: ObjectType` as const,
    validate,
    convert,
    reverseConverter
  )
}

export type InputUnionType<
  TS extends JSONType<any, any, string>[]
> = TS extends [infer Head, ...infer Tail]
  ? Head extends JSONType<any, any, string>
    ? Tail extends JSONType<any, any, string>[]
      ? InputType<Head> | InputUnionType<Tail>
      : never
    : never
  : never

export type ToUnionType<TS extends JSONType<any, any, string>[]> = TS extends [
  infer Head,
  ...infer Tail
]
  ? Head extends JSONType<any, any, string>
    ? Tail extends JSONType<any, any, string>[]
      ? ToType<Head> | ToUnionType<Tail>
      : never
    : never
  : never

export const createUnionType = <
  TS extends JSONType<any, any, string>[],
  CK extends string,
  I = InputUnionType<TS>,
  T = ToUnionType<TS>
>(
  kind: CK,
  ...unionTypes: TS
) => {
  const validate: Validator<I> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType.validate(input)) {
        return true
      }
    }
    return `expected ${unionTypes
      .map((unionType) => unionType.kind)
      .join(' | ')}, accepted: ${input}`
  }

  const convert: Converter<I, T> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType.validate(input)) {
        return unionType.convert(input)
      }
    }
  }

  const reverseConverter: Converter<T, I> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType.validate(input)) {
        return unionType.reverseConverter(input)
      }
    }
  }

  return createJSONType(
    `Union: ${kind}` as const,
    validate,
    convert,
    reverseConverter
  )
}

export type InputIntersectionType<
  TS extends JSONType<any, any, string>[]
> = TS extends [infer Head, ...infer Tail]
  ? Head extends JSONType<any, any, string>
    ? Tail extends JSONType<any, any, string>[]
      ? InputType<Head> & InputUnionType<Tail>
      : never
    : never
  : never

export type ToIntersectionType<
  TS extends JSONType<any, any, string>[]
> = TS extends [infer Head, ...infer Tail]
  ? Head extends JSONType<any, any, string>
    ? Tail extends JSONType<any, any, string>[]
      ? ToType<Head> & ToUnionType<Tail>
      : never
    : never
  : never

export const createIntersectionType = <
  TS extends JSONType<object, object, string>[],
  CK extends string,
  I extends object = InputIntersectionType<TS>,
  T extends object = ToIntersectionType<TS>
>(
  kind: CK,
  ...intersectionTypes: TS
) => {
  const validate: Validator<I> = (input) => {
    const result = intersectionTypes.every((intersectionType) => {
      return intersectionType.validate(input) === true
    })
    if (result) {
      return true
    } else {
      return `expected ${intersectionTypes
        .map((intersectionType) => intersectionType.kind)
        .join(' & ')}, accepted: ${input}`
    }
  }

  const convert: Converter<I, T> = (input) => {
    return intersectionTypes.reduce((cur, intersectionType) => {
      return {
        ...cur,
        ...intersectionType.convert(input),
      }
    }, {} as T)
  }

  const reverseConverter: Converter<T, I> = (input) => {
    return intersectionTypes.reduce((cur, intersectionType) => {
      return {
        ...cur,
        ...intersectionType.reverseConverter(input),
      }
    }, {} as I)
  }

  return createJSONType(
    `Intersection: ${kind}` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const createDeriveType = <FI, FT, FK extends string>(
  from: JSONType<FI, FT, FK>
) => <T, CK extends string>(
  kind: CK,
  curValidate: Validator<FT>,
  curConvert: Converter<FT, T>,
  curReverseConverter: Converter<T, FT>
) => {
  const validate: Validator<FI> = (input) => {
    const result = from.validate(input)
    if (typeof result === 'string') {
      return result
    } else {
      return curValidate(from.convert(input))
    }
  }

  const convert: Converter<FI, T> = (input) => {
    return curConvert(from.convert(input))
  }

  const reverseConverter: Converter<T, FI> = (input) => {
    return from.reverseConverter(curReverseConverter(input))
  }

  return createJSONType(
    `${kind} <= ${from.kind}` as const,
    validate,
    convert,
    reverseConverter
  )
}

const createTypeFromAnyList = createDeriveType(
  createListType('AnyList', AnyType)
)

export type ToTupleType<TS extends JSONType<any, any, string>[]> = TS extends [
  infer Head,
  ...infer Tail
]
  ? Head extends JSONType<any, any, string>
    ? Tail extends JSONType<any, any, string>[]
      ? [ToType<Head>, ...ToTupleType<Tail>]
      : []
    : []
  : []

export const createTupleType = <
  TS extends JSONType<any, any, string>[],
  CK extends string,
  T extends any[] = ToTupleType<TS>
>(
  kind: CK,
  ...tupleTypes: TS
) => {
  type I = any[]

  const validate: Validator<I> = (input) => {
    if (input.length !== tupleTypes.length) {
      return `expected [${tupleTypes
        .map((tupleType) => tupleType.kind)
        .join(', ')}], accepted: ${input}`
    } else {
      for (let index = 0; index < tupleTypes.length; index++) {
        const result = tupleTypes[index].validate(input[index])
        if (typeof result === 'string') {
          return result
        }
      }
      return true
    }
  }

  const convert: Converter<I, T> = (input) => {
    let result: T = ([] as any) as T
    for (let index = 0; index < tupleTypes.length; index++) {
      result[index] = tupleTypes[index].convert(input[index])
    }
    return result
  }

  const reverseConverter: Converter<T, I> = (input) => {
    let result: I = ([] as any) as I
    for (let index = 0; index < tupleTypes.length; index++) {
      result[index] = tupleTypes[index].reverseConverter(input[index])
    }
    return result
  }

  return createTypeFromAnyList(`${kind}`, validate, convert, reverseConverter)
}

// export const createTupleType = <TS extends JSONType<any, any, string>[], CK extends string, I = >(kind: CK, ...objectTypes: TS) => {
//   const validate: Validator = (input) => {

//   }

//   const convert: Converter<I, T> = (input) => {}

//   const reverseConverter: Converter<T, I> = (input) => {}

//   return createJSONType(
//     `${kind}: TupleType` as const,
//     validate,
//     convert,
//     reverseConverter
//   )
// }

// const a = createTupleType('[number, string]', NumberType, StringType)

// const validate: Validator<string> = (input) => {

// }

// const convert: Converter<string, Date> = (input) => {}

// const reverseConverter: Converter<Date, string> = (input) => {}

// const createTypeFromString = createDeriveType(StringType)

// const DateType = createTypeFromString(
//   `Date` as const,
//   validate,
//   convert,
//   reverseConverter
// )

// const createTypeFromDateType = createDeriveType(DateType)

// const cvalidate: Validator<Date> = (input) => {

// }

// const cconvert: Converter<Date, { date: Date }> = (input) => {}

// const creverseConverter: Converter<{ date: Date }, Date> = (input) => {}

// const CDate = createTypeFromDateType(
//   `CDate` as const,
//   cvalidate,
//   cconvert,
//   creverseConverter
// )
