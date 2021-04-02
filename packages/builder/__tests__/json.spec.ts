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
  validate,
} from '../src/index'

describe('builder>json', () => {
  describe('primitive', () => {
    it('StringType', () => {
      expect(validate(StringType, 'foo')).toBeTruthy()
      expect(validate(StringType, 0)).toBe('expected string, accept: 0')
      expect(validate(StringType, true)).toBe('expected string, accept: true')
      expect(validate(StringType, null)).toBe('expected string, accept: null')
      expect(validate(StringType, {})).toBe('expected string, accept: {}')
      expect(validate(StringType, [])).toBe('expected string, accept: []')
      expect(validate(StringType, undefined)).toBe(
        'expected string, accept: undefined'
      )
    })

    it('NumberType', () => {
      expect(validate(NumberType, 'foo')).toBe('expected number, accept: "foo"')
      expect(validate(NumberType, 0)).toBeTruthy()
      expect(validate(NumberType, true)).toBe('expected number, accept: true')
      expect(validate(NumberType, null)).toBe('expected number, accept: null')
      expect(validate(NumberType, {})).toBe('expected number, accept: {}')
      expect(validate(NumberType, [])).toBe('expected number, accept: []')
      expect(validate(NumberType, undefined)).toBe(
        'expected number, accept: undefined'
      )
    })

    it('BooleanType', () => {
      expect(validate(BooleanType, 'foo')).toBe(
        'expected boolean, accept: "foo"'
      )
      expect(validate(BooleanType, 0)).toBe('expected boolean, accept: 0')
      expect(validate(BooleanType, true)).toBeTruthy()
      expect(validate(BooleanType, null)).toBe('expected boolean, accept: null')
      expect(validate(BooleanType, {})).toBe('expected boolean, accept: {}')
      expect(validate(BooleanType, [])).toBe('expected boolean, accept: []')
      expect(validate(BooleanType, undefined)).toBe(
        'expected boolean, accept: undefined'
      )
    })

    it('NullType', () => {
      expect(validate(NullType, 'foo')).toBe('expected null, accept: "foo"')
      expect(validate(NullType, 0)).toBe('expected null, accept: 0')
      expect(validate(NullType, true)).toBe('expected null, accept: true')
      expect(validate(NullType, null)).toBeTruthy()
      expect(validate(NullType, {})).toBe('expected null, accept: {}')
      expect(validate(NullType, [])).toBe('expected null, accept: []')
      expect(validate(NullType, undefined)).toBe(
        'expected null, accept: undefined'
      )
    })

    it('AnyObjectType', () => {
      expect(validate(AnyObjectType, 'foo')).toBe(
        'expected object, accept: "foo"'
      )
      expect(validate(AnyObjectType, 0)).toBe('expected object, accept: 0')
      expect(validate(AnyObjectType, true)).toBe(
        'expected object, accept: true'
      )
      expect(validate(AnyObjectType, null)).toBe(
        'expected object, accept: null'
      )
      expect(validate(AnyObjectType, {})).toBeTruthy()
      expect(validate(AnyObjectType, [])).toBe('expected object, accept: []')
      expect(validate(AnyObjectType, undefined)).toBe(
        'expected object, accept: undefined'
      )
    })

    it('AnyListType', () => {
      expect(validate(AnyListType, 'foo')).toBe('expected list, accept: "foo"')
      expect(validate(AnyListType, 0)).toBe('expected list, accept: 0')
      expect(validate(AnyListType, true)).toBe('expected list, accept: true')
      expect(validate(AnyListType, null)).toBe('expected list, accept: null')
      expect(validate(AnyListType, {})).toBe('expected list, accept: {}')
      expect(validate(AnyListType, [])).toBeTruthy()
      expect(validate(AnyListType, undefined)).toBe(
        'expected list, accept: undefined'
      )
    })

    it('AnyType', () => {
      expect(validate(AnyType, 'foo')).toBeTruthy()
      expect(validate(AnyType, 0)).toBeTruthy()
      expect(validate(AnyType, true)).toBeTruthy()
      expect(validate(AnyType, null)).toBeTruthy()
      expect(validate(AnyType, {})).toBeTruthy()
      expect(validate(AnyType, [])).toBeTruthy()
      expect(validate(AnyType, undefined)).toBeTruthy()
    })

    it('NoneType', () => {
      expect(validate(NoneType, 'foo')).toBe(
        'expected undefined, accept: "foo"'
      )
      expect(validate(NoneType, 0)).toBe('expected undefined, accept: 0')
      expect(validate(NoneType, true)).toBe('expected undefined, accept: true')
      expect(validate(NoneType, null)).toBe('expected undefined, accept: null')
      expect(validate(NoneType, {})).toBe('expected undefined, accept: {}')
      expect(validate(NoneType, [])).toBe('expected undefined, accept: []')
      expect(validate(NoneType, undefined)).toBeTruthy()
    })
  })

  describe('complex', () => {
    describe('Literal', () => {
      it('number', () => {
        const Zero = Literal(0)

        expect(validate(Zero, 0)).toBeTruthy()

        expect(validate(Zero, 'foo')).toBe('expected 0, accept: "foo"')
        expect(validate(Zero, 1)).toBe('expected 0, accept: 1')
        expect(validate(Zero, true)).toBe('expected 0, accept: true')
        expect(validate(Zero, null)).toBe('expected 0, accept: null')
        expect(validate(Zero, {})).toBe('expected 0, accept: {}')
        expect(validate(Zero, [])).toBe('expected 0, accept: []')
        expect(validate(Zero, undefined)).toBe('expected 0, accept: undefined')
      })

      it('string', () => {
        const Foo = Literal('foo')

        expect(validate(Foo, 'foo')).toBeTruthy()

        expect(validate(Foo, 'bar')).toBe('expected "foo", accept: "bar"')
        expect(validate(Foo, 0)).toBe('expected "foo", accept: 0')
        expect(validate(Foo, true)).toBe('expected "foo", accept: true')
        expect(validate(Foo, null)).toBe('expected "foo", accept: null')
        expect(validate(Foo, {})).toBe('expected "foo", accept: {}')
        expect(validate(Foo, [])).toBe('expected "foo", accept: []')
        expect(validate(Foo, undefined)).toBe(
          'expected "foo", accept: undefined'
        )
      })

      it('boolean', () => {
        const True = Literal(true)

        expect(validate(True, true)).toBeTruthy()

        expect(validate(True, 'foo')).toBe('expected true, accept: "foo"')
        expect(validate(True, 0)).toBe('expected true, accept: 0')
        expect(validate(True, false)).toBe('expected true, accept: false')
        expect(validate(True, null)).toBe('expected true, accept: null')
        expect(validate(True, {})).toBe('expected true, accept: {}')
        expect(validate(True, [])).toBe('expected true, accept: []')
        expect(validate(True, undefined)).toBe(
          'expected true, accept: undefined'
        )
      })

      it('null', () => {
        const Null = Literal(null)

        expect(validate(Null, null)).toBeTruthy()

        expect(validate(Null, 'foo')).toBe('expected null, accept: "foo"')
        expect(validate(Null, 0)).toBe('expected null, accept: 0')
        expect(validate(Null, false)).toBe('expected null, accept: false')
        expect(validate(Null, {})).toBe('expected null, accept: {}')
        expect(validate(Null, [])).toBe('expected null, accept: []')
        expect(validate(Null, undefined)).toBe(
          'expected null, accept: undefined'
        )
      })

      it('object', () => {
        const Obj = Literal({})

        expect(validate(Obj, {})).toBeTruthy()

        expect(validate(Obj, 'foo')).toBe('expected {}, accept: "foo"')
        expect(validate(Obj, 0)).toBe('expected {}, accept: 0')
        expect(validate(Obj, false)).toBe('expected {}, accept: false')
        expect(validate(Obj, null)).toBe('expected {}, accept: null')
        expect(validate(Obj, { foo: 0 })).toBe('expected {}, accept: {"foo":0}')
        expect(validate(Obj, [])).toBe('expected {}, accept: []')
        expect(validate(Obj, undefined)).toBe('expected {}, accept: undefined')
      })

      it('list', () => {
        const List = Literal([])

        expect(validate(List, [])).toBeTruthy()

        expect(validate(List, 'foo')).toBe('expected [], accept: "foo"')
        expect(validate(List, 0)).toBe('expected [], accept: 0')
        expect(validate(List, false)).toBe('expected [], accept: false')
        expect(validate(List, null)).toBe('expected [], accept: null')
        expect(validate(List, {})).toBe('expected [], accept: {}')
        expect(validate(List, [0])).toBe('expected [], accept: [0]')
        expect(validate(List, undefined)).toBe('expected [], accept: undefined')
      })

      it('undefined', () => {
        const Undefined = Literal(undefined)

        expect(validate(Undefined, undefined)).toBeTruthy()

        expect(validate(Undefined, 'foo')).toBe(
          'expected undefined, accept: "foo"'
        )
        expect(validate(Undefined, 0)).toBe('expected undefined, accept: 0')
        expect(validate(Undefined, false)).toBe(
          'expected undefined, accept: false'
        )
        expect(validate(Undefined, null)).toBe(
          'expected undefined, accept: null'
        )
        expect(validate(Undefined, {})).toBe('expected undefined, accept: {}')
        expect(validate(Undefined, [])).toBe('expected undefined, accept: []')
      })
    })

    describe('ListType', () => {
      it('simple', () => {
        const NumberList = ListType(NumberType)

        expect(validate(NumberList, [])).toBeTruthy()
        expect(validate(NumberList, [0])).toBeTruthy()
        expect(validate(NumberList, [0, 1])).toBeTruthy()
        expect(validate(NumberList, [0, 1, 2])).toBeTruthy()

        expect(validate(NumberList, ['foo'])).toBe(
          'expected number, accept: "foo" in list'
        )
        expect(validate(NumberList, [false])).toBe(
          'expected number, accept: false in list'
        )
        expect(validate(NumberList, [null])).toBe(
          'expected number, accept: null in list'
        )
        expect(validate(NumberList, [{}])).toBe(
          'expected number, accept: {} in list'
        )
        expect(validate(NumberList, [[]])).toBe(
          'expected number, accept: [] in list'
        )
        expect(validate(NumberList, [undefined])).toBe(
          'expected number, accept: undefined in list'
        )

        expect(validate(NumberList, 'foo')).toBe('expected list, accept: "foo"')
        expect(validate(NumberList, 0)).toBe('expected list, accept: 0')
        expect(validate(NumberList, true)).toBe('expected list, accept: true')
        expect(validate(NumberList, null)).toBe('expected list, accept: null')
        expect(validate(NumberList, {})).toBe('expected list, accept: {}')
        expect(validate(NumberList, undefined)).toBe(
          'expected list, accept: undefined'
        )
      })
    })

    describe('Tuple', () => {
      it('simple', () => {
        const NumberAndString = Tuple(NumberType, StringType)

        expect(validate(NumberAndString, [0, 'foo'])).toBeTruthy()

        expect(validate(NumberAndString, [])).toBe(
          'expected [number, string], accept: []'
        )
        expect(validate(NumberAndString, [0])).toBe(
          'expected [number, string], accept: [0]'
        )
        expect(validate(NumberAndString, [0, 1])).toBe(
          'expected [number, string], accept: [0,1]'
        )
        expect(validate(NumberAndString, ['foo', 'bar'])).toBe(
          'expected [number, string], accept: ["foo","bar"]'
        )

        expect(validate(NumberAndString, 'foo')).toBe(
          'expected list, accept: "foo"'
        )
        expect(validate(NumberAndString, 0)).toBe('expected list, accept: 0')
        expect(validate(NumberAndString, false)).toBe(
          'expected list, accept: false'
        )
        expect(validate(NumberAndString, null)).toBe(
          'expected list, accept: null'
        )
        expect(validate(NumberAndString, {})).toBe('expected list, accept: {}')
        expect(validate(NumberAndString, undefined)).toBe(
          'expected list, accept: undefined'
        )
      })
    })

    describe('ObjectType', () => {
      it('simple', () => {
        const FooAndBar = ObjectType({ foo: NumberType, bar: StringType })

        expect(validate(FooAndBar, { foo: 0, bar: 'bar' })).toBeTruthy()

        expect(validate(FooAndBar, { foo: 0, bar: 1 })).toBe(
          'expected string, accept: 1 in object.bar'
        )

        expect(validate(FooAndBar, 'foo')).toBe(
          'expected object, accept: "foo"'
        )
        expect(validate(FooAndBar, 0)).toBe('expected object, accept: 0')
        expect(validate(FooAndBar, true)).toBe('expected object, accept: true')
        expect(validate(FooAndBar, null)).toBe('expected object, accept: null')
        expect(validate(FooAndBar, [])).toBe('expected object, accept: []')
        expect(validate(FooAndBar, undefined)).toBe(
          'expected object, accept: undefined'
        )
      })
    })

    describe('Union', () => {
      it('simple', () => {
        const NumberOrString = Union(NumberType, StringType)

        expect(validate(NumberOrString, 'foo')).toBeTruthy()
        expect(validate(NumberOrString, 0)).toBeTruthy()

        expect(validate(NumberOrString, false)).toBe(
          'expected number | string, accept: false'
        )
        expect(validate(NumberOrString, null)).toBe(
          'expected number | string, accept: null'
        )
        expect(validate(NumberOrString, {})).toBe(
          'expected number | string, accept: {}'
        )
        expect(validate(NumberOrString, [])).toBe(
          'expected number | string, accept: []'
        )
        expect(validate(NumberOrString, undefined)).toBe(
          'expected number | string, accept: undefined'
        )
      })
    })
  })
})
