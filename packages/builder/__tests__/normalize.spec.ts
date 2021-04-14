import { check } from 'jc-schema'
import {
  normalize,
  createDeriveType,
  NumberType,
  type,
  ValidateError,
  StringType,
  Union,
  Struct,
  StructField,
  StructType,
  NullType,
} from '../src'
import createBuilderSchema from './fixtures/ts/foo'

describe('normalize', () => {
  const int = createDeriveType(NumberType)(
    '' as const,
    type(NumberType),
    (input) => {
      if (Number.isInteger(input)) {
        return true
      } else {
        return new ValidateError('int', JSON.stringify(input))
      }
    },
    (input) => {
      return input
    },
    (input) => {
      return input
    },
    'int'
  )
  const DateType = createDeriveType(Union(StringType, NumberType))(
    '' as const,
    type(Union(StringType, NumberType)),
    (input) => {
      const date = new Date(input)
      if (isNaN(date.getTime())) {
        return true
      } else {
        return new ValidateError('Date', JSON.stringify(input))
      }
    },
    (input) => {
      return new Date(input)
    },
    (input) => {
      return input.getTime()
    },
    'Date'
  )
  const builderSchema = createBuilderSchema({ int, Date: DateType })
  const schema = normalize(builderSchema)

  describe('base', () => {
    const module = schema.modules[0]

    it('TypeDeclaration', () => {
      const typeDeclaration = module.typeDefinations[0]
      expect(typeDeclaration).toMatchObject({
        name: 'foo1',
        type: {
          type: 'number',
        },
      })
    })

    it('DeriveDeclaration', () => {
      const deriveDeclaration = module.deriveDefinations[0]
      expect(deriveDeclaration).toMatchObject({
        name: 'int',
        type: {
          type: 'number',
        },
      })
    })

    it('ExportStatement', () => {
      const exportStatement = module.exportDefination
      expect(exportStatement).toMatchObject({
        names: [
          'foo1',
          'foo2',
          'foo3',
          'foo4',
          'foo5',
          'foo6',
          'foo7',
          'foo8',
          'foo9',
          'foo10',
          'foo11',
          'foo12',
          'foo13',
          'foo14',
          'foo15',
          'foo16',
          'int',
          'Date',
        ],
      })
    })

    describe('Type', () => {
      it('PrimitiveType', () => {
        expect(module.typeDefinations[0]).toMatchObject({
          name: 'foo1',
          type: {
            type: 'number',
          },
        })

        expect(module.typeDefinations[1]).toMatchObject({
          name: 'foo2',
          type: {
            type: 'boolean',
          },
        })

        expect(module.typeDefinations[2]).toMatchObject({
          name: 'foo3',
          type: {
            type: 'null',
          },
        })

        expect(module.typeDefinations[3]).toMatchObject({
          name: 'foo4',
          type: {
            type: 'string',
          },
        })
      })

      it('SpecialType', () => {
        expect(module.typeDefinations[8]).toMatchObject({
          name: 'foo9',
          type: {
            type: 'any',
          },
        })

        expect(module.typeDefinations[9]).toMatchObject({
          name: 'foo10',
          type: {
            type: 'none',
          },
        })
      })

      it('LiteralType', () => {
        expect(module.typeDefinations[12]).toMatchObject({
          name: 'foo13',
          type: {
            value: 'foo13',
          },
        })

        expect(module.typeDefinations[13]).toMatchObject({
          name: 'foo14',
          type: {
            value: 0,
          },
        })

        expect(module.typeDefinations[14]).toMatchObject({
          name: 'foo15',
          type: {
            value: true,
          },
        })

        expect(module.typeDefinations[15]).toMatchObject({
          name: 'foo16',
          type: {
            value: false,
          },
        })
      })

      it('ListType', () => {
        expect(module.typeDefinations[4]).toMatchObject({
          name: 'foo5',
          type: {
            type: {
              type: 'number',
            },
          },
        })
      })

      it('ObjectType', () => {
        expect(module.typeDefinations[5]).toMatchObject({
          name: 'foo6',
          type: {
            fields: [
              {
                name: 'foo',
                type: {
                  type: 'number',
                },
              },
            ],
          },
        })
      })

      it('TupleType', () => {
        expect(module.typeDefinations[6]).toMatchObject({
          name: 'foo7',
          type: {
            types: [
              {
                type: 'number',
              },
              {
                type: 'string',
              },
            ],
          },
        })
      })

      it('RecordType', () => {
        expect(module.typeDefinations[7]).toMatchObject({
          name: 'foo8',
          type: {
            type: {
              type: 'number',
            },
          },
        })
      })

      it('UnionType', () => {
        expect(module.typeDefinations[10]).toMatchObject({
          name: 'foo11',
          type: {
            types: [
              {
                type: 'number',
              },
              {
                type: 'string',
              },
            ],
          },
        })
      })

      it('IntersectType', () => {
        expect(module.typeDefinations[11]).toMatchObject({
          name: 'foo12',
          type: {
            types: [
              {
                fields: [
                  {
                    name: 'foo',
                    type: {
                      type: 'string',
                    },
                  },
                ],
              },
              {
                fields: [
                  {
                    name: 'bar',
                    type: {
                      type: 'number',
                    },
                  },
                ],
              },
            ],
          },
        })
      })

      it('Struct', () => {
        class NestObjClass extends StructType {
          next = Union(StructField(NestObjClass), NullType)

          foo = NumberType
        }

        const NestObj = Struct(NestObjClass)

        expect(type(NestObj)).toMatchObject({
          fields: [
            {
              name: 'next',
              type: {
                types: [
                  {
                    name: 'NestObjClass',
                  },
                  {
                    type: 'null',
                  },
                ],
              },
            },
            {
              name: 'foo',
              type: {
                type: 'number',
              },
            },
          ],
        })
      })
    })
  })

  describe('dependency', () => {
    it('schema', () => {
      expect(schema.entry).toMatch('baz')
      expect(schema.modules.length).toBe(3)

      expect(check(schema)).toBe(null)
    })

    it('module', () => {
      const module1 = schema.modules[0]
      expect(module1.id).toMatch('foo')
      expect(module1.linkDefinations.length).toBe(0)
      expect(module1.typeDefinations.length).toBe(16)
      expect(module1.callDefinations.length).toBe(0)
      expect(module1.deriveDefinations.length).toBe(2)
      expect(module1.exportDefination?.names.length).toBe(18)

      const module2 = schema.modules[1]
      expect(module2.id).toMatch('bar')
      expect(module2.linkDefinations.length).toBe(1)
      expect(module2.typeDefinations.length).toBe(2)
      expect(module2.callDefinations.length).toBe(0)
      expect(module2.deriveDefinations.length).toBe(0)
      expect(module2.exportDefination?.names.length).toBe(2)

      const module0 = schema.modules[2]
      expect(module0.id).toMatch('baz')
      expect(module0.linkDefinations.length).toBe(2)
      expect(module0.typeDefinations.length).toBe(3)
      expect(module0.callDefinations.length).toBe(3)
      expect(module0.deriveDefinations.length).toBe(0)
      expect(module0.exportDefination?.names.length).toBe(6)
    })

    it('ImportStatement', () => {
      expect(schema.modules[2].linkDefinations[0]).toMatchObject({
        from: 'foo',
        links: [['foo6', 'foo']],
      })
    })

    it('CallDeclaration', () => {
      const callDeclaration = schema.modules[2].callDefinations[0]
      expect(callDeclaration).toMatchObject({
        name: 'bazCall',
        input: {
          name: 'fooAndBarAndBaz',
        },
        output: {
          name: 'baz',
        },
      })
    })
  })
})
