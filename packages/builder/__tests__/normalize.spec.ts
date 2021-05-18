import { check } from 'jc-schema'
import {
  normalize,
  createDeriveType,
  NumberType,
  type,
  ValidateError,
  StringType,
  Union,
  StructType,
  NullType,
} from '../src'
import createBuilderSchema from './fixtures/ts/foo'

describe('normalize', () => {
  const int = () =>
    createDeriveType(NumberType)(
      '' as const,
      () => type(NumberType),
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
      () => 'int'
    )
  const DateType = () =>
    createDeriveType(Union(StringType, NumberType))(
      '' as const,
      () => type(Union(StringType, NumberType)),
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
      () => 'Date'
    )
  const builderSchema = createBuilderSchema({ int, Date: DateType })
  const schema = normalize(builderSchema)

  describe('base', () => {
    const module = schema.modules[0]

    it('TypeDeclaration', () => {
      const typeDeclaration = module.typeDefinitions[0]
      expect(typeDeclaration).toMatchObject({
        name: 'foo1',
        type: {
          type: 'number',
        },
      })
    })

    it('DeriveDeclaration', () => {
      const deriveDeclaration = module.deriveDefinitions[0]
      expect(deriveDeclaration).toMatchObject({
        name: 'int',
        type: {
          type: 'number',
        },
      })
    })

    it('ExportStatement', () => {
      const exportStatement = module.exportDefinition
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
        expect(module.typeDefinitions[0]).toMatchObject({
          name: 'foo1',
          type: {
            type: 'number',
          },
        })

        expect(module.typeDefinitions[1]).toMatchObject({
          name: 'foo2',
          type: {
            type: 'boolean',
          },
        })

        expect(module.typeDefinitions[2]).toMatchObject({
          name: 'foo3',
          type: {
            type: 'null',
          },
        })

        expect(module.typeDefinitions[3]).toMatchObject({
          name: 'foo4',
          type: {
            type: 'string',
          },
        })
      })

      it('SpecialType', () => {
        expect(module.typeDefinitions[8]).toMatchObject({
          name: 'foo9',
          type: {
            type: 'any',
          },
        })

        expect(module.typeDefinitions[9]).toMatchObject({
          name: 'foo10',
          type: {
            type: 'none',
          },
        })
      })

      it('LiteralType', () => {
        expect(module.typeDefinitions[12]).toMatchObject({
          name: 'foo13',
          type: {
            value: 'foo13',
          },
        })

        expect(module.typeDefinitions[13]).toMatchObject({
          name: 'foo14',
          type: {
            value: 0,
          },
        })

        expect(module.typeDefinitions[14]).toMatchObject({
          name: 'foo15',
          type: {
            value: true,
          },
        })

        expect(module.typeDefinitions[15]).toMatchObject({
          name: 'foo16',
          type: {
            value: false,
          },
        })
      })

      it('ListType', () => {
        expect(module.typeDefinitions[4]).toMatchObject({
          name: 'foo5',
          type: {
            type: {
              type: 'number',
            },
          },
        })
      })

      it('ObjectType', () => {
        expect(module.typeDefinitions[5]).toMatchObject({
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
        expect(module.typeDefinitions[6]).toMatchObject({
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
        expect(module.typeDefinitions[7]).toMatchObject({
          name: 'foo8',
          type: {
            type: {
              type: 'number',
            },
          },
        })
      })

      it('UnionType', () => {
        expect(module.typeDefinitions[10]).toMatchObject({
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
        expect(module.typeDefinitions[11]).toMatchObject({
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
        class NestObj extends StructType {
          next = Union(NestObj, NullType)

          foo = NumberType
        }

        expect(type(NestObj)).toMatchObject({
          fields: [
            {
              name: 'next',
              type: {
                types: [
                  {
                    name: 'NestObj',
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
      expect(module1.linkDefinitions.length).toBe(0)
      expect(module1.typeDefinitions.length).toBe(16)
      expect(module1.callDefinitions.length).toBe(0)
      expect(module1.deriveDefinitions.length).toBe(2)
      expect(module1.exportDefinition?.names.length).toBe(18)

      const module2 = schema.modules[1]
      expect(module2.id).toMatch('bar')
      expect(module2.linkDefinitions.length).toBe(1)
      expect(module2.typeDefinitions.length).toBe(2)
      expect(module2.callDefinitions.length).toBe(0)
      expect(module2.deriveDefinitions.length).toBe(0)
      expect(module2.exportDefinition?.names.length).toBe(2)

      const module0 = schema.modules[2]
      expect(module0.id).toMatch('baz')
      expect(module0.linkDefinitions.length).toBe(2)
      expect(module0.typeDefinitions.length).toBe(3)
      expect(module0.callDefinitions.length).toBe(3)
      expect(module0.deriveDefinitions.length).toBe(0)
      expect(module0.exportDefinition?.names.length).toBe(6)
    })

    it('ImportStatement', () => {
      expect(schema.modules[2].linkDefinitions[0]).toMatchObject({
        from: 'foo',
        links: [['foo6', 'foo']],
      })
    })

    it('CallDeclaration', () => {
      const callDeclaration = schema.modules[2].callDefinitions[0]
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
