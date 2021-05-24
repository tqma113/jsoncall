import path from 'path'
import {
  createLiteralType,
  createNameType,
  createObjectType,
  createObjectTypeFiled,
  createSpecialType,
  SpecialTypeEnum,
} from '../dist'
import {
  createSchema,
  createTypeDefinition,
  createPrimitiveType,
  createDeriveDefinition,
  check,
  PrimitiveTypeEnum,
  createCallDefinition,
} from '../src'

describe('check', () => {
  describe('type Definition', () => {
    it('error', () => {
      const schema = createSchema()

      schema.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      schema.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const schema = createSchema()

      schema.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )

      expect(check(schema)).toBe(null)
    })
  })

  describe('derive Definition', () => {
    it('error', () => {
      const schema = createSchema()

      schema.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      schema.deriveDefinitions.push(
        createDeriveDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const schema = createSchema()

      schema.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )

      expect(check(schema)).toBe(null)
    })
  })

  describe('call Definition', () => {
    it('error', () => {
      const schema = createSchema()

      schema.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      schema.callDefinitions.push(
        createCallDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const schema = createSchema()

      schema.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )

      expect(check(schema)).toBe(null)
    })
  })

  describe('type', () => {
    describe('PrimitiveType', () => {
      it('error', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition('foo6', createPrimitiveType('error' as any), '')
        )

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )

        expect(check(schema)).toBe(null)
      })
    })

    describe('SpecialType', () => {
      it('error', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition('foo6', createSpecialType('error' as any), '')
        )

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createSpecialType(SpecialTypeEnum.Any),
            ''
          )
        )

        expect(check(schema)).toBe(null)
      })
    })

    describe('LiteralType', () => {
      it('error', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition('foo6', createLiteralType({} as any), '')
        )

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition('foo6', createLiteralType('foo6'), '')
        )

        expect(check(schema)).toBe(null)
      })
    })

    describe('ObjectType', () => {
      it('error', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createObjectType([
              createObjectTypeFiled(
                'foo',
                createPrimitiveType(PrimitiveTypeEnum.Number),
                null
              ),
              createObjectTypeFiled(
                'foo',
                createPrimitiveType(PrimitiveTypeEnum.Number),
                null
              ),
            ]),
            ''
          )
        )

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createObjectType([
              createObjectTypeFiled(
                'foo',
                createPrimitiveType(PrimitiveTypeEnum.Number),
                null
              ),
            ]),
            ''
          )
        )

        expect(check(schema)).toBe(null)
      })
    })

    describe('NameType', () => {
      it('error', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition('foo6', createNameType('foo6'), '')
        )

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const schema = createSchema()

        schema.typeDefinitions.push(
          createTypeDefinition(
            'foo5',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        schema.typeDefinitions.push(
          createTypeDefinition('foo6', createNameType('foo5'), '')
        )

        expect(check(schema)).toBe(null)
      })
    })
  })
})
