import {
  NumberType,
  BooleanType,
  NullType,
  StringType,
  ListType,
  ObjectType,
  Tuple,
  RecordType,
  AnyType,
  NoneType,
  Union,
  Intersection,
  Literal,
  JSONType,
  createJSONCallType,
  Naming,
  createDeriveType,
  ValidateError,
  type,
} from 'jc-builder'
import { createJSONCall, AsyncSender, createSender } from '../../../src'
import type { Serialize, Deserialize } from 'jc-serialization'

const createBuilderSchema = <I, II>(fooDerives: {
  int: JSONType<any, I, string>
  Date: JSONType<any, II, string>
}) => {
  const getFooModule = <I, II>({
    int,
    Date,
  }: {
    int: JSONType<any, I, string>
    Date: JSONType<any, II, string>
  }) => {
    const foo1 = Naming('foo1', NumberType)
    const foo2 = Naming('foo2', BooleanType)
    const foo3 = Naming('foo3', NullType)
    const foo4 = Naming('foo4', StringType)

    const foo5 = Naming('foo5', ListType(NumberType))
    const foo6 = Naming(
      'foo6',
      ObjectType({
        foo: NumberType,
      })
    )
    const foo7 = Naming('foo7', Tuple(NumberType, StringType))
    const foo8 = Naming('foo8', RecordType(NumberType))

    const foo9 = Naming('foo9', AnyType)
    const foo10 = Naming('foo10', NoneType)

    const foo11 = Naming('foo11', Union(NumberType, StringType))
    const foo12 = Naming(
      'foo12',
      Intersection(
        ObjectType({
          foo: StringType,
        }),
        ObjectType({
          bar: NumberType,
        })
      )
    )

    const foo13 = Naming('foo13', Literal('foo13'))
    const foo14 = Naming('foo14', Literal(0))
    const foo15 = Naming('foo15', Literal(true))
    const foo16 = Naming('foo16', Literal(false))

    return {
      id: 'foo',
      links: [],
      types: {
        foo1,
        foo2,
        foo3,
        foo4,
        foo5,
        foo6,
        foo7,
        foo8,
        foo9,
        foo10,
        foo11,
        foo12,
        foo13,
        foo14,
        foo15,
        foo16,
      },
      derives: {
        int,
        Date,
      },
      exports: {
        foo1,
        foo2,
        foo3,
        foo4,
        foo5,
        foo6,
        foo7,
        foo8,
        foo9,
        foo10,
        foo11,
        foo12,
        foo13,
        foo14,
        foo15,
        foo16,
        int,
        Date,
      },
      calls: {},
    } as const
  }
  const fooModule = getFooModule(fooDerives)

  const getBarModule = () => {
    const foo = Naming('foo', fooModule.exports.foo6)

    const bar = Naming(
      'bar',
      ObjectType({
        bar: StringType,
      })
    )

    const fooAndBar = Naming('fooAndBar', Intersection(foo, bar))

    return {
      id: 'bar',
      links: [
        {
          types: [
            {
              type: 'foo6',
              as: 'foo',
            },
          ],
          module: 'foo',
        },
      ],
      types: {
        bar,
        fooAndBar,
      },
      derives: {},
      exports: {
        bar,
        fooAndBar,
      },
      calls: {},
    } as const
  }
  const barModule = getBarModule()

  const getBazModule = () => {
    const foo = Naming('foo', fooModule.exports.foo6)
    const bar = Naming('bar', barModule.exports.bar)
    const fooAndBar = Naming('fooAndBar', barModule.exports.fooAndBar)

    const baz = Naming(
      'baz',
      ObjectType({
        bar: BooleanType,
      })
    )

    const fooAndBaz = Naming('fooAndBaz', Intersection(foo, baz))
    const fooAndBarAndBaz = Naming(
      'fooAndBarAndBaz',
      Intersection(foo, bar, baz)
    )

    const bazCall = createJSONCallType('bazCall', fooAndBarAndBaz, baz)
    const barCall = createJSONCallType('barCall', fooAndBar, bar)
    const fooCall = createJSONCallType('fooCall', fooAndBaz, foo)

    return {
      id: 'baz',
      links: [
        {
          types: [
            {
              type: 'foo6',
              as: 'foo',
            },
          ],
          module: 'foo',
        },
        {
          types: [
            {
              type: 'bar',
              as: 'bar',
            },
            {
              type: 'fooAndBar',
              as: 'fooAndBar',
            },
          ],
          module: 'bar',
        },
      ],
      types: {
        baz,
        fooAndBaz,
        fooAndBarAndBaz,
      },
      derives: {},
      exports: {
        foo,
        bar,
        baz,
        fooAndBar,
        fooAndBaz,
        fooAndBarAndBaz,
      },
      calls: {
        bazCall,
        barCall,
        fooCall,
      },
    } as const
  }
  const bazModule = getBazModule()

  return {
    entry: 'baz',
    modules: {
      foo: fooModule,
      bar: barModule,
      baz: bazModule,
    },
    calls: bazModule.calls,
  } as const
}

export const createCalls = <I, II>(
  fooDerives: {
    int: JSONType<any, I, string>
    Date: JSONType<any, II, string>
  },
  serialize: Serialize<any>,
  deserialize: Deserialize<any>,
  send: AsyncSender
) => {
  const builderSchema = createBuilderSchema(fooDerives)
  return {
    fooCall: createJSONCall(
      builderSchema.calls.fooCall,
      serialize,
      deserialize,
      createSender(send, serialize, deserialize)
    ),
    barCall: createJSONCall(
      builderSchema.calls.barCall,
      serialize,
      deserialize,
      createSender(send, serialize, deserialize)
    ),
    bazCall: createJSONCall(
      builderSchema.calls.bazCall,
      serialize,
      deserialize,
      createSender(send, serialize, deserialize)
    ),
  }
}

export default createCalls

// const int = createDeriveType(NumberType)(
//   'int' as const,
//   type(NumberType),
//   (input) => {
//     if (Number.isInteger(input)) {
//       return true
//     } else {
//       return new ValidateError('int', JSON.stringify(input))
//     }
//   },
//   (input) => {
//     return input
//   },
//   (input) => {
//     return input
//   },
//   'int'
// )
// const DateType = createDeriveType(Union(StringType, NumberType))(
//   'Date' as const,
//   type(Union(StringType, NumberType)),
//   (input) => {
//     const date = new Date(input)
//     if (isNaN(date.getTime())) {
//       return true
//     } else {
//       return new ValidateError('Date', JSON.stringify(input))
//     }
//   },
//   (input) => {
//     return new Date(input)
//   },
//   (input) => {
//     return input.getTime()
//   },
//   'Date'
// )

// const calls = createCalls({ int, Date: DateType }, JSON.stringify, JSON.parse, async (input) => input)
