import {
  Type,
  ObjectTypeFiled,
  PrimitiveTypeEnum,
  SpecialTypeEnum,
  createPrimitiveType,
  createSpecialType,
  createLiteralType,
  createUnionType,
  createIntersectType,
  createListType,
  createTupleType,
  createObjectType,
  createRecordType,
  createObjectTypeFiled,
  createNameType,
} from 'jc-schema'
import { ValidateError } from './error'

export type Validator<I = any> = (input: I) => true | ValidateError

export type Converter<I, T> = (input: I) => T

export const JSON_TYPE_SYMBOL = Symbol('JSON_TYPE_SYMBOL')
export const VALIDATE = Symbol('VALIDATE')
export const CONVERT = Symbol('CONVERT')
export const CONTROVERT = Symbol('CONTROVERT')
export const NAME = Symbol('NAME')
export const DESCRIPTION = Symbol('DESCRIPTION')
export const TYPE = Symbol('TYPE')
export const ORIGIN = Symbol('ORIGIN')

export const isBaseJSONType = (
  input: any
): input is BaseJSONType<any, any, string> => {
  return (
    JSON_TYPE_SYMBOL in input && input[JSON_TYPE_SYMBOL] === JSON_TYPE_SYMBOL
  )
}

export type BaseJSONType<I, T, K extends string> = {
  [JSON_TYPE_SYMBOL]: symbol
  [NAME]: K
  [TYPE]: () => Type
  [DESCRIPTION]: () => string
  [VALIDATE]: Validator
  [CONVERT]: Converter<I, T>
  [CONTROVERT]: Converter<T, I>
  [ORIGIN]: JSONType<I, T, K> | null
}

export type JSONType<I, T, K extends string> =
  | (() => BaseJSONType<I, T, K>)
  | (new () => BaseJSONType<I, T, K>)

export type Base<T extends JSONType<any, any, string>> = T extends JSONType<
  infer I,
  infer T,
  infer K
>
  ? BaseJSONType<I, T, K>
  : never

export const createJSONType = <I, T, K extends string>(
  name: K,
  type: () => Type,
  validate: Validator,
  convert: Converter<I, T>,
  controvert: Converter<T, I>,
  description: () => string,
  origin: JSONType<I, T, K> | null = null
): BaseJSONType<I, T, K> => {
  return {
    [JSON_TYPE_SYMBOL]: JSON_TYPE_SYMBOL,
    [NAME]: name,
    [TYPE]: type,
    [VALIDATE]: validate,
    [CONVERT]: convert,
    [CONTROVERT]: controvert,
    [DESCRIPTION]: description,
    [ORIGIN]: origin,
  }
}

export const validate = <I>(type: JSONType<I, any, string>, input: I) => {
  return getInstance(type)[VALIDATE](input)
}

export const convert = <I, T>(type: JSONType<I, T, string>, input: I): T => {
  return getInstance(type)[CONVERT](input)
}

export const controvert = <I, T>(type: JSONType<I, T, string>, input: T): I => {
  return getInstance(type)[CONTROVERT](input)
}

export const name = <K extends string>(type: JSONType<any, any, K>): K => {
  return getInstance(type)[NAME]
}

const types = new WeakMap<(new () => any) | (() => any), Type>()
export const type = <K extends string>(type: JSONType<any, any, K>): Type => {
  const t = types.get(type)
  if (t) {
    return t
  } else {
    if (type.prototype instanceof StructType) {
      types.set(type, createNameType(name(type)))
    }
    const t = getInstance(type)[TYPE]()
    types.set(type, t)
    return t
  }
}

const descs = new WeakMap<(new () => any) | (() => any), string>()
export const desc = <K extends string>(type: JSONType<any, any, K>): string => {
  const d = descs.get(type)
  if (!!d) {
    return d
  } else {
    if (type.prototype instanceof StructType) {
      descs.set(type, name(type))
    }
    const d = getInstance(type)[DESCRIPTION]()
    descs.set(type, d)
    return d
  }
}

export const origin = <I, T, K extends string>(
  type: JSONType<I, T, K>
): JSONType<I, T, K> | null => {
  return getInstance(type)[ORIGIN]
}

const identify = (input: any) => input

export const Naming =
  <I, T, K extends string>(
    name: K,
    type: () => BaseJSONType<I, T, K>,
    description?: string
  ): (() => BaseJSONType<I, T, K>) =>
  () => {
    return createJSONType(
      name,
      () => createNameType(name),
      type()[VALIDATE],
      type()[CONVERT],
      type()[CONTROVERT],
      () => description || desc(type),
      type
    )
  }
export const NamingWithoutType =
  <I, T, K extends string>(
    name: K,
    type: () => BaseJSONType<I, T, K>,
    description?: string
  ): (() => BaseJSONType<I, T, K>) =>
  () => {
    return createJSONType(
      name,
      type()[TYPE],
      type()[VALIDATE],
      type()[CONVERT],
      type()[CONTROVERT],
      () => description || desc(type),
      type
    )
  }

export const StringType = () =>
  createJSONType(
    '' as const,
    () => createPrimitiveType(PrimitiveTypeEnum.String),
    (input) => {
      return typeof input === 'string'
        ? true
        : new ValidateError('string', JSON.stringify(input))
    },
    identify as Converter<any, string>,
    identify,
    () => 'string'
  )
export const NumberType = () =>
  createJSONType(
    '' as const,
    () => createPrimitiveType(PrimitiveTypeEnum.Number),
    (input) => {
      return typeof input === 'number'
        ? true
        : new ValidateError('number', JSON.stringify(input))
    },
    identify as Converter<any, number>,
    identify,
    () => 'number'
  )
export const BooleanType = () =>
  createJSONType(
    '' as const,
    () => createPrimitiveType(PrimitiveTypeEnum.Boolean),
    (input) => {
      return typeof input === 'boolean'
        ? true
        : new ValidateError('boolean', JSON.stringify(input))
    },
    identify as Converter<any, boolean>,
    identify,
    () => 'boolean'
  )
export const NullType = () =>
  createJSONType(
    '' as const,
    () => createPrimitiveType(PrimitiveTypeEnum.Null),
    (input) => {
      return input === null
        ? true
        : new ValidateError('null', JSON.stringify(input))
    },
    identify as Converter<any, null>,
    identify,
    () => 'null'
  )
export const AnyObjectType = () =>
  createJSONType(
    '' as const,
    () => createRecordType(createSpecialType(SpecialTypeEnum.Any)),
    (input) => {
      return typeof input === 'object' &&
        input !== null &&
        !Array.isArray(input)
        ? true
        : new ValidateError('object', JSON.stringify(input))
    },
    identify as Converter<any, object>,
    identify,
    () => 'object'
  )
export const AnyListType = () =>
  createJSONType(
    '' as const,
    () => createListType(createSpecialType(SpecialTypeEnum.Any)),
    (input) => {
      return Array.isArray(input)
        ? true
        : new ValidateError('list', JSON.stringify(input))
    },
    identify as Converter<any, any[]>,
    identify,
    () => 'list'
  )
export const AnyType = () =>
  createJSONType(
    '' as const,
    () => createSpecialType(SpecialTypeEnum.Any),
    (_input) => {
      return true
    },
    identify as Converter<any, any>,
    identify,
    () => 'any'
  )
export const NoneType = () =>
  createJSONType(
    '' as const,
    () => createSpecialType(SpecialTypeEnum.None),
    (input) => {
      return input === undefined
        ? true
        : new ValidateError('undefined', JSON.stringify(input))
    },
    identify as Converter<any, undefined>,
    identify,
    () => 'none'
  )

export const createLiteral =
  <T extends boolean | number | string>(to: T, description?: string) =>
  () =>
    createJSONType(
      `` as const,
      () => createLiteralType(to),
      (input) => {
        return input === to
          ? true
          : new ValidateError(JSON.stringify(to), JSON.stringify(input))
      },
      identify as Converter<any, T>,
      identify,
      () => (description ? description : JSON.stringify(to))
    )

export const Literal = createLiteral

export type InputType<J extends JSONType<any, any, string>> =
  J extends JSONType<infer I, any, string> ? I : never
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
) => {
  if (unionTypes.length === 0) {
    throw new Error('Union type needs more than one item type.')
  }

  return () => {
    const v: Validator<I> = (input) => {
      for (let unionType of unionTypes.slice().reverse()) {
        if (validate(unionType, input) === true) {
          return true
        }
      }
      // TODO: this solution interrupts the error pop
      return new ValidateError(description(), JSON.stringify(input))
    }

    const c: Converter<I, T> = (input) => {
      for (let unionType of unionTypes.slice().reverse()) {
        if (validate(unionType, input) === true) {
          return convert(unionType, input)
        }
      }
    }

    const cv: Converter<T, I> = (input) => {
      for (let unionType of unionTypes.slice().reverse()) {
        try {
          return controvert(unionType, input)
        } catch {
          continue
        }
      }
    }

    const description = () =>
      unionTypes.map((unionType) => desc(unionType)).join(' | ')

    return createJSONType(
      '',
      () => createUnionType([...unionTypes.map(type)]),
      v,
      c,
      cv,
      description
    )
  }
}

export const Union = createUnion

type UnionToIntersection<U> = (
  U extends infer R ? (x: R) => any : never
) extends (x: infer V) => any
  ? V
  : never

export type TypeFomToObjectType<T extends ToObjectType<any>> =
  T extends ToObjectType<infer O> ? O : never

export type InputIntersectionType<TS extends JSONType<any, any, string>[]> =
  UnionToIntersection<InputType<TS[number]>>
export type ToIntersectionType<TS extends JSONType<any, any, string>[]> =
  ToObjectType<UnionToIntersection<TypeFomToObjectType<ToType<TS[number]>>>>

export const createIntersection = <
  TS extends JSONType<any, any, string>[],
  I = InputIntersectionType<TS>,
  T = ToIntersectionType<TS>
>(
  ...intersectionTypes: TS
) => {
  if (intersectionTypes.length === 0) {
    throw new Error('Intersection type needs more than one item type.')
  }

  return () => {
    const v: Validator<I> = (input) => {
      if (
        intersectionTypes.every((intersectionType) => {
          return validate(intersectionType, input) === true
        })
      ) {
        return true
      } else {
        return new ValidateError(description(), JSON.stringify(input))
      }
    }

    const c: Converter<I, T> = (input) => {
      return intersectionTypes.reduce((cur, intersectionType) => {
        return {
          ...cur,
          ...convert(intersectionType, input),
        }
      }, {} as T)
    }

    const cv: Converter<T, I> = (input) => {
      return intersectionTypes.reduce((cur, intersectionType) => {
        return {
          ...cur,
          ...controvert(intersectionType, input),
        }
      }, {} as I)
    }

    const description = () =>
      intersectionTypes
        .map((intersectionType) => desc(intersectionType))
        .join(' & ')

    return createJSONType(
      '',
      () => createIntersectType([...intersectionTypes.map(type)]),
      v,
      c,
      cv,
      description
    )
  }
}

export const Intersection = createIntersection

export const createDeriveType =
  <FI, FT, FK extends string>(from: JSONType<FI, FT, FK>) =>
  <T, CK extends string>(
    name: CK,
    type: () => Type,
    curValidate: Validator<FT>,
    curConvert: Converter<FT, T>,
    curReverseConverter: Converter<T, FT>,
    description: () => string
  ): BaseJSONType<FI, T, CK> => {
    const v: Validator<FI> = (input) => {
      const result = validate(from, input)
      if (result !== true) {
        return result
      } else {
        return curValidate(convert(from, input))
      }
    }

    const c: Converter<FI, T> = (input) => {
      return curConvert(convert(from, input))
    }

    const cv: Converter<T, FI> = (input) => {
      return controvert(from, curReverseConverter(input))
    }

    return createJSONType(name, type, v, c, cv, description)
  }

const createTypeFromAnyList = createDeriveType(AnyListType)

export const createList =
  <Type extends JSONType<any, any, string>, FT = ToType<Type>>(item: Type) =>
  () => {
    const v: Validator = (input: any[]) => {
      let result: true | ValidateError = true
      for (let value of input) {
        result = validate(item, value)
        if (result !== true) {
          result.message += ` in ${name}`
          return result
        }
      }
      return true
    }

    const c: Converter<any[], FT[]> = (input) => {
      return input.map((i) => convert(item, i))
    }

    const cv: Converter<FT[], any[]> = (input) => {
      return input.map((i) => controvert(item, i))
    }

    return createTypeFromAnyList(
      '',
      () => createListType(type(item)),
      v,
      c,
      cv,
      () => `[${desc(item)}]`
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

export const createTuple =
  <TS extends JSONType<any, any, string>[]>(...tupleTypes: TS) =>
  () => {
    const v: Validator = (input: any[]) => {
      if (input.length !== tupleTypes.length) {
        return new ValidateError(description(), JSON.stringify(input))
      } else {
        for (let index = 0; index < tupleTypes.length; index++) {
          const result = validate(tupleTypes[index], input[index])
          if (result !== true) {
            return new ValidateError(description(), JSON.stringify(input))
          }
        }
        return true
      }
    }

    const c: Converter<any[], ToTupleType<TS>> = (input) => {
      let result: ToTupleType<TS> = [] as any as ToTupleType<TS>
      for (let index = 0; index < tupleTypes.length; index++) {
        // @ts-ignore
        result[index] = convert(tupleTypes[index], input[index])
      }
      return result
    }

    const cv: Converter<ToTupleType<TS>, any[]> = (input) => {
      let result: any[] = []
      for (let index = 0; index < tupleTypes.length; index++) {
        result[index] = controvert(tupleTypes[index], input[index])
      }
      return result
    }

    const description = () =>
      `(${tupleTypes.map((tupleType) => desc(tupleType)).join(', ')})`

    return createTypeFromAnyList(
      '',
      () => createTupleType([...tupleTypes.map(type)]),
      v,
      c,
      cv,
      description
    )
  }

export const Tuple = createTuple

export const createTypeFromAnyObject = createDeriveType(AnyObjectType)

export const createObject =
  <Obj extends object, T extends object = ToObjectType<Obj>>(
    objectType: Obj
  ): (() => BaseJSONType<any, T, string>) =>
  () => {
    type I = object

    const description = () =>
      `{${getKeys(objectType)
        .map((key) => `${key}: ${desc(objectType[key] as any)}`)
        .join(',')}}` as const

    const v: Validator = <I extends object>(input: I) => {
      let result: true | ValidateError = true
      for (let key in objectType) {
        const field = objectType[key]
        const jsonType = getInstance(field as any)
        if (isBaseJSONType(jsonType)) {
          // @ts-ignore
          result = validate(field, input[key])
          if (result !== true) {
            result.message += ` in object.${key}`
            return result
          }
        }
      }
      return true
    }

    const c: Converter<I, T> = (input) => {
      let result: T = {} as T
      for (let key in objectType) {
        // @ts-ignore
        result[key] = convert(objectType[key], input[key])
      }
      return result
    }

    const cv: Converter<T, I> = (input) => {
      let result: I = {} as I
      for (let key of getKeys(objectType)) {
        // @ts-ignore
        result[key] = controvert(objectType[key], input[key])
      }
      return result
    }

    return createTypeFromAnyObject(
      '',
      () => {
        const fileds: ObjectTypeFiled[] = []
        for (const key of getKeys(objectType)) {
          const field = objectType[key]
          if (field instanceof Function) {
            fileds.push(
              createObjectTypeFiled(
                key as string,
                type(field as any),
                desc(field as any)
              )
            )
          }
        }
        return createObjectType(fileds)
      },
      v,
      c,
      cv,
      description
    )
  }

export const ObjectType = createObject

export const createRecord =
  <
    Type extends JSONType<any, any, string>,
    FT = ToType<Type>,
    T = Record<string, FT>
  >(
    item: Type
  ) =>
  () => {
    type I = object
    const description = () => `<${desc(item)}>`
    const v: Validator = <I extends object>(input: I) => {
      let result: true | ValidateError = true
      for (let key in input) {
        result = validate(item, input[key])
        if (typeof result === 'string') {
          return result
        }
      }
      return true
    }

    const c: Converter<I, T> = (input) => {
      let result: T = {} as T
      for (let key of getKeys(input)) {
        // @ts-ignore
        result[key] = convert(item, input[key])
      }
      return result
    }

    const cv: Converter<T, I> = (input) => {
      let result: I = {}
      for (let key in input) {
        // @ts-ignore
        result[key] = controvert(item, input[key])
      }
      return result
    }

    return createTypeFromAnyObject(
      '',
      () => createRecordType(type(item)),
      v,
      c,
      cv,
      description
    )
  }

export const RecordType = createRecord

const STRUCT_TYPE = Symbol('JSON_TYPE_CLASS')

export class StructType implements BaseJSONType<object, any, string> {
  [JSON_TYPE_SYMBOL]: symbol;
  [NAME]: string;
  [TYPE]: () => Type;
  [ORIGIN]: JSONType<any, any, string>;
  [DESCRIPTION]: () => string;
  [VALIDATE]: Validator<object>;
  [CONVERT]: Converter<object, any>;
  [CONTROVERT]: Converter<any, object>;
  [STRUCT_TYPE] = STRUCT_TYPE;

  [NAME] = 'Struct';
  [DESCRIPTION] = () => 'Struct';

  [VALIDATE] = (input: object) => {
    return typeof input === 'object' && input !== null && !Array.isArray(input)
      ? true
      : new ValidateError('object', JSON.stringify(input))
  };

  [CONVERT] = (input: object): any => {
    return input
  };

  [CONTROVERT] = (input: any): object => {
    return input
  }

  constructor() {
    // @ts-ignore
    return ObjectType(this)
  }
}

export type Fields<T extends StructType> = {
  [K in keyof T as K extends string
    ? T[K] extends JSONType<any, any, string>
      ? K
      : never
    : never]: T[K]
}

const instances = new WeakMap<(new () => any) | (() => any), any>()
function getInstance<T extends JSONType<any, any, string>>(Ctro: T): Base<T> {
  const instance = instances.get(Ctro)
  if (instance) {
    return instance
  } else {
    if (Ctro.prototype instanceof StructType) {
      // @ts-ignore
      const obj = ObjectType(new Ctro())
      const struct = NamingWithoutType(Ctro.name, obj)()
      instances.set(Ctro, struct)
      return struct as Base<T>
    } else {
      // @ts-ignore
      const jsonType = Ctro()
      instances.set(Ctro, jsonType)
      return jsonType
    }
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

// const controvert: Converter<Date, string> = (input) => {}

// const createTypeFromString = createDeriveType(StringType)

// const DateType = createTypeFromString(
//   `Date` as const,
//   validate,
//   convert,
//   controvert
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
