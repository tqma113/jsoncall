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

const createJSONCallModule = (fooDerive: FooDerive) => {
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
    }
  }
  const fooModule = getFooModule(fooDerive)

  const getBarModule = () => {
    const foo = fooModule.foo6

    const bar = ObjectType({
      bar: StringType,
    })

    const fooAndBar = Intersection(foo, bar)

    return {
      bar,
      fooAndBar,
    }
  }
  const barModule = getBarModule()

  const getBazModule = () => {
    const foo = fooModule.foo6
    const bar = barModule.bar
    const fooAndBar = barModule.fooAndBar

    const baz = ObjectType({
      bar: BooleanType,
    })

    const fooAndBaz = Intersection(foo, baz)
    const fooAndBarAndBaz = Intersection(foo, bar, baz)

    return {
      foo,
      bar,
      baz,
      fooAndBarAndBaz,
      fooAndBar,
      fooAndBaz,
    }
  }
  const bazModule = getBazModule()

  const bazCall = createJSONCallType(
    'bazCall',
    bazModule.fooAndBarAndBaz,
    bazModule.baz
  )
  const barCall = createJSONCallType(
    'barCall',
    bazModule.fooAndBar,
    bazModule.bar
  )
  const fooCall = createJSONCallType(
    'barCall',
    bazModule.fooAndBaz,
    bazModule.foo
  )

  return {
    bazCall,
    barCall,
    fooCall,
  }
}

export default createJSONCallModule
