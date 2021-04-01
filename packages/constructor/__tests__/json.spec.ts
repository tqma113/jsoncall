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
} from '../index'

describe('constructor>json', () => {
  describe('primitive', () => {
    it('StringType', () => {
      expect(StringType.validate('foo')).toBeTruthy()
      expect(StringType.validate(0)).toBe('expected string, accept: 0')
      expect(StringType.validate(true)).toBe('expected string, accept: true')
      expect(StringType.validate(null)).toBe('expected string, accept: null')
      expect(StringType.validate({})).toBe('expected string, accept: {}')
      expect(StringType.validate([])).toBe('expected string, accept: []')
      expect(StringType.validate(undefined)).toBe(
        'expected string, accept: undefined'
      )
    })

    it('NumberType', () => {
      expect(NumberType.validate('foo')).toBe('expected number, accept: "foo"')
      expect(NumberType.validate(0)).toBeTruthy()
      expect(NumberType.validate(true)).toBe('expected number, accept: true')
      expect(NumberType.validate(null)).toBe('expected number, accept: null')
      expect(NumberType.validate({})).toBe('expected number, accept: {}')
      expect(NumberType.validate([])).toBe('expected number, accept: []')
      expect(NumberType.validate(undefined)).toBe(
        'expected number, accept: undefined'
      )
    })

    it('BooleanType', () => {
      expect(BooleanType.validate('foo')).toBe(
        'expected boolean, accept: "foo"'
      )
      expect(BooleanType.validate(0)).toBe('expected boolean, accept: 0')
      expect(BooleanType.validate(true)).toBeTruthy()
      expect(BooleanType.validate(null)).toBe('expected boolean, accept: null')
      expect(BooleanType.validate({})).toBe('expected boolean, accept: {}')
      expect(BooleanType.validate([])).toBe('expected boolean, accept: []')
      expect(BooleanType.validate(undefined)).toBe(
        'expected boolean, accept: undefined'
      )
    })

    it('NullType', () => {
      expect(NullType.validate('foo')).toBe('expected null, accept: "foo"')
      expect(NullType.validate(0)).toBe('expected null, accept: 0')
      expect(NullType.validate(true)).toBe('expected null, accept: true')
      expect(NullType.validate(null)).toBeTruthy()
      expect(NullType.validate({})).toBe('expected null, accept: {}')
      expect(NullType.validate([])).toBe('expected null, accept: []')
      expect(NullType.validate(undefined)).toBe(
        'expected null, accept: undefined'
      )
    })

    it('AnyObjectType', () => {
      expect(AnyObjectType.validate('foo')).toBe(
        'expected object, accept: "foo"'
      )
      expect(AnyObjectType.validate(0)).toBe('expected object, accept: 0')
      expect(AnyObjectType.validate(true)).toBe('expected object, accept: true')
      expect(AnyObjectType.validate(null)).toBe('expected object, accept: null')
      expect(AnyObjectType.validate({})).toBeTruthy()
      expect(AnyObjectType.validate([])).toBe('expected object, accept: []')
      expect(AnyObjectType.validate(undefined)).toBe(
        'expected object, accept: undefined'
      )
    })

    it('AnyListType', () => {
      expect(AnyListType.validate('foo')).toBe('expected list, accept: "foo"')
      expect(AnyListType.validate(0)).toBe('expected list, accept: 0')
      expect(AnyListType.validate(true)).toBe('expected list, accept: true')
      expect(AnyListType.validate(null)).toBe('expected list, accept: null')
      expect(AnyListType.validate({})).toBe('expected list, accept: {}')
      expect(AnyListType.validate([])).toBeTruthy()
      expect(AnyListType.validate(undefined)).toBe(
        'expected list, accept: undefined'
      )
    })

    it('AnyType', () => {
      expect(AnyType.validate('foo')).toBeTruthy()
      expect(AnyType.validate(0)).toBeTruthy()
      expect(AnyType.validate(true)).toBeTruthy()
      expect(AnyType.validate(null)).toBeTruthy()
      expect(AnyType.validate({})).toBeTruthy()
      expect(AnyType.validate([])).toBeTruthy()
      expect(AnyType.validate(undefined)).toBeTruthy()
    })

    it('NoneType', () => {
      expect(NoneType.validate('foo')).toBe('expected undefined, accept: "foo"')
      expect(NoneType.validate(0)).toBe('expected undefined, accept: 0')
      expect(NoneType.validate(true)).toBe('expected undefined, accept: true')
      expect(NoneType.validate(null)).toBe('expected undefined, accept: null')
      expect(NoneType.validate({})).toBe('expected undefined, accept: {}')
      expect(NoneType.validate([])).toBe('expected undefined, accept: []')
      expect(NoneType.validate(undefined)).toBeTruthy()
    })
  })

  describe('complex', () => {
    describe('Literal', () => {
      it('number', () => {
        const Zero = Literal(0)

        expect(Zero.validate(0)).toBeTruthy()

        expect(Zero.validate('foo')).toBe('expected 0, accept: "foo"')
        expect(Zero.validate(1)).toBe('expected 0, accept: 1')
        expect(Zero.validate(true)).toBe('expected 0, accept: true')
        expect(Zero.validate(null)).toBe('expected 0, accept: null')
        expect(Zero.validate({})).toBe('expected 0, accept: {}')
        expect(Zero.validate([])).toBe('expected 0, accept: []')
        expect(Zero.validate(undefined)).toBe('expected 0, accept: undefined')
      })

      it('string', () => {
        const Foo = Literal('foo')

        expect(Foo.validate('foo')).toBeTruthy()

        expect(Foo.validate('bar')).toBe('expected "foo", accept: "bar"')
        expect(Foo.validate(0)).toBe('expected "foo", accept: 0')
        expect(Foo.validate(true)).toBe('expected "foo", accept: true')
        expect(Foo.validate(null)).toBe('expected "foo", accept: null')
        expect(Foo.validate({})).toBe('expected "foo", accept: {}')
        expect(Foo.validate([])).toBe('expected "foo", accept: []')
        expect(Foo.validate(undefined)).toBe(
          'expected "foo", accept: undefined'
        )
      })

      it('boolean', () => {
        const True = Literal(true)

        expect(True.validate(true)).toBeTruthy()

        expect(True.validate('foo')).toBe('expected true, accept: "foo"')
        expect(True.validate(0)).toBe('expected true, accept: 0')
        expect(True.validate(false)).toBe('expected true, accept: false')
        expect(True.validate(null)).toBe('expected true, accept: null')
        expect(True.validate({})).toBe('expected true, accept: {}')
        expect(True.validate([])).toBe('expected true, accept: []')
        expect(True.validate(undefined)).toBe(
          'expected true, accept: undefined'
        )
      })

      it('null', () => {
        const Null = Literal(null)

        expect(Null.validate(null)).toBeTruthy()

        expect(Null.validate('foo')).toBe('expected null, accept: "foo"')
        expect(Null.validate(0)).toBe('expected null, accept: 0')
        expect(Null.validate(false)).toBe('expected null, accept: false')
        expect(Null.validate({})).toBe('expected null, accept: {}')
        expect(Null.validate([])).toBe('expected null, accept: []')
        expect(Null.validate(undefined)).toBe(
          'expected null, accept: undefined'
        )
      })

      it('object', () => {
        const Obj = Literal({})

        expect(Obj.validate({})).toBeTruthy()

        expect(Obj.validate('foo')).toBe('expected {}, accept: "foo"')
        expect(Obj.validate(0)).toBe('expected {}, accept: 0')
        expect(Obj.validate(false)).toBe('expected {}, accept: false')
        expect(Obj.validate(null)).toBe('expected {}, accept: null')
        expect(Obj.validate({ foo: 0 })).toBe('expected {}, accept: {"foo":0}')
        expect(Obj.validate([])).toBe('expected {}, accept: []')
        expect(Obj.validate(undefined)).toBe('expected {}, accept: undefined')
      })

      it('list', () => {
        const List = Literal([])

        expect(List.validate([])).toBeTruthy()

        expect(List.validate('foo')).toBe('expected [], accept: "foo"')
        expect(List.validate(0)).toBe('expected [], accept: 0')
        expect(List.validate(false)).toBe('expected [], accept: false')
        expect(List.validate(null)).toBe('expected [], accept: null')
        expect(List.validate({})).toBe('expected [], accept: {}')
        expect(List.validate([0])).toBe('expected [], accept: [0]')
        expect(List.validate(undefined)).toBe('expected [], accept: undefined')
      })

      it('undefined', () => {
        const Undefined = Literal(undefined)

        expect(Undefined.validate(undefined)).toBeTruthy()

        expect(Undefined.validate('foo')).toBe(
          'expected undefined, accept: "foo"'
        )
        expect(Undefined.validate(0)).toBe('expected undefined, accept: 0')
        expect(Undefined.validate(false)).toBe(
          'expected undefined, accept: false'
        )
        expect(Undefined.validate(null)).toBe(
          'expected undefined, accept: null'
        )
        expect(Undefined.validate({})).toBe('expected undefined, accept: {}')
        expect(Undefined.validate([])).toBe('expected undefined, accept: []')
      })
    })

    describe('ListType', () => {
      it('simple', () => {
        const NumberList = ListType(NumberType)

        expect(NumberList.validate([])).toBeTruthy()
        expect(NumberList.validate([0])).toBeTruthy()
        expect(NumberList.validate([0, 1])).toBeTruthy()
        expect(NumberList.validate([0, 1, 2])).toBeTruthy()

        expect(NumberList.validate(['foo'])).toBe(
          'expected number, accept: "foo" in list'
        )
        expect(NumberList.validate([false])).toBe(
          'expected number, accept: false in list'
        )
        expect(NumberList.validate([null])).toBe(
          'expected number, accept: null in list'
        )
        expect(NumberList.validate([{}])).toBe(
          'expected number, accept: {} in list'
        )
        expect(NumberList.validate([[]])).toBe(
          'expected number, accept: [] in list'
        )
        expect(NumberList.validate([undefined])).toBe(
          'expected number, accept: undefined in list'
        )

        expect(NumberList.validate('foo')).toBe('expected list, accept: "foo"')
        expect(NumberList.validate(0)).toBe('expected list, accept: 0')
        expect(NumberList.validate(true)).toBe('expected list, accept: true')
        expect(NumberList.validate(null)).toBe('expected list, accept: null')
        expect(NumberList.validate({})).toBe('expected list, accept: {}')
        expect(NumberList.validate(undefined)).toBe(
          'expected list, accept: undefined'
        )
      })
    })

    describe('Tuple', () => {
      it('simple', () => {
        const NumberAndString = Tuple(NumberType, StringType)

        expect(NumberAndString.validate([0, 'foo'])).toBeTruthy()

        expect(NumberAndString.validate([])).toBe(
          'expected [number, string], accept: []'
        )
        expect(NumberAndString.validate([0])).toBe(
          'expected [number, string], accept: [0]'
        )
        expect(NumberAndString.validate([0, 1])).toBe(
          'expected [number, string], accept: [0,1]'
        )
        expect(NumberAndString.validate(['foo', 'bar'])).toBe(
          'expected [number, string], accept: ["foo","bar"]'
        )

        expect(NumberAndString.validate('foo')).toBe(
          'expected list, accept: "foo"'
        )
        expect(NumberAndString.validate(0)).toBe('expected list, accept: 0')
        expect(NumberAndString.validate(false)).toBe(
          'expected list, accept: false'
        )
        expect(NumberAndString.validate(null)).toBe(
          'expected list, accept: null'
        )
        expect(NumberAndString.validate({})).toBe('expected list, accept: {}')
        expect(NumberAndString.validate(undefined)).toBe(
          'expected list, accept: undefined'
        )
      })
    })

    describe('ObjectType', () => {
      it('simple', () => {
        const FooAndBar = ObjectType({ foo: NumberType, bar: StringType })

        expect(FooAndBar.validate({ foo: 0, bar: 'bar' })).toBeTruthy()

        expect(FooAndBar.validate('foo')).toBe('expected object, accept: "foo"')
        expect(FooAndBar.validate(0)).toBe('expected object, accept: 0')
        expect(FooAndBar.validate(true)).toBe('expected object, accept: true')
        expect(FooAndBar.validate(null)).toBe('expected object, accept: null')
        expect(FooAndBar.validate([])).toBe('expected object, accept: []')
        expect(FooAndBar.validate(undefined)).toBe(
          'expected object, accept: undefined'
        )
      })
    })

    describe('Union', () => {
      it('simple', () => {
        const NumberOrString = Union(NumberType, StringType)

        expect(NumberOrString.validate('foo')).toBeTruthy()
        expect(NumberOrString.validate(0)).toBeTruthy()

        expect(NumberOrString.validate(false)).toBe(
          'expected number | string, accept: false'
        )
        expect(NumberOrString.validate(null)).toBe(
          'expected number | string, accept: null'
        )
        expect(NumberOrString.validate({})).toBe(
          'expected number | string, accept: {}'
        )
        expect(NumberOrString.validate([])).toBe(
          'expected number | string, accept: []'
        )
        expect(NumberOrString.validate(undefined)).toBe(
          'expected number | string, accept: undefined'
        )
      })
    })
  })
})
