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
  BuilderSchema,
  BuilderModule,
  Naming,
} from '../../src'

type FooDerive = {
  int: JSONType<any, any, string>
  Date: JSONType<any, any, string>
}
const createJSONCall = <I, II>(fooDerive: {
  int: JSONType<any, I, string>
  Date: JSONType<any, II, string>
}): BuilderSchema => {
  const getFooModule = ({ int, Date }: FooDerive): BuilderModule => {
    const foo1 = Naming('foo1', NumberType)
    const foo2 = Naming('foo1', BooleanType)
    const foo3 = Naming('foo1', NullType)
    const foo4 = Naming('foo1', StringType)

    const foo5 = Naming('foo5', ListType(NumberType))
    const foo6 = Naming(
      'foo6',
      ObjectType({
        foo: NumberType,
      })
    )
    const foo7 = Naming('foo7', Tuple(NumberType, StringType))
    const foo8 = Naming('foo8', RecordType(NumberType))

    const foo9 = AnyType
    const foo10 = NoneType

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
    }
  }
  const fooModule = getFooModule(fooDerive)

  const getBarModule = (): BuilderModule => {
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
    }
  }
  const barModule = getBarModule()

  const getBazModule = (): BuilderModule => {
    const foo = Naming('foo', fooModule.exports.foo6)
    const bar = barModule.exports.bar
    const fooAndBar = barModule.exports.fooAndBar

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
    }
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
  }
}

export default createJSONCall
