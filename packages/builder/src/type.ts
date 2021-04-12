import {
  Type,
  createPrimitiveType,
  PrimitiveTypeEnum,
  createSpecialType,
  SpecialTypeEnum,
  createLiteralType,
  createUnionType,
  createIntersectType,
  createListType,
  createTupleType,
  createObjectType,
  createRecordType,
  ObjectTypeFiled,
  createObjectTypeFiled,
  createNameType,
} from 'jc-schema'
import { ValidateError } from './error'

export type Validator<I = any> = (input: I) => true | ValidateError

export type Converter<I, T> = (input: I) => T

export const JSON_TYPE_SYMBOL = Symbol('JSON_TYPE_SYMBOL')
export const VALIDATE = Symbol('VALIDATE')
export const CONVERT = Symbol('CONVERT')
export const REVERSECONVERTER = Symbol('REVERSECONVERTER')
export const NAME = Symbol('NAME')
export const DESCRIPTION = Symbol('DESCRIPTION')
export const TYPE = Symbol('TYPE')
export const ORIGIN = Symbol('ORIGIN')

export const isJSONType = (input: any): input is JSONType<any, any, string> => {
  return (
    JSON_TYPE_SYMBOL in input && input[JSON_TYPE_SYMBOL] === JSON_TYPE_SYMBOL
  )
}

export type JSONType<I, T, K extends string> = {
  [JSON_TYPE_SYMBOL]: symbol
  [NAME]: K
  [TYPE]: Type
  [DESCRIPTION]: string
  [VALIDATE]: Validator
  [CONVERT]: Converter<I, T>
  [REVERSECONVERTER]: Converter<T, I>
  [ORIGIN]: JSONType<I, T, K> | null
}

export const createJSONType = <I, T, K extends string>(
  name: K,
  type: Type,
  validate: Validator,
  convert: Converter<I, T>,
  reverseConverter: Converter<T, I>,
  description: string,
  origin: JSONType<I, T, K> | null = null
): JSONType<I, T, K> => {
  return {
    [JSON_TYPE_SYMBOL]: JSON_TYPE_SYMBOL,
    [NAME]: name,
    [TYPE]: type,
    [VALIDATE]: validate,
    [CONVERT]: convert,
    [REVERSECONVERTER]: reverseConverter,
    [DESCRIPTION]: description,
    [ORIGIN]: origin,
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

export const name = <K extends string>(type: JSONType<any, any, K>): K => {
  return type[NAME]
}

export const type = <K extends string>(type: JSONType<any, any, K>): Type => {
  return type[TYPE]
}

export const desc = <K extends string>(type: JSONType<any, any, K>): string => {
  return type[DESCRIPTION]
}

export const origin = <I, T, K extends string>(
  type: JSONType<I, T, K>
): JSONType<I, T, K> | null => {
  return type[ORIGIN]
}

const identify = (input: any) => input

export const Naming = <I, T, K extends string>(
  name: K,
  type: JSONType<I, T, K>,
  description?: string
): JSONType<I, T, K> => {
  return createJSONType(
    name,
    createNameType(name),
    type[VALIDATE],
    type[CONVERT],
    type[REVERSECONVERTER],
    description || type[DESCRIPTION],
    type
  )
}

export const StringType = createJSONType(
  '' as const,
  createPrimitiveType(PrimitiveTypeEnum.String),
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
  '' as const,
  createPrimitiveType(PrimitiveTypeEnum.Number),
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
  '' as const,
  createPrimitiveType(PrimitiveTypeEnum.Boolean),
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
  '' as const,
  createPrimitiveType(PrimitiveTypeEnum.Null),
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
  '' as const,
  createRecordType(createSpecialType(SpecialTypeEnum.Any)),
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
  '' as const,
  createListType(createSpecialType(SpecialTypeEnum.Any)),
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
  '' as const,
  createSpecialType(SpecialTypeEnum.Any),
  (_input) => {
    return true
  },
  identify as Converter<any, any>,
  identify,
  'any'
)
export const NoneType = createJSONType(
  '' as const,
  createSpecialType(SpecialTypeEnum.None),
  (input) => {
    return input === undefined
      ? true
      : new ValidateError('undefined', JSON.stringify(input))
  },
  identify as Converter<any, undefined>,
  identify,
  'none'
)

export const createLiteral = <T extends boolean | number | string>(
  to: T,
  description?: string
) => {
  return createJSONType(
    `` as const,
    createLiteralType(to),
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

export const Literal = createLiteral

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

export type ToObjectType<Obj> = {
  [K in keyof Obj as Obj[K] extends JSONType<any, any, string>
    ? K
    : never]: Obj[K] extends JSONType<any, any, string> ? ToType<Obj[K]> : never
}

export type KindObjectType<
  Obj extends Record<string, JSONType<any, any, string>>
> = {
  [key in keyof Obj]: KindType<Obj[key]>
}

export type InputUnionType<TS extends JSONType<any, any, string>[]> = InputType<
  TS[number]
>

export type ToUnionType<TS extends JSONType<any, any, string>[]> = ToType<
  TS[number]
>

export const createUnion = <
  TS extends JSONType<any, any, string>[],
  I = InputUnionType<TS>,
  T = ToUnionType<TS>
>(
  ...unionTypes: TS
): JSONType<I, T, string> => {
  const validate: Validator<I> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType[VALIDATE](input) === true) {
        return true
      }
    }
    return new ValidateError(description, JSON.stringify(input))
  }

  const convert: Converter<I, T> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType[VALIDATE](input) === true) {
        return unionType[CONVERT](input)
      }
    }
  }

  const reverseConverter: Converter<T, I> = (input) => {
    for (let unionType of unionTypes.reverse()) {
      if (unionType[VALIDATE](input) === true) {
        return unionType[REVERSECONVERTER](input)
      }
    }
  }

  const description = unionTypes
    .map((unionType) => unionType[DESCRIPTION])
    .join(' | ')

  return createJSONType(
    '',
    createUnionType([...unionTypes.map(type)]),
    validate,
    convert,
    reverseConverter,
    description
  )
}

export const Union = createUnion

type UnionToIntersection<U> = (
  U extends infer R ? (x: R) => any : never
) extends (x: infer V) => any
  ? V
  : never

export type TypeFomToObjectType<
  T extends ToObjectType<any>
> = T extends ToObjectType<infer O> ? O : never

export type InputIntersectionType<
  TS extends JSONType<any, any, string>[]
> = UnionToIntersection<InputType<TS[number]>>
export type ToIntersectionType<
  TS extends JSONType<any, any, string>[]
> = ToObjectType<UnionToIntersection<TypeFomToObjectType<ToType<TS[number]>>>>

export const createIntersection = <
  TS extends JSONType<any, any, string>[],
  I = InputIntersectionType<TS>,
  T = ToIntersectionType<TS>
>(
  ...intersectionTypes: TS
): JSONType<I, T, string> => {
  const validate: Validator<I> = (input) => {
    if (
      intersectionTypes.every((intersectionType) => {
        return intersectionType[VALIDATE](input) === true
      })
    ) {
      return true
    } else {
      return new ValidateError(description, JSON.stringify(input))
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

  const description = intersectionTypes
    .map((intersectionType) => intersectionType[DESCRIPTION])
    .join(' & ')

  return createJSONType(
    '',
    createIntersectType([...intersectionTypes.map(type)]),
    validate,
    convert,
    reverseConverter,
    description
  )
}

export const Intersection = createIntersection

export const createDeriveType = <FI, FT, FK extends string>(
  from: JSONType<FI, FT, FK>
) => <T, CK extends string>(
  name: CK,
  type: Type,
  curValidate: Validator<FT>,
  curConvert: Converter<FT, T>,
  curReverseConverter: Converter<T, FT>,
  description: string
): JSONType<FI, T, CK> => {
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
    name,
    type,
    validate,
    convert,
    reverseConverter,
    description
  )
}

const createTypeFromAnyList = createDeriveType(AnyListType)

export const createList = <
  Type extends JSONType<any, any, string>,
  FT = ToType<Type>
>(
  item: Type
): JSONType<any, FT[], string> => {
  const validate: Validator = (input: any[]) => {
    let result: true | ValidateError = true
    for (let value of input) {
      result = item[VALIDATE](value)
      if (result !== true) {
        result.message += ` in ${name}`
        return result
      }
    }
    return true
  }

  const convert: Converter<any[], FT[]> = (input) => {
    return input.map(item[CONVERT])
  }

  const reverseConverter: Converter<FT[], any[]> = (input) => {
    return input.map(item[REVERSECONVERTER])
  }

  return createTypeFromAnyList(
    '',
    createListType(type(item)),
    validate,
    convert,
    reverseConverter,
    `[${item[DESCRIPTION]}]`
  )
}

export const ListType = createList

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

export const createTuple = <TS extends JSONType<any, any, string>[]>(
  ...tupleTypes: TS
): JSONType<any, ToTupleType<TS>, string> => {
  const validate: Validator = (input: any[]) => {
    if (input.length !== tupleTypes.length) {
      return new ValidateError(description, JSON.stringify(input))
    } else {
      for (let index = 0; index < tupleTypes.length; index++) {
        const result = tupleTypes[index][VALIDATE](input[index])
        if (result !== true) {
          return new ValidateError(description, JSON.stringify(input))
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

  const description = `(${tupleTypes
    .map((tupleType) => tupleType[DESCRIPTION])
    .join(', ')})`

  return createTypeFromAnyList(
    '',
    createTupleType([...tupleTypes.map(type)]),
    validate,
    convert,
    reverseConverter,
    description
  )
}

export const Tuple = createTuple

export const createTypeFromAnyObject = createDeriveType(AnyObjectType)

export const createObject = <
  Obj extends object,
  T extends object = ToObjectType<Obj>
>(
  objectType: Obj
): JSONType<any, T, string> => {
  type I = object

  const description = `{${getKeys(objectType)
    .map((key) => `${key}: ${objectType[key][DESCRIPTION]}`)
    .join(',\n')}}` as const

  const validate: Validator = <I extends object>(input: I) => {
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
          const error = new ValidateError(
            field[DESCRIPTION],
            JSON.stringify(input)
          )
          error.message += ` in ${name}`
          return error
        }
      }
    }
    return true
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

  const fileds: ObjectTypeFiled[] = []
  for (const key in objectType) {
    const field = objectType[key]
    if (isJSONType(field)) {
      fileds.push(createObjectTypeFiled(key, type(field), null))
    }
  }

  return createTypeFromAnyObject(
    '',
    createObjectType(fileds),
    validate,
    convert,
    reverseConverter,
    description
  )
}

export const ObjectType = createObject

export const createRecord = <
  Type extends JSONType<any, any, string>,
  FT = ToType<Type>,
  T = Record<string, FT>
>(
  item: Type
): JSONType<any, T, string> => {
  type I = object
  const description = `<${item[DESCRIPTION]}>`
  const validate: Validator = <I extends object>(input: I) => {
    let result: true | ValidateError = true
    for (let key in input) {
      result = item[VALIDATE](input[key])
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
      result[key] = item[CONVERT](input[key])
    }
    return result
  }

  const reverseConverter: Converter<T, I> = (input) => {
    let result: I = {}
    for (let key in input) {
      // @ts-ignore
      result[key] = item[REVERSECONVERTER](input[key])
    }
    return result
  }

  return createTypeFromAnyObject(
    '',
    createRecordType(type(item)),
    validate,
    convert,
    reverseConverter,
    description
  )
}

export const RecordType = createRecord

const STRUCT_TYPE = Symbol('JSON_TYPE_CLASS')

export class StructType implements JSONType<object, any, string> {
  [JSON_TYPE_SYMBOL]: symbol;
  [NAME]: string;
  [TYPE]: Type;
  [ORIGIN]: JSONType<any, any, string>;
  [DESCRIPTION]: string;
  [VALIDATE]: Validator<object>;
  [CONVERT]: Converter<object, any>;
  [REVERSECONVERTER]: Converter<any, object>;
  [STRUCT_TYPE] = STRUCT_TYPE;

  [NAME] = 'Struct';
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
