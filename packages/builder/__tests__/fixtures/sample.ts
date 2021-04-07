import {
  NumberType,
  BooleanType,
  NullType,
  StringType,
  ListType,
  ObjectType,
  Tuple,
  AnyType,
  NoneType,
  Union,
  Intersection,
  Literal,
  JSONType,
  createJSONCallType,
} from 'jc-builder'

type FooDerive = {
  int: JSONType<any, any, string>
  Date: JSONType<any, any, string>
}

const createJSONCall = (fooDerive: FooDerive) => {
  const getFooModule = ({ int, Date }: FooDerive) => {
    const foo1 = NumberType
    const foo2 = BooleanType
    const foo3 = NullType
    const foo4 = StringType

    const foo5 = ListType(NumberType)
    const foo6 = ObjectType({
      foo: NumberType,
    })
    const foo7 = Tuple(NumberType, StringType)

    const foo8 = AnyType
    const foo9 = NoneType

    const foo10 = Union(NumberType, StringType)
    const foo11 = Intersection(
      ObjectType({
        foo: StringType,
      }),
      ObjectType({
        bar: NumberType,
      })
    )

    const foo12 = Literal('foo12')
    const foo13 = Literal(0)
    const foo14 = Literal(true)
    const foo15 = Literal(false)

    return {
      id: 'foo',
      type: {
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
        int,
        Date,
      },
      call: {},
    } as const
  }

  const getBarModule = () => {
    const foo = fooModule.type.foo6

    const bar = ObjectType({
      bar: StringType,
    })

    const fooAndBar = Intersection(foo, bar)

    return {
      id: 'foo',
      type: {
        bar,
        fooAndBar,
      },
      call: {},
    } as const
  }

  const getBazModule = () => {
    const foo = fooModule.type.foo6
    const bar = barModule.type.bar
    const fooAndBar = barModule.type.fooAndBar

    const baz = ObjectType({
      bar: BooleanType,
    })

    const fooAndBaz = Intersection(foo, baz)
    const fooAndBarAndBaz = Intersection(foo, bar, baz)

    const bazCallInput = fooAndBarAndBaz
    const bazCallOutput = baz
    const bazCall = createJSONCallType('bazCall', bazCallInput, bazCallOutput)

    const barCallInput = fooAndBar
    const barCallOutput = bar
    const barCall = createJSONCallType('barCall', barCallInput, barCallOutput)

    const fooCallInput = fooAndBaz
    const fooCallOutput = foo
    const fooCall = createJSONCallType('barCall', fooCallInput, fooCallOutput)

    return {
      id: 'foo',
      type: {
        foo,
        bar,
        baz,
        fooAndBarAndBaz,
        fooAndBar,
        fooAndBaz,
      },
      call: {
        bazCall,
        barCall,
        fooCall,
      },
    } as const
  }

  const fooModule = getFooModule(fooDerive)
  const barModule = getBarModule()
  const bazModule = getBazModule()

  return {
    modules: [fooModule, barModule, bazModule] as const,
    entry: fooModule,
  } as const
}

export default createJSONCall
