import path from 'path'
import { check } from 'jc-schema'
import { load } from '../src'
import { read } from './node'

describe('loader', () => {
  describe('base', () => {
    const moduleId = path.resolve(__dirname, './fixtures/foo.jc')
    const schema = load(moduleId, read)

    it('schema', () => {
      expect(check(schema)).toBe(null)

      expect(schema.typeDefinitions.length).toBe(16)
      expect(schema.callDefinitions.length).toBe(1)
      expect(schema.deriveDefinitions.length).toBe(2)
    })

    it('TypeDeclaration', () => {
      const typeDeclaration = schema.typeDefinitions[0]
      expect(typeDeclaration).toMatchObject({
        name: 'foo1',
        type: {
          type: 'number',
        },
      })
    })

    it('DeriveDeclaration', () => {
      const deriveDeclaration = schema.deriveDefinitions[0]
      expect(deriveDeclaration).toMatchObject({
        name: 'int',
        type: {
          type: 'number',
        },
      })
    })

    it('CallDeclaration', () => {
      const callDeclaration = schema.callDefinitions[0]
      expect(callDeclaration).toMatchObject({
        name: 'fooCall',
        input: {
          type: 'number',
        },
        output: {
          type: 'string',
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
    })
  })
})
