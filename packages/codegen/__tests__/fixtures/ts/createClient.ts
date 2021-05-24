import {
  Naming,
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
  createJSONCallType,
  createBuilderSchema,
  JSONType,
} from 'jc-builder'
import {
  createJSONCall,
  createSyncJSONCall,
  AsyncSender,
  SyncSender,
  createSender,
  createBatchSender,
  createSyncSender,
} from 'jc-client'

const createBS = <INTI, DATEI>({
  int,
  Date,
}: {
  int: JSONType<any, INTI, string>
  Date: JSONType<any, DATEI, string>
}) => {
  const foo1 = Naming('foo1', NumberType, 'number')
  const foo2 = Naming('foo2', BooleanType, 'boolean')
  const foo3 = Naming('foo3', NullType, 'null')
  const foo4 = Naming('foo4', StringType, 'string')
  const foo5 = Naming('foo5', ListType(NumberType), '[number]')
  const foo6 = Naming('foo6', ObjectType({ foo: NumberType }), '{foo: number}')
  const foo7 = Naming('foo7', Tuple(NumberType, StringType), '(number, string)')
  const foo8 = Naming('foo8', RecordType(NumberType), '<number>')
  const foo9 = Naming('foo9', AnyType, 'any')
  const foo10 = Naming('foo10', NoneType, 'none')
  const foo11 = Naming(
    'foo11',
    Union(NumberType, StringType),
    'number | string'
  )
  const foo12 = Naming(
    'foo12',
    Intersection(
      ObjectType({ foo: StringType }),
      ObjectType({ bar: NumberType })
    ),
    '{foo: string} & {bar: number}'
  )
  const foo13 = Naming('foo13', Literal('foo13'), '"foo13"')
  const foo14 = Naming('foo14', Literal(0), '0')
  const foo15 = Naming('foo15', Literal(true), 'true')
  const foo16 = Naming('foo16', Literal(false), 'false')
  const bar = Naming('bar', ObjectType({ bar: StringType }), '{bar: string}')
  const baz = Naming('baz', ObjectType({ baz: BooleanType }), '{baz: boolean}')
  const foo = Naming('foo', foo6, '{foo: number}')
  const fooAndBar = Naming(
    'fooAndBar',
    Intersection(foo, bar),
    '{foo: number} & {bar: string}'
  )
  const fooAndBaz = Naming(
    'fooAndBaz',
    Intersection(foo, baz),
    '{foo: number} & {baz: boolean}'
  )
  const fooAndBarAndBaz = Naming(
    'fooAndBarAndBaz',
    Intersection(foo, bar, baz),
    '{foo: number} & {bar: string} & {baz: boolean}'
  )

  const bazCall = createJSONCallType('bazCall', fooAndBarAndBaz, baz)
  const barCall = createJSONCallType('barCall', fooAndBar, bar)
  const fooCall = createJSONCallType('fooCall', fooAndBaz, foo)

  return createBuilderSchema(
    {
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
      bar,
      baz,
      foo,
      fooAndBar,
      fooAndBaz,
      fooAndBarAndBaz,
    },
    {
      int,
      Date,
    },
    {
      bazCall,
      barCall,
      fooCall,
    }
  )
}

export const createClient = <INTI, DATEI>(
  derives: {
    int: JSONType<any, INTI, string>
    Date: JSONType<any, DATEI, string>
  },
  send: AsyncSender
) => {
  const builderSchema = createBS(derives)
  const callSender = createSender(send, JSON.stringify, JSON.parse)

  return {
    bazCall: createJSONCall(
      builderSchema.calls.bazCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
    barCall: createJSONCall(
      builderSchema.calls.barCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
    fooCall: createJSONCall(
      builderSchema.calls.fooCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
  }
}

export const createBatchClient = <INTI, DATEI>(
  derives: {
    int: JSONType<any, INTI, string>
    Date: JSONType<any, DATEI, string>
  },
  send: AsyncSender
) => {
  const builderSchema = createBS(derives)
  const callSender = createBatchSender(send, JSON.stringify, JSON.parse)

  return {
    bazCall: createJSONCall(
      builderSchema.calls.bazCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
    barCall: createJSONCall(
      builderSchema.calls.barCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
    fooCall: createJSONCall(
      builderSchema.calls.fooCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
  }
}

export const createSyncClient = <INTI, DATEI>(
  derives: {
    int: JSONType<any, INTI, string>
    Date: JSONType<any, DATEI, string>
  },
  send: SyncSender
) => {
  const builderSchema = createBS(derives)
  const callSender = createSyncSender(send, JSON.stringify, JSON.parse)

  return {
    bazCall: createSyncJSONCall(
      builderSchema.calls.bazCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
    barCall: createSyncJSONCall(
      builderSchema.calls.barCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
    fooCall: createSyncJSONCall(
      builderSchema.calls.fooCall,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
  }
}
