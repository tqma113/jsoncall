import { createJSONType } from './base'
import { Validator, Converter, JSONType } from './base'

const identify = (input: any) => input

export const StringType = createJSONType(
  'string' as const,
  (input) => {
    return typeof input === 'string'
      ? true
      : `expected string, accept: ${JSON.stringify(input)}`
  },
  identify as Converter<any, string>,
  identify
)
export const NumberType = createJSONType(
  'number' as const,
  (input) => {
    return typeof input === 'number'
      ? true
      : `expected number, accept: ${JSON.stringify(input)}`
  },
  identify as Converter<any, number>,
  identify
)
export const BooleanType = createJSONType(
  'boolean' as const,
  (input) => {
    return typeof input === 'boolean'
      ? true
      : `expected boolean, accept: ${JSON.stringify(input)}`
  },
  identify as Converter<any, boolean>,
  identify
)
export const NullType = createJSONType(
  'null' as const,
  (input) => {
    return input === null
      ? true
      : `expected null, accept: ${JSON.stringify(input)}`
  },
  identify as Converter<any, null>,
  identify
)
export const AnyObjectType = createJSONType(
  'object' as const,
  (input) => {
    return typeof input === 'object' && input !== null && !Array.isArray(input)
      ? true
      : `expected object, accept: ${JSON.stringify(input)}`
  },
  identify as Converter<any, object>,
  identify
)
export const AnyListType = createJSONType(
  'list' as const,
  (input) => {
    return Array.isArray(input)
      ? true
      : `expected list, accept: ${JSON.stringify(input)}`
  },
  identify as Converter<any, any[]>,
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
    return input === undefined
      ? true
      : `expected undefined, accept: ${JSON.stringify(input)}`
  },
  identify as Converter<any, undefined>,
  identify
)

export const createLiteralType = <T>(to: T) => {
  return createJSONType(
    `Literal(${to})` as const,
    (input) => {
      return input === to
        ? true
        : `expected ${JSON.stringify(to)}, accept: ${JSON.stringify(input)}`
    },
    identify as Converter<any, T>,
    identify
  )
}

export const Literal = createLiteralType

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
  I = InputUnionType<TS>,
  T = ToUnionType<TS>
>(
  ...unionTypes: TS
): JSONType<I, T, `Union(${string})`> => {
  const validate: Validator<I> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType.validate(input) === true) {
        return true
      }
    }
    return `expected ${unionTypes
      .reverse()
      .map((unionType) => unionType.kind)
      .join(' | ')}, accept: ${JSON.stringify(input)}`
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
    `Union(${unionTypes
      .map((unionType) => unionType.kind)
      .join(', ')})` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const Union = createUnionType

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
  I extends object = InputIntersectionType<TS>,
  T extends object = ToIntersectionType<TS>
>(
  ...intersectionTypes: TS
): JSONType<I, T, `Intersection(${string})`> => {
  const validate: Validator<I> = (input) => {
    if (
      intersectionTypes.every((intersectionType) => {
        return intersectionType.validate(input) === true
      })
    ) {
      return true
    } else {
      return `expected ${intersectionTypes
        .map((intersectionType) => intersectionType.kind)
        .join(' & ')}, accept: ${JSON.stringify(input)}`
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
    `Intersection(${intersectionTypes
      .map((intersectionType) => intersectionType.kind)
      .join(', ')})` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const Intersection = createIntersectionType

export const createDeriveType = <FI, FT, FK extends string>(
  from: JSONType<FI, FT, FK>
) => <T, CK extends string>(
  kind: CK,
  curValidate: Validator<FT>,
  curConvert: Converter<FT, T>,
  curReverseConverter: Converter<T, FT>
): JSONType<FI, T, `${CK} <= ${FK}`> => {
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

const createTypeFromAnyList = createDeriveType(AnyListType)

export const createListType = <
  Type extends JSONType<any, any, string>,
  FT = ToType<Type>
>(
  type: Type
): JSONType<any, FT[], `List[${string}] <= list`> => {
  const validate: Validator = (input: any[]) => {
    let result: true | string = true
    for (let value of input) {
      result = type.validate(value)
      if (typeof result === 'string') {
        return `${result} in list`
      }
    }
    return true
  }

  const convert: Converter<any[], FT[]> = (input) => {
    return input.map(type.convert)
  }

  const reverseConverter: Converter<FT[], any[]> = (input) => {
    return input.map(type.reverseConverter)
  }

  return createTypeFromAnyList(
    `List[${type.kind}]` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const ListType = createListType

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

export const createTupleType = <TS extends JSONType<any, any, string>[]>(
  ...tupleTypes: TS
): JSONType<any, ToTupleType<TS>, `Tuple(${string}) <= list`> => {
  const validate: Validator = (input: any[]) => {
    if (input.length !== tupleTypes.length) {
      return `expected [${tupleTypes
        .map((tupleType) => tupleType.kind)
        .join(', ')}], accept: ${JSON.stringify(input)}`
    } else {
      for (let index = 0; index < tupleTypes.length; index++) {
        const result = tupleTypes[index].validate(input[index])
        if (typeof result === 'string') {
          return `expected [${tupleTypes
            .map((tupleType) => tupleType.kind)
            .join(', ')}], accept: ${JSON.stringify(input)}`
        }
      }
      return true
    }
  }

  const convert: Converter<any[], ToTupleType<TS>> = (input) => {
    let result: ToTupleType<TS> = ([] as any) as ToTupleType<TS>
    for (let index = 0; index < tupleTypes.length; index++) {
      // @ts-ignore
      result[index] = tupleTypes[index].convert(input[index])
    }
    return result
  }

  const reverseConverter: Converter<ToTupleType<TS>, any[]> = (input) => {
    let result: any[] = []
    for (let index = 0; index < tupleTypes.length; index++) {
      result[index] = tupleTypes[index].reverseConverter(input[index])
    }
    return result
  }

  return createTypeFromAnyList(
    `Tuple(${tupleTypes
      .map((tupleType) => tupleType.kind)
      .join(', ')})` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const Tuple = createTupleType

export const createTypeFromAnyObject = createDeriveType(AnyObjectType)

export const createObjectType = <
  Obj extends Record<string, JSONType<any, any, string>>,
  T extends object = ToObjectType<Obj>
>(
  objectType: Obj
): JSONType<any, T, `ObjectType {\n ${string} \n} <= object`> => {
  type I = object
  const validate: Validator = <I extends object>(input: I) => {
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
      return `expected object, accept: ${JSON.stringify(input)}`
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

  return createTypeFromAnyObject(
    `ObjectType {\n ${getKeys(objectType)
      .map((key) => `${key}: ${objectType[key].kind}`)
      .join(',\n')} \n}` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const ObjectType = createObjectType

export const createRecordType = <
  Type extends JSONType<any, any, string>,
  FT = ToType<Type>,
  T = Record<string, FT>
>(
  type: Type
): JSONType<any, T, `Record(${string}) <= object`> => {
  type I = object
  const validate: Validator = <I extends object>(input: I) => {
    let result: true | string = true
    for (let key in input) {
      result = type.validate(input[key])
      if (typeof result === 'string') {
        return `${result} in record`
      }
    }
    return true
  }

  const convert: Converter<I, T> = (input) => {
    let result: T = {} as T
    for (let key of getKeys(input)) {
      // @ts-ignore
      result[key] = type.convert(input[key])
    }
    return result
  }

  const reverseConverter: Converter<T, I> = (input) => {
    let result: I = {}
    for (let key in input) {
      // @ts-ignore
      result[key] = type.reverseConverter(input[key])
    }
    return result
  }

  return createTypeFromAnyObject(
    `Record(${type.kind})` as const,
    validate,
    convert,
    reverseConverter
  )
}

export const RecordType = createRecordType

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}

// const zero = Literal(0)
// const name = Literal('name')
// const trueValue = Literal(true)
// const a = Tuple(NumberType, StringType)
// const b = ListType(NumberType)
// const c = ObjectType({ foo: NumberType, bar: StringType })
// const d = RecordType(NumberType)

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
