import {
  StringType,
  NumberType,
  BooleanType,
  NullType,
  AnyObjectType,
  AnyListType,
  AnyType,
  NoneType,
  ListType,
  Tuple,
  ObjectType,
  Literal,
  Union,
  VALIDATE,
} from '../src/index'

describe('constructor>json', () => {
  describe('primitive', () => {
    it('StringType', () => {
      expect(StringType[VALIDATE]('foo')).toBeTruthy()
      expect(StringType[VALIDATE](0)).toBe('expected string, accept: 0')
      expect(StringType[VALIDATE](true)).toBe('expected string, accept: true')
      expect(StringType[VALIDATE](null)).toBe('expected string, accept: null')
      expect(StringType[VALIDATE]({})).toBe('expected string, accept: {}')
      expect(StringType[VALIDATE]([])).toBe('expected string, accept: []')
      expect(StringType[VALIDATE](undefined)).toBe(
        'expected string, accept: undefined'
      )
    })

    it('NumberType', () => {
      expect(NumberType[VALIDATE]('foo')).toBe('expected number, accept: "foo"')
      expect(NumberType[VALIDATE](0)).toBeTruthy()
      expect(NumberType[VALIDATE](true)).toBe('expected number, accept: true')
      expect(NumberType[VALIDATE](null)).toBe('expected number, accept: null')
      expect(NumberType[VALIDATE]({})).toBe('expected number, accept: {}')
      expect(NumberType[VALIDATE]([])).toBe('expected number, accept: []')
      expect(NumberType[VALIDATE](undefined)).toBe(
        'expected number, accept: undefined'
      )
    })

    it('BooleanType', () => {
      expect(BooleanType[VALIDATE]('foo')).toBe(
        'expected boolean, accept: "foo"'
      )
      expect(BooleanType[VALIDATE](0)).toBe('expected boolean, accept: 0')
      expect(BooleanType[VALIDATE](true)).toBeTruthy()
      expect(BooleanType[VALIDATE](null)).toBe('expected boolean, accept: null')
      expect(BooleanType[VALIDATE]({})).toBe('expected boolean, accept: {}')
      expect(BooleanType[VALIDATE]([])).toBe('expected boolean, accept: []')
      expect(BooleanType[VALIDATE](undefined)).toBe(
        'expected boolean, accept: undefined'
      )
    })

    it('NullType', () => {
      expect(NullType[VALIDATE]('foo')).toBe('expected null, accept: "foo"')
      expect(NullType[VALIDATE](0)).toBe('expected null, accept: 0')
      expect(NullType[VALIDATE](true)).toBe('expected null, accept: true')
      expect(NullType[VALIDATE](null)).toBeTruthy()
      expect(NullType[VALIDATE]({})).toBe('expected null, accept: {}')
      expect(NullType[VALIDATE]([])).toBe('expected null, accept: []')
      expect(NullType[VALIDATE](undefined)).toBe(
        'expected null, accept: undefined'
      )
    })

    it('AnyObjectType', () => {
      expect(AnyObjectType[VALIDATE]('foo')).toBe(
        'expected object, accept: "foo"'
      )
      expect(AnyObjectType[VALIDATE](0)).toBe('expected object, accept: 0')
      expect(AnyObjectType[VALIDATE](true)).toBe(
        'expected object, accept: true'
      )
      expect(AnyObjectType[VALIDATE](null)).toBe(
        'expected object, accept: null'
      )
      expect(AnyObjectType[VALIDATE]({})).toBeTruthy()
      expect(AnyObjectType[VALIDATE]([])).toBe('expected object, accept: []')
      expect(AnyObjectType[VALIDATE](undefined)).toBe(
        'expected object, accept: undefined'
      )
    })

    it('AnyListType', () => {
      expect(AnyListType[VALIDATE]('foo')).toBe('expected list, accept: "foo"')
      expect(AnyListType[VALIDATE](0)).toBe('expected list, accept: 0')
      expect(AnyListType[VALIDATE](true)).toBe('expected list, accept: true')
      expect(AnyListType[VALIDATE](null)).toBe('expected list, accept: null')
      expect(AnyListType[VALIDATE]({})).toBe('expected list, accept: {}')
      expect(AnyListType[VALIDATE]([])).toBeTruthy()
      expect(AnyListType[VALIDATE](undefined)).toBe(
        'expected list, accept: undefined'
      )
    })

    it('AnyType', () => {
      expect(AnyType[VALIDATE]('foo')).toBeTruthy()
      expect(AnyType[VALIDATE](0)).toBeTruthy()
      expect(AnyType[VALIDATE](true)).toBeTruthy()
      expect(AnyType[VALIDATE](null)).toBeTruthy()
      expect(AnyType[VALIDATE]({})).toBeTruthy()
      expect(AnyType[VALIDATE]([])).toBeTruthy()
      expect(AnyType[VALIDATE](undefined)).toBeTruthy()
    })

    it('NoneType', () => {
      expect(NoneType[VALIDATE]('foo')).toBe(
        'expected undefined, accept: "foo"'
      )
      expect(NoneType[VALIDATE](0)).toBe('expected undefined, accept: 0')
      expect(NoneType[VALIDATE](true)).toBe('expected undefined, accept: true')
      expect(NoneType[VALIDATE](null)).toBe('expected undefined, accept: null')
      expect(NoneType[VALIDATE]({})).toBe('expected undefined, accept: {}')
      expect(NoneType[VALIDATE]([])).toBe('expected undefined, accept: []')
      expect(NoneType[VALIDATE](undefined)).toBeTruthy()
    })
  })

  describe('complex', () => {
    describe('Literal', () => {
      it('number', () => {
        const Zero = Literal(0)

        expect(Zero[VALIDATE](0)).toBeTruthy()

        expect(Zero[VALIDATE]('foo')).toBe('expected 0, accept: "foo"')
        expect(Zero[VALIDATE](1)).toBe('expected 0, accept: 1')
        expect(Zero[VALIDATE](true)).toBe('expected 0, accept: true')
        expect(Zero[VALIDATE](null)).toBe('expected 0, accept: null')
        expect(Zero[VALIDATE]({})).toBe('expected 0, accept: {}')
        expect(Zero[VALIDATE]([])).toBe('expected 0, accept: []')
        expect(Zero[VALIDATE](undefined)).toBe('expected 0, accept: undefined')
      })

      it('string', () => {
        const Foo = Literal('foo')

        expect(Foo[VALIDATE]('foo')).toBeTruthy()

        expect(Foo[VALIDATE]('bar')).toBe('expected "foo", accept: "bar"')
        expect(Foo[VALIDATE](0)).toBe('expected "foo", accept: 0')
        expect(Foo[VALIDATE](true)).toBe('expected "foo", accept: true')
        expect(Foo[VALIDATE](null)).toBe('expected "foo", accept: null')
        expect(Foo[VALIDATE]({})).toBe('expected "foo", accept: {}')
        expect(Foo[VALIDATE]([])).toBe('expected "foo", accept: []')
        expect(Foo[VALIDATE](undefined)).toBe(
          'expected "foo", accept: undefined'
        )
      })

      it('boolean', () => {
        const True = Literal(true)

        expect(True[VALIDATE](true)).toBeTruthy()

        expect(True[VALIDATE]('foo')).toBe('expected true, accept: "foo"')
        expect(True[VALIDATE](0)).toBe('expected true, accept: 0')
        expect(True[VALIDATE](false)).toBe('expected true, accept: false')
        expect(True[VALIDATE](null)).toBe('expected true, accept: null')
        expect(True[VALIDATE]({})).toBe('expected true, accept: {}')
        expect(True[VALIDATE]([])).toBe('expected true, accept: []')
        expect(True[VALIDATE](undefined)).toBe(
          'expected true, accept: undefined'
        )
      })

      it('null', () => {
        const Null = Literal(null)

        expect(Null[VALIDATE](null)).toBeTruthy()

        expect(Null[VALIDATE]('foo')).toBe('expected null, accept: "foo"')
        expect(Null[VALIDATE](0)).toBe('expected null, accept: 0')
        expect(Null[VALIDATE](false)).toBe('expected null, accept: false')
        expect(Null[VALIDATE]({})).toBe('expected null, accept: {}')
        expect(Null[VALIDATE]([])).toBe('expected null, accept: []')
        expect(Null[VALIDATE](undefined)).toBe(
          'expected null, accept: undefined'
        )
      })

      it('object', () => {
        const Obj = Literal({})

        expect(Obj[VALIDATE]({})).toBeTruthy()

        expect(Obj[VALIDATE]('foo')).toBe('expected {}, accept: "foo"')
        expect(Obj[VALIDATE](0)).toBe('expected {}, accept: 0')
        expect(Obj[VALIDATE](false)).toBe('expected {}, accept: false')
        expect(Obj[VALIDATE](null)).toBe('expected {}, accept: null')
        expect(Obj[VALIDATE]({ foo: 0 })).toBe('expected {}, accept: {"foo":0}')
        expect(Obj[VALIDATE]([])).toBe('expected {}, accept: []')
        expect(Obj[VALIDATE](undefined)).toBe('expected {}, accept: undefined')
      })

      it('list', () => {
        const List = Literal([])

        expect(List[VALIDATE]([])).toBeTruthy()

        expect(List[VALIDATE]('foo')).toBe('expected [], accept: "foo"')
        expect(List[VALIDATE](0)).toBe('expected [], accept: 0')
        expect(List[VALIDATE](false)).toBe('expected [], accept: false')
        expect(List[VALIDATE](null)).toBe('expected [], accept: null')
        expect(List[VALIDATE]({})).toBe('expected [], accept: {}')
        expect(List[VALIDATE]([0])).toBe('expected [], accept: [0]')
        expect(List[VALIDATE](undefined)).toBe('expected [], accept: undefined')
      })

      it('undefined', () => {
        const Undefined = Literal(undefined)

        expect(Undefined[VALIDATE](undefined)).toBeTruthy()

        expect(Undefined[VALIDATE]('foo')).toBe(
          'expected undefined, accept: "foo"'
        )
        expect(Undefined[VALIDATE](0)).toBe('expected undefined, accept: 0')
        expect(Undefined[VALIDATE](false)).toBe(
          'expected undefined, accept: false'
        )
        expect(Undefined[VALIDATE](null)).toBe(
          'expected undefined, accept: null'
        )
        expect(Undefined[VALIDATE]({})).toBe('expected undefined, accept: {}')
        expect(Undefined[VALIDATE]([])).toBe('expected undefined, accept: []')
      })
    })

    describe('ListType', () => {
      it('simple', () => {
        const NumberList = ListType(NumberType)

        expect(NumberList[VALIDATE]([])).toBeTruthy()
        expect(NumberList[VALIDATE]([0])).toBeTruthy()
        expect(NumberList[VALIDATE]([0, 1])).toBeTruthy()
        expect(NumberList[VALIDATE]([0, 1, 2])).toBeTruthy()

        expect(NumberList[VALIDATE](['foo'])).toBe(
          'expected number, accept: "foo" in list'
        )
        expect(NumberList[VALIDATE]([false])).toBe(
          'expected number, accept: false in list'
        )
        expect(NumberList[VALIDATE]([null])).toBe(
          'expected number, accept: null in list'
        )
        expect(NumberList[VALIDATE]([{}])).toBe(
          'expected number, accept: {} in list'
        )
        expect(NumberList[VALIDATE]([[]])).toBe(
          'expected number, accept: [] in list'
        )
        expect(NumberList[VALIDATE]([undefined])).toBe(
          'expected number, accept: undefined in list'
        )

        expect(NumberList[VALIDATE]('foo')).toBe('expected list, accept: "foo"')
        expect(NumberList[VALIDATE](0)).toBe('expected list, accept: 0')
        expect(NumberList[VALIDATE](true)).toBe('expected list, accept: true')
        expect(NumberList[VALIDATE](null)).toBe('expected list, accept: null')
        expect(NumberList[VALIDATE]({})).toBe('expected list, accept: {}')
        expect(NumberList[VALIDATE](undefined)).toBe(
          'expected list, accept: undefined'
        )
      })
    })

    describe('Tuple', () => {
      it('simple', () => {
        const NumberAndString = Tuple(NumberType, StringType)

        expect(NumberAndString[VALIDATE]([0, 'foo'])).toBeTruthy()

        expect(NumberAndString[VALIDATE]([])).toBe(
          'expected [number, string], accept: []'
        )
        expect(NumberAndString[VALIDATE]([0])).toBe(
          'expected [number, string], accept: [0]'
        )
        expect(NumberAndString[VALIDATE]([0, 1])).toBe(
          'expected [number, string], accept: [0,1]'
        )
        expect(NumberAndString[VALIDATE](['foo', 'bar'])).toBe(
          'expected [number, string], accept: ["foo","bar"]'
        )

        expect(NumberAndString[VALIDATE]('foo')).toBe(
          'expected list, accept: "foo"'
        )
        expect(NumberAndString[VALIDATE](0)).toBe('expected list, accept: 0')
        expect(NumberAndString[VALIDATE](false)).toBe(
          'expected list, accept: false'
        )
        expect(NumberAndString[VALIDATE](null)).toBe(
          'expected list, accept: null'
        )
        expect(NumberAndString[VALIDATE]({})).toBe('expected list, accept: {}')
        expect(NumberAndString[VALIDATE](undefined)).toBe(
          'expected list, accept: undefined'
        )
      })
    })

    describe('ObjectType', () => {
      it('simple', () => {
        const FooAndBar = ObjectType({ foo: NumberType, bar: StringType })

        expect(FooAndBar[VALIDATE]({ foo: 0, bar: 'bar' })).toBeTruthy()

        expect(FooAndBar[VALIDATE]({ foo: 0, bar: 1 })).toBe(
          'expected string, accept: 1 in object.bar'
        )

        expect(FooAndBar[VALIDATE]('foo')).toBe(
          'expected object, accept: "foo"'
        )
        expect(FooAndBar[VALIDATE](0)).toBe('expected object, accept: 0')
        expect(FooAndBar[VALIDATE](true)).toBe('expected object, accept: true')
        expect(FooAndBar[VALIDATE](null)).toBe('expected object, accept: null')
        expect(FooAndBar[VALIDATE]([])).toBe('expected object, accept: []')
        expect(FooAndBar[VALIDATE](undefined)).toBe(
          'expected object, accept: undefined'
        )
      })
    })

    describe('Union', () => {
      it('simple', () => {
        const NumberOrString = Union(NumberType, StringType)

        expect(NumberOrString[VALIDATE]('foo')).toBeTruthy()
        expect(NumberOrString[VALIDATE](0)).toBeTruthy()

        expect(NumberOrString[VALIDATE](false)).toBe(
          'expected number | string, accept: false'
        )
        expect(NumberOrString[VALIDATE](null)).toBe(
          'expected number | string, accept: null'
        )
        expect(NumberOrString[VALIDATE]({})).toBe(
          'expected number | string, accept: {}'
        )
        expect(NumberOrString[VALIDATE]([])).toBe(
          'expected number | string, accept: []'
        )
        expect(NumberOrString[VALIDATE](undefined)).toBe(
          'expected number | string, accept: undefined'
        )
      })
    })
  })
})
