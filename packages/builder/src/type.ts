import { ValidateError } from './error'

export type Validator<I = any> = (input: I) => true | ValidateError

export type Converter<I, T> = (input: I) => T

export const JSON_TYPE_SYMBOL = Symbol('JSON_TYPE_SYMBOL')
export const VALIDATE = Symbol('VALIDATE')
export const CONVERT = Symbol('CONVERT')
export const REVERSECONVERTER = Symbol('REVERSECONVERTER')
export const KIND = Symbol('KIND')
export const DESCRIPTION = Symbol('DESCRIPTION')

export const isJSONType = (input: any): input is JSONType<any, any, string> => {
  return (
    JSON_TYPE_SYMBOL in input && input[JSON_TYPE_SYMBOL] === JSON_TYPE_SYMBOL
  )
}

export type JSONType<I, T, K extends string> = {
  [JSON_TYPE_SYMBOL]: symbol
  [KIND]: K
  [DESCRIPTION]: string
  [VALIDATE]: Validator
  [CONVERT]: Converter<I, T>
  [REVERSECONVERTER]: Converter<T, I>
}

export const createJSONType = <I, T, K extends string>(
  kind: K,
  validate: Validator,
  convert: Converter<I, T>,
  reverseConverter: Converter<T, I>,
  description: string = ''
): JSONType<I, T, K> => {
  return {
    [JSON_TYPE_SYMBOL]: JSON_TYPE_SYMBOL,
    [KIND]: kind,
    [VALIDATE]: validate,
    [CONVERT]: convert,
    [REVERSECONVERTER]: reverseConverter,
    [DESCRIPTION]: description,
  }
}

export const validate = <I>(type: JSONType<I, any, string>, input: I) => {
  return type[VALIDATE](input)
}

export const convert = <I, T>(type: JSONType<I, T, string>, input: I): T => {
  return type[CONVERT](input)
}

export const reverseConverter = <I, T>(
  type: JSONType<I, T, string>,
  input: T
): I => {
  return type[REVERSECONVERTER](input)
}

export const kind = <K extends string>(type: JSONType<any, any, K>): K => {
  return type[KIND]
}

const identify = (input: any) => input

export const StringType = createJSONType(
  'string' as const,
  (input) => {
    return typeof input === 'string'
      ? true
      : new ValidateError('string', JSON.stringify(input))
  },
  identify as Converter<any, string>,
  identify,
  'string'
)
export const NumberType = createJSONType(
  'number' as const,
  (input) => {
    return typeof input === 'number'
      ? true
      : new ValidateError('number', JSON.stringify(input))
  },
  identify as Converter<any, number>,
  identify,
  'number'
)
export const BooleanType = createJSONType(
  'boolean' as const,
  (input) => {
    return typeof input === 'boolean'
      ? true
      : new ValidateError('boolean', JSON.stringify(input))
  },
  identify as Converter<any, boolean>,
  identify,
  'boolean'
)
export const NullType = createJSONType(
  'null' as const,
  (input) => {
    return input === null
      ? true
      : new ValidateError('null', JSON.stringify(input))
  },
  identify as Converter<any, null>,
  identify,
  'null'
)
export const AnyObjectType = createJSONType(
  'object' as const,
  (input) => {
    return typeof input === 'object' && input !== null && !Array.isArray(input)
      ? true
      : new ValidateError('object', JSON.stringify(input))
  },
  identify as Converter<any, object>,
  identify,
  'object'
)
export const AnyListType = createJSONType(
  'list' as const,
  (input) => {
    return Array.isArray(input)
      ? true
      : new ValidateError('list', JSON.stringify(input))
  },
  identify as Converter<any, any[]>,
  identify,
  'list'
)
export const AnyType = createJSONType(
  'any' as const,
  (_input) => {
    return true
  },
  identify as Converter<any, any>,
  identify,
  'any'
)
export const NoneType = createJSONType(
  'none' as const,
  (input) => {
    return input === undefined
      ? true
      : new ValidateError('undefined', JSON.stringify(input))
  },
  identify as Converter<any, undefined>,
  identify,
  'none'
)

export const createLiteralType = <T>(to: T, description: string) => {
  return createJSONType(
    `Literal` as const,
    (input) => {
      return input === to
        ? true
        : new ValidateError(JSON.stringify(to), JSON.stringify(input))
    },
    identify as Converter<any, T>,
    identify,
    description ? description : JSON.stringify(to)
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

export type ToObjectType<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends JSONType<any, any, string>
    ? K
    : never]: Obj[K] extends JSONType<any, any, string> ? ToType<Obj[K]> : never
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
): JSONType<I, T, `Union`> => {
  const validate: Validator<I> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType[VALIDATE](input) === true) {
        return true
      }
    }
    return new ValidateError(
      unionTypes
        .reverse()
        .map((unionType) => unionType[KIND])
        .join(' | '),
      JSON.stringify(input)
    )
  }

  const convert: Converter<I, T> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType[VALIDATE](input)) {
        return unionType[CONVERT](input)
      }
    }
  }

  const reverseConverter: Converter<T, I> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType[VALIDATE](input)) {
        return unionType[REVERSECONVERTER](input)
      }
    }
  }

  return createJSONType(
    `Union` as const,
    validate,
    convert,
    reverseConverter,
    `Union(${unionTypes.map((unionType) => unionType[KIND]).join(', ')})`
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
  TS extends JSONType<any, any, string>[],
  I extends object = InputIntersectionType<TS>,
  T extends object = ToIntersectionType<TS>
>(
  ...intersectionTypes: TS
): JSONType<I, T, `Intersection`> => {
  const validate: Validator<I> = (input) => {
    if (
      intersectionTypes.every((intersectionType) => {
        return intersectionType[VALIDATE](input) === true
      })
    ) {
      return true
    } else {
      return new ValidateError(
        intersectionTypes
          .map((intersectionType) => intersectionType[KIND])
          .join(' & '),
        JSON.stringify(input)
      )
    }
  }

  const convert: Converter<I, T> = (input) => {
    return intersectionTypes.reduce((cur, intersectionType) => {
      return {
        ...cur,
        ...intersectionType[CONVERT](input),
      }
    }, {} as T)
  }

  const reverseConverter: Converter<T, I> = (input) => {
    return intersectionTypes.reduce((cur, intersectionType) => {
      return {
        ...cur,
        ...intersectionType[REVERSECONVERTER](input),
      }
    }, {} as I)
  }

  return createJSONType(
    `Intersection` as const,
    validate,
    convert,
    reverseConverter,
    `Intersection(${intersectionTypes
      .map((intersectionType) => intersectionType[KIND])
      .join(', ')})`
  )
}

export const Intersection = createIntersectionType

export const createDeriveType = <FI, FT, FK extends string>(
  from: JSONType<FI, FT, FK>
) => <T, CK extends string>(
  kind: CK,
  curValidate: Validator<FT>,
  curConvert: Converter<FT, T>,
  curReverseConverter: Converter<T, FT>,
  description?: string
): JSONType<FI, T, `${CK}`> => {
  const validate: Validator<FI> = (input) => {
    const result = from[VALIDATE](input)
    if (result !== true) {
      return result
    } else {
      return curValidate(from[CONVERT](input))
    }
  }

  const convert: Converter<FI, T> = (input) => {
    return curConvert(from[CONVERT](input))
  }

  const reverseConverter: Converter<T, FI> = (input) => {
    return from[REVERSECONVERTER](curReverseConverter(input))
  }

  return createJSONType(
    `${kind}` as const,
    validate,
    convert,
    reverseConverter,
    description ? description : kind
  )
}

const createTypeFromAnyList = createDeriveType(AnyListType)

export const createListType = <
  Type extends JSONType<any, any, string>,
  FT = ToType<Type>
>(
  type: Type,
  description?: string
): JSONType<any, FT[], `List`> => {
  const validate: Validator = (input: any[]) => {
    let result: true | ValidateError = true
    for (let value of input) {
      result = type[VALIDATE](value)
      if (result !== true) {
        result.message += ` in ${kind}`
        return result
      }
    }
    return true
  }

  const convert: Converter<any[], FT[]> = (input) => {
    return input.map(type[CONVERT])
  }

  const reverseConverter: Converter<FT[], any[]> = (input) => {
    return input.map(type[REVERSECONVERTER])
  }

  return createTypeFromAnyList(
    `List`,
    validate,
    convert,
    reverseConverter,
    description ? description : `List[${type[KIND]}]`
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
): JSONType<any, ToTupleType<TS>, `Tuple`> => {
  const validate: Validator = (input: any[]) => {
    if (input.length !== tupleTypes.length) {
      return new ValidateError(
        `[${tupleTypes.map((tupleType) => tupleType[KIND]).join(', ')}]`,
        JSON.stringify(input)
      )
    } else {
      for (let index = 0; index < tupleTypes.length; index++) {
        const result = tupleTypes[index][VALIDATE](input[index])
        if (result !== true) {
          return new ValidateError(
            `[${tupleTypes.map((tupleType) => tupleType[KIND]).join(', ')}]`,
            JSON.stringify(input)
          )
        }
      }
      return true
    }
  }

  const convert: Converter<any[], ToTupleType<TS>> = (input) => {
    let result: ToTupleType<TS> = ([] as any) as ToTupleType<TS>
    for (let index = 0; index < tupleTypes.length; index++) {
      // @ts-ignore
      result[index] = tupleTypes[index][CONVERT](input[index])
    }
    return result
  }

  const reverseConverter: Converter<ToTupleType<TS>, any[]> = (input) => {
    let result: any[] = []
    for (let index = 0; index < tupleTypes.length; index++) {
      result[index] = tupleTypes[index][REVERSECONVERTER](input[index])
    }
    return result
  }

  return createTypeFromAnyList(
    `Tuple` as const,
    validate,
    convert,
    reverseConverter,
    `Tuple(${tupleTypes.map((tupleType) => tupleType[KIND]).join(', ')})`
  )
}

export const Tuple = createTupleType

export const createTypeFromAnyObject = createDeriveType(AnyObjectType)

export const createObjectType = <
  Obj extends object,
  T extends object = ToObjectType<Obj>
>(
  objectType: Obj,
  description?: string
): JSONType<any, T, `Object`> => {
  type I = object

  const validate: Validator = <I extends object>(input: I) => {
    if (typeof input === 'object' && input !== null) {
      let result: true | ValidateError = true
      for (let key in objectType) {
        const field = objectType[key]
        if (isJSONType(field)) {
          if (key in input) {
            // @ts-ignore
            result = field[VALIDATE](input[key])
            if (result !== true) {
              result.message += ` in object.${key}`
              return result
            }
          } else {
            const error = new ValidateError(field[KIND], JSON.stringify(input))
            error.message += ` in ${kind}`
            return error
          }
        }
      }
      return true
    } else {
      return new ValidateError('object', JSON.stringify(input))
    }
  }

  const convert: Converter<I, T> = (input) => {
    let result: T = {} as T
    for (let key in objectType) {
      // @ts-ignore
      result[key] = objectType[key][CONVERT](input[key])
    }
    return result
  }

  const reverseConverter: Converter<T, I> = (input) => {
    let result: I = {} as I
    for (let key in objectType) {
      // @ts-ignore
      result[key] = objectType[key][REVERSECONVERTER](input[key])
    }
    return result
  }

  return createTypeFromAnyObject(
    'Object',
    validate,
    convert,
    reverseConverter,
    description
      ? description
      : `{${getKeys(objectType)
          .map((key) => `${key}: ${objectType[key][KIND]}`)
          .join(',\n')}}`
  )
}

export const ObjectType = createObjectType

export const createRecordType = <
  Type extends JSONType<any, any, string>,
  FT = ToType<Type>,
  T = Record<string, FT>
>(
  type: Type,
  description: string = ''
): JSONType<any, T, `Record(${string})`> => {
  type I = object
  const validate: Validator = <I extends object>(input: I) => {
    let result: true | ValidateError = true
    for (let key in input) {
      result = type[VALIDATE](input[key])
      if (typeof result === 'string') {
        return result
      }
    }
    return true
  }

  const convert: Converter<I, T> = (input) => {
    let result: T = {} as T
    for (let key of getKeys(input)) {
      // @ts-ignore
      result[key] = type[CONVERT](input[key])
    }
    return result
  }

  const reverseConverter: Converter<T, I> = (input) => {
    let result: I = {}
    for (let key in input) {
      // @ts-ignore
      result[key] = type[REVERSECONVERTER](input[key])
    }
    return result
  }

  return createTypeFromAnyObject(
    `Record(${type[KIND]})` as const,
    validate,
    convert,
    reverseConverter,
    description
  )
}

export const RecordType = createRecordType

const STRUCT_TYPE = Symbol('JSON_TYPE_CLASS')

export class StructType implements JSONType<object, any, string> {
  [JSON_TYPE_SYMBOL]: symbol;
  [KIND]: string;
  [DESCRIPTION]: string;
  [VALIDATE]: Validator<object>;
  [CONVERT]: Converter<object, any>;
  [REVERSECONVERTER]: Converter<any, object>;
  [STRUCT_TYPE] = STRUCT_TYPE;

  [KIND] = 'Struct';
  [DESCRIPTION] = 'Struct';

  [VALIDATE] = (input: object) => {
    return typeof input === 'object' && input !== null && !Array.isArray(input)
      ? true
      : new ValidateError('object', JSON.stringify(input))
  };

  [CONVERT] = (input: object): any => {
    return input
  };

  [REVERSECONVERTER] = (input: any): object => {
    return input
  }
}

export type Fields<T extends StructType> = {
  [K in keyof T as K extends string
    ? T[K] extends JSONType<any, any, string>
      ? K
      : never
    : never]: T[K]
}

export const Struct = <T extends StructType>(Ctro: new () => T) => {
  const struct = new Ctro()
  return ObjectType((struct as unknown) as Fields<T>)
}

export function description(value: string) {
  return function <T extends JSONType<any, any, string>>(
    target: T,
    propertyKey: string
  ) {
    target[DESCRIPTION] = value
  }
}

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}

// const zero = Literal(0 as const)
// const name = Literal('name' as const)
// const trueValue = Literal(true)
// const a = Tuple(NumberType, StringType)
// const b = ListType(NumberType)
// const c = ObjectType({ foo: NumberType, bar: StringType })
// const d = RecordType(NumberType)

// class FooAndBarClass extends StructType {
//   [DESCRIPTION] = 'foo and bar'

//   @description('some')
//   foo = NumberType

//   bar = StringType
// }

// type A = Fields<FooAndBarClass>

// const FooAndBar = Struct(FooAndBarClass)

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
