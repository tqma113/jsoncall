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
    it('DeriveDeclaration', () => {
      const deriveDeclaration = schema.deriveDefinitions[0]
      expect(deriveDeclaration).toMatchObject({
        name: 'int',
        type: {
          type: 'number',
        },
      })
    })

    describe('Type', () => {
      it('PrimitiveType', () => {
        expect(schema.typeDefinitions[0]).toMatchObject({
          name: 'foo1',
          type: {
            type: 'number',
          },
        })

        expect(schema.typeDefinitions[1]).toMatchObject({
          name: 'foo2',
          type: {
            type: 'boolean',
          },
        })

        expect(schema.typeDefinitions[2]).toMatchObject({
          name: 'foo3',
          type: {
            type: 'null',
          },
        })

        expect(schema.typeDefinitions[3]).toMatchObject({
          name: 'foo4',
          type: {
            type: 'string',
          },
        })
      })

      it('SpecialType', () => {
        expect(schema.typeDefinitions[8]).toMatchObject({
          name: 'foo9',
          type: {
            type: 'any',
          },
        })

        expect(schema.typeDefinitions[9]).toMatchObject({
          name: 'foo10',
          type: {
            type: 'none',
          },
        })
      })

      it('LiteralType', () => {
        expect(schema.typeDefinitions[12]).toMatchObject({
          name: 'foo13',
          type: {
            value: 'foo13',
          },
        })

        expect(schema.typeDefinitions[13]).toMatchObject({
          name: 'foo14',
          type: {
            value: 0,
          },
        })

        expect(schema.typeDefinitions[14]).toMatchObject({
          name: 'foo15',
          type: {
            value: true,
          },
        })

        expect(schema.typeDefinitions[15]).toMatchObject({
          name: 'foo16',
          type: {
            value: false,
          },
        })
      })

      it('ListType', () => {
        expect(schema.typeDefinitions[4]).toMatchObject({
          name: 'foo5',
          type: {
            type: {
              type: 'number',
            },
          },
        })
      })

      it('ObjectType', () => {
        expect(schema.typeDefinitions[5]).toMatchObject({
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
        expect(schema.typeDefinitions[6]).toMatchObject({
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
        expect(schema.typeDefinitions[7]).toMatchObject({
          name: 'foo8',
          type: {
            type: {
              type: 'number',
            },
          },
        })
      })

      it('UnionType', () => {
        expect(schema.typeDefinitions[10]).toMatchObject({
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
        expect(schema.typeDefinitions[11]).toMatchObject({
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

  it('schema', () => {
    expect(check(schema)).toBe(null)
  })
})
