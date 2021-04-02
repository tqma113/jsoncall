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
  Intersection,
  Struct,
  StructType,
  validate,
} from '../src/index'

describe('builder>json', () => {
  describe('primitive', () => {
    it('StringType', () => {
      expect(validate(StringType, 'foo')).toBeTruthy()
      expect(validate(StringType, 0)).toMatchObject({
        expected: 'string',
        accept: '0',
      })
      expect(validate(StringType, true)).toMatchObject({
        expected: 'string',
        accept: 'true',
      })
      expect(validate(StringType, null)).toMatchObject({
        expected: 'string',
        accept: 'null',
      })
      expect(validate(StringType, {})).toMatchObject({
        expected: 'string',
        accept: '{}',
      })
      expect(validate(StringType, [])).toMatchObject({
        expected: 'string',
        accept: '[]',
      })
      expect(validate(StringType, undefined)).toMatchObject({
        expected: 'string',
        accept: undefined,
      })
    })

    it('NumberType', () => {
      expect(validate(NumberType, 'foo')).toMatchObject({
        expected: 'number',
        accept: '"foo"',
      })
      expect(validate(NumberType, 0)).toBeTruthy()
      expect(validate(NumberType, true)).toMatchObject({
        expected: 'number',
        accept: 'true',
      })
      expect(validate(NumberType, null)).toMatchObject({
        expected: 'number',
        accept: 'null',
      })
      expect(validate(NumberType, {})).toMatchObject({
        expected: 'number',
        accept: '{}',
      })
      expect(validate(NumberType, [])).toMatchObject({
        expected: 'number',
        accept: '[]',
      })
      expect(validate(NumberType, undefined)).toMatchObject({
        expected: 'number',
        accept: undefined,
      })
    })

    it('BooleanType', () => {
      expect(validate(BooleanType, 'foo')).toMatchObject({
        expected: 'boolean',
        accept: '"foo"',
      })
      expect(validate(BooleanType, 0)).toMatchObject({
        expected: 'boolean',
        accept: '0',
      })
      expect(validate(BooleanType, true)).toBeTruthy()
      expect(validate(BooleanType, null)).toMatchObject({
        expected: 'boolean',
        accept: 'null',
      })
      expect(validate(BooleanType, {})).toMatchObject({
        expected: 'boolean',
        accept: '{}',
      })
      expect(validate(BooleanType, [])).toMatchObject({
        expected: 'boolean',
        accept: '[]',
      })
      expect(validate(BooleanType, undefined)).toMatchObject({
        expected: 'boolean',
        accept: undefined,
      })
    })

    it('NullType', () => {
      expect(validate(NullType, 'foo')).toMatchObject({
        expected: 'null',
        accept: '"foo"',
      })
      expect(validate(NullType, 0)).toMatchObject({
        expected: 'null',
        accept: '0',
      })
      expect(validate(NullType, true)).toMatchObject({
        expected: 'null',
        accept: 'true',
      })
      expect(validate(NullType, null)).toBeTruthy()
      expect(validate(NullType, {})).toMatchObject({
        expected: 'null',
        accept: '{}',
      })
      expect(validate(NullType, [])).toMatchObject({
        expected: 'null',
        accept: '[]',
      })
      expect(validate(NullType, undefined)).toMatchObject({
        expected: 'null',
        accept: undefined,
      })
    })

    it('AnyObjectType', () => {
      expect(validate(AnyObjectType, 'foo')).toMatchObject({
        expected: 'object',
        accept: '"foo"',
      })
      expect(validate(AnyObjectType, 0)).toMatchObject({
        expected: 'object',
        accept: '0',
      })
      expect(validate(AnyObjectType, true)).toMatchObject({
        expected: 'object',
        accept: 'true',
      })
      expect(validate(AnyObjectType, null)).toMatchObject({
        expected: 'object',
        accept: 'null',
      })
      expect(validate(AnyObjectType, {})).toBeTruthy()
      expect(validate(AnyObjectType, [])).toMatchObject({
        expected: 'object',
        accept: '[]',
      })
      expect(validate(AnyObjectType, undefined)).toMatchObject({
        expected: 'object',
        accept: undefined,
      })
    })

    it('AnyListType', () => {
      expect(validate(AnyListType, 'foo')).toMatchObject({
        expected: 'list',
        accept: '"foo"',
      })
      expect(validate(AnyListType, 0)).toMatchObject({
        expected: 'list',
        accept: '0',
      })
      expect(validate(AnyListType, true)).toMatchObject({
        expected: 'list',
        accept: 'true',
      })
      expect(validate(AnyListType, null)).toMatchObject({
        expected: 'list',
        accept: 'null',
      })
      expect(validate(AnyListType, {})).toMatchObject({
        expected: 'list',
        accept: '{}',
      })
      expect(validate(AnyListType, [])).toBeTruthy()
      expect(validate(AnyListType, undefined)).toMatchObject({
        expected: 'list',
        accept: undefined,
      })
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
      expect(validate(NoneType, 'foo')).toMatchObject({
        expected: 'undefined',
        accept: '"foo"',
      })
      expect(validate(NoneType, 0)).toMatchObject({
        expected: 'undefined',
        accept: '0',
      })
      expect(validate(NoneType, true)).toMatchObject({
        expected: 'undefined',
        accept: 'true',
      })
      expect(validate(NoneType, null)).toMatchObject({
        expected: 'undefined',
        accept: 'null',
      })
      expect(validate(NoneType, {})).toMatchObject({
        expected: 'undefined',
        accept: '{}',
      })
      expect(validate(NoneType, [])).toMatchObject({
        expected: 'undefined',
        accept: '[]',
      })
      expect(validate(NoneType, undefined)).toBeTruthy()
    })
  })

  describe('complex', () => {
    describe('Literal', () => {
      it('number', () => {
        const Zero = Literal(0)

        expect(validate(Zero, 0)).toBeTruthy()

        expect(validate(Zero, 'foo')).toMatchObject({
          expected: '0',
          accept: '"foo"',
        })
        expect(validate(Zero, 1)).toMatchObject({
          expected: '0',
          accept: '1',
        })
        expect(validate(Zero, true)).toMatchObject({
          expected: '0',
          accept: 'true',
        })
        expect(validate(Zero, null)).toMatchObject({
          expected: '0',
          accept: 'null',
        })
        expect(validate(Zero, {})).toMatchObject({
          expected: '0',
          accept: '{}',
        })
        expect(validate(Zero, [])).toMatchObject({
          expected: '0',
          accept: '[]',
        })
        expect(validate(Zero, undefined)).toMatchObject({
          expected: '0',
          accept: undefined,
        })
      })

      it('string', () => {
        const Foo = Literal('foo')

        expect(validate(Foo, 'foo')).toBeTruthy()

        expect(validate(Foo, 'bar')).toMatchObject({
          expected: '"foo"',
          accept: '"bar"',
        })
        expect(validate(Foo, 0)).toMatchObject({
          expected: '"foo"',
          accept: '0',
        })
        expect(validate(Foo, true)).toMatchObject({
          expected: '"foo"',
          accept: 'true',
        })
        expect(validate(Foo, null)).toMatchObject({
          expected: '"foo"',
          accept: 'null',
        })
        expect(validate(Foo, {})).toMatchObject({
          expected: '"foo"',
          accept: '{}',
        })
        expect(validate(Foo, [])).toMatchObject({
          expected: '"foo"',
          accept: '[]',
        })
        expect(validate(Foo, undefined)).toMatchObject({
          expected: '"foo"',
          accept: undefined,
        })
      })

      it('boolean', () => {
        const True = Literal(true)

        expect(validate(True, true)).toBeTruthy()

        expect(validate(True, 'foo')).toMatchObject({
          expected: 'true',
          accept: '"foo"',
        })
        expect(validate(True, 0)).toMatchObject({
          expected: 'true',
          accept: '0',
        })
        expect(validate(True, false)).toMatchObject({
          expected: 'true',
          accept: 'false',
        })
        expect(validate(True, null)).toMatchObject({
          expected: 'true',
          accept: 'null',
        })
        expect(validate(True, {})).toMatchObject({
          expected: 'true',
          accept: '{}',
        })
        expect(validate(True, [])).toMatchObject({
          expected: 'true',
          accept: '[]',
        })
        expect(validate(True, undefined)).toMatchObject({
          expected: 'true',
          accept: undefined,
        })
      })

      it('null', () => {
        const Null = Literal(null)

        expect(validate(Null, null)).toBeTruthy()

        expect(validate(Null, 'foo')).toMatchObject({
          expected: 'null',
          accept: '"foo"',
        })
        expect(validate(Null, 0)).toMatchObject({
          expected: 'null',
          accept: '0',
        })
        expect(validate(Null, true)).toMatchObject({
          expected: 'null',
          accept: 'true',
        })
        expect(validate(Null, {})).toMatchObject({
          expected: 'null',
          accept: '{}',
        })
        expect(validate(Null, [])).toMatchObject({
          expected: 'null',
          accept: '[]',
        })
        expect(validate(Null, undefined)).toMatchObject({
          expected: 'null',
          accept: undefined,
        })
      })

      it('object', () => {
        const Obj = Literal({})

        expect(validate(Obj, {})).toBeTruthy()

        expect(validate(Obj, 'foo')).toMatchObject({
          expected: '{}',
          accept: '"foo"',
        })
        expect(validate(Obj, 0)).toMatchObject({
          expected: '{}',
          accept: '0',
        })
        expect(validate(Obj, true)).toMatchObject({
          expected: '{}',
          accept: 'true',
        })
        expect(validate(Obj, null)).toMatchObject({
          expected: '{}',
          accept: 'null',
        })
        expect(validate(Obj, { foo: 0 })).toMatchObject({
          expected: '{}',
          accept: '{"foo":0}',
        })
        expect(validate(Obj, [])).toMatchObject({
          expected: '{}',
          accept: '[]',
        })
        expect(validate(Obj, undefined)).toMatchObject({
          expected: '{}',
          accept: undefined,
        })
      })

      it('list', () => {
        const List = Literal([])

        expect(validate(List, [])).toBeTruthy()

        expect(validate(List, 'foo')).toMatchObject({
          expected: '[]',
          accept: '"foo"',
        })
        expect(validate(List, 0)).toMatchObject({
          expected: '[]',
          accept: '0',
        })
        expect(validate(List, false)).toMatchObject({
          expected: '[]',
          accept: 'false',
        })
        expect(validate(List, null)).toMatchObject({
          expected: '[]',
          accept: 'null',
        })
        expect(validate(List, {})).toMatchObject({
          expected: '[]',
          accept: '{}',
        })
        expect(validate(List, [0])).toMatchObject({
          expected: '[]',
          accept: '[0]',
        })
        expect(validate(List, undefined)).toMatchObject({
          expected: '[]',
          accept: undefined,
        })
      })

      it('undefined', () => {
        const Undefined = Literal(undefined)

        expect(validate(Undefined, undefined)).toBeTruthy()

        expect(validate(Undefined, 'foo')).toMatchObject({
          expected: undefined,
          accept: '"foo"',
        })
        expect(validate(Undefined, 0)).toMatchObject({
          expected: undefined,
          accept: '0',
        })
        expect(validate(Undefined, true)).toMatchObject({
          expected: undefined,
          accept: 'true',
        })
        expect(validate(Undefined, null)).toMatchObject({
          expected: undefined,
          accept: 'null',
        })
        expect(validate(Undefined, {})).toMatchObject({
          expected: undefined,
          accept: '{}',
        })
        expect(validate(Undefined, [])).toMatchObject({
          expected: undefined,
          accept: '[]',
        })
      })
    })

    describe('ListType', () => {
      it('simple', () => {
        const NumberList = ListType(NumberType)

        expect(validate(NumberList, [])).toBeTruthy()
        expect(validate(NumberList, [0])).toBeTruthy()
        expect(validate(NumberList, [0, 1])).toBeTruthy()
        expect(validate(NumberList, [0, 1, 2])).toBeTruthy()

        expect(validate(NumberList, ['foo'])).toMatchObject({
          expected: 'number',
          accept: '"foo"',
        })
        expect(validate(NumberList, [true])).toMatchObject({
          expected: 'number',
          accept: 'true',
        })
        expect(validate(NumberList, [null])).toMatchObject({
          expected: 'number',
          accept: 'null',
        })
        expect(validate(NumberList, [{}])).toMatchObject({
          expected: 'number',
          accept: '{}',
        })
        expect(validate(NumberList, [[]])).toMatchObject({
          expected: 'number',
          accept: '[]',
        })
        expect(validate(NumberList, [undefined])).toMatchObject({
          expected: 'number',
          accept: undefined,
        })

        expect(validate(NumberList, 'foo')).toMatchObject({
          expected: 'list',
          accept: '"foo"',
        })
        expect(validate(NumberList, 0)).toMatchObject({
          expected: 'list',
          accept: '0',
        })
        expect(validate(NumberList, true)).toMatchObject({
          expected: 'list',
          accept: 'true',
        })
        expect(validate(NumberList, null)).toMatchObject({
          expected: 'list',
          accept: 'null',
        })
        expect(validate(NumberList, {})).toMatchObject({
          expected: 'list',
          accept: '{}',
        })
        expect(validate(NumberList, undefined)).toMatchObject({
          expected: 'list',
          accept: undefined,
        })
      })
    })

    describe('Tuple', () => {
      it('simple', () => {
        const NumberAndString = Tuple(NumberType, StringType)

        expect(validate(NumberAndString, [0, 'foo'])).toBeTruthy()

        expect(validate(NumberAndString, [])).toMatchObject({
          expected: '[number, string]',
          accept: '[]',
        })
        expect(validate(NumberAndString, [0])).toMatchObject({
          expected: '[number, string]',
          accept: '[0]',
        })
        expect(validate(NumberAndString, [0, 1])).toMatchObject({
          expected: '[number, string]',
          accept: '[0,1]',
        })
        expect(validate(NumberAndString, ['foo', 'bar'])).toMatchObject({
          expected: '[number, string]',
          accept: '["foo","bar"]',
        })

        expect(validate(NumberAndString, 'foo')).toMatchObject({
          expected: 'list',
          accept: '"foo"',
        })
        expect(validate(NumberAndString, 0)).toMatchObject({
          expected: 'list',
          accept: '0',
        })
        expect(validate(NumberAndString, true)).toMatchObject({
          expected: 'list',
          accept: 'true',
        })
        expect(validate(NumberAndString, null)).toMatchObject({
          expected: 'list',
          accept: 'null',
        })
        expect(validate(NumberAndString, {})).toMatchObject({
          expected: 'list',
          accept: '{}',
        })
        expect(validate(NumberAndString, undefined)).toMatchObject({
          expected: 'list',
          accept: undefined,
        })
      })
    })

    describe('ObjectType', () => {
      it('simple', () => {
        const FooAndBar = ObjectType({ foo: NumberType, bar: StringType })

        expect(validate(FooAndBar, { foo: 0, bar: 'bar' })).toBeTruthy()

        expect(validate(FooAndBar, { foo: 0, bar: 1 })).toMatchObject({
          expected: 'string',
          accept: '1',
        })

        expect(validate(FooAndBar, 'foo')).toMatchObject({
          expected: 'object',
          accept: '"foo"',
        })
        expect(validate(FooAndBar, 0)).toMatchObject({
          expected: 'object',
          accept: '0',
        })
        expect(validate(FooAndBar, true)).toMatchObject({
          expected: 'object',
          accept: 'true',
        })
        expect(validate(FooAndBar, null)).toMatchObject({
          expected: 'object',
          accept: 'null',
        })
        expect(validate(FooAndBar, [])).toMatchObject({
          expected: 'object',
          accept: '[]',
        })
        expect(validate(FooAndBar, undefined)).toMatchObject({
          expected: 'object',
          accept: undefined,
        })
      })
    })

    describe('Union', () => {
      it('simple', () => {
        const NumberOrString = Union(NumberType, StringType)

        expect(validate(NumberOrString, 'foo')).toBeTruthy()
        expect(validate(NumberOrString, 0)).toBeTruthy()

        expect(validate(NumberOrString, true)).toMatchObject({
          expected: 'number | string',
          accept: 'true',
        })
        expect(validate(NumberOrString, null)).toMatchObject({
          expected: 'number | string',
          accept: 'null',
        })
        expect(validate(NumberOrString, {})).toMatchObject({
          expected: 'number | string',
          accept: '{}',
        })
        expect(validate(NumberOrString, [])).toMatchObject({
          expected: 'number | string',
          accept: '[]',
        })
        expect(validate(NumberOrString, undefined)).toMatchObject({
          expected: 'number | string',
          accept: undefined,
        })
      })
    })

    describe('Intersection', () => {
      it('simple', () => {
        const FooAndBar = Intersection(
          ObjectType({ foo: NumberType }),
          ObjectType({ bar: StringType })
        )

        expect(validate(FooAndBar, { foo: 0, bar: 'bar' })).toBeTruthy()

        expect(validate(FooAndBar, 'foo')).toMatchObject({
          expected: '{foo: number} & {bar: string}',
          accept: '"foo"',
        })
        expect(validate(FooAndBar, true)).toMatchObject({
          expected: '{foo: number} & {bar: string}',
          accept: 'true',
        })
        expect(validate(FooAndBar, null)).toMatchObject({
          expected: '{foo: number} & {bar: string}',
          accept: 'null',
        })
        expect(validate(FooAndBar, {})).toMatchObject({
          expected: '{foo: number} & {bar: string}',
          accept: '{}',
        })
        expect(validate(FooAndBar, [])).toMatchObject({
          expected: '{foo: number} & {bar: string}',
          accept: '[]',
        })
        expect(validate(FooAndBar, undefined)).toMatchObject({
          expected: '{foo: number} & {bar: string}',
          accept: undefined,
        })
      })
    })

    describe('Struct', () => {
      it('simple', () => {
        class FooAndBarClass extends StructType {
          foo = NumberType

          bar = StringType
        }

        const FooAndBar = Struct(FooAndBarClass)

        expect(validate(FooAndBar, { foo: 0, bar: 'bar' })).toBeTruthy()

        expect(validate(FooAndBar, { foo: 0, bar: 1 })).toMatchObject({
          expected: 'string',
          accept: '1',
        })

        expect(validate(FooAndBar, 'foo')).toMatchObject({
          expected: 'object',
          accept: '"foo"',
        })
        expect(validate(FooAndBar, 0)).toMatchObject({
          expected: 'object',
          accept: '0',
        })
        expect(validate(FooAndBar, true)).toMatchObject({
          expected: 'object',
          accept: 'true',
        })
        expect(validate(FooAndBar, null)).toMatchObject({
          expected: 'object',
          accept: 'null',
        })
        expect(validate(FooAndBar, [])).toMatchObject({
          expected: 'object',
          accept: '[]',
        })
        expect(validate(FooAndBar, undefined)).toMatchObject({
          expected: 'object',
          accept: undefined,
        })
      })
    })
  })
})
