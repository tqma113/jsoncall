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
  createSchemaModule,
  createLinkDefinition,
  createTypeDefinition,
  createExportDefinition,
  createPrimitiveType,
  createDeriveDefinition,
  check,
  PrimitiveTypeEnum,
  createCallDefinition,
} from '../src'

describe('check', () => {
  describe('entry', () => {
    it('error', () => {
      const foo = path.resolve(__dirname, './foo.jc')
      const schema = createSchema(foo)

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const foo = path.resolve(__dirname, './foo.jc')
      const schema = createSchema(foo)
      const fooModule = createSchemaModule(foo)
      schema.modules.push(fooModule)

      expect(check(schema)).toBe(null)
    })
  })

  describe('import', () => {
    describe('from', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')
        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.linkDefinitions.push(
          createLinkDefinition('bar', [['foo6', 'foo']])
        )

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')
        const bar = path.resolve(__dirname, './bar.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        const barModule = createSchemaModule(bar)
        barModule.linkDefinitions.push(
          createLinkDefinition(foo, [['foo6', 'foo']])
        )

        schema.modules.push(fooModule)
        schema.modules.push(barModule)

        expect(check(schema)).toBe(null)
      })
    })

    describe('item', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')
        const bar = path.resolve(__dirname, './bar.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)

        const barModule = createSchemaModule(bar)
        barModule.linkDefinitions.push(
          createLinkDefinition(foo, [['foo6', 'foo']])
        )

        schema.modules.push(fooModule)
        schema.modules.push(barModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')
        const bar = path.resolve(__dirname, './bar.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        const barModule = createSchemaModule(bar)
        barModule.linkDefinitions.push(
          createLinkDefinition(foo, [['foo6', 'foo']])
        )

        schema.modules.push(fooModule)
        schema.modules.push(barModule)

        expect(check(schema)).toBe(null)
      })
    })
  })

  describe('type Definition', () => {
    it('error', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )
      fooModule.exportDefinition = createExportDefinition(['foo6'])

      schema.modules.push(fooModule)

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.exportDefinition = createExportDefinition(['foo6'])

      schema.modules.push(fooModule)

      expect(check(schema)).toBe(null)
    })
  })

  describe('derive Definition', () => {
    it('error', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.deriveDefinitions.push(
        createDeriveDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )
      fooModule.exportDefinition = createExportDefinition(['foo6'])

      schema.modules.push(fooModule)

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.exportDefinition = createExportDefinition(['foo6'])

      schema.modules.push(fooModule)

      expect(check(schema)).toBe(null)
    })
  })

  describe('call Definition', () => {
    it('error', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.callDefinitions.push(
        createCallDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )
      fooModule.exportDefinition = createExportDefinition(['foo6'])

      schema.modules.push(fooModule)

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinitions.push(
        createTypeDefinition(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.exportDefinition = createExportDefinition(['foo6'])

      schema.modules.push(fooModule)

      expect(check(schema)).toBe(null)
    })
  })

  describe('export Definition', () => {
    describe('repeat', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinition = createExportDefinition(['foo6', 'foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })

    describe('unknown', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })
  })

  describe('type', () => {
    describe('PrimitiveType', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition('foo6', createPrimitiveType('error' as any), '')
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })

    describe('SpecialType', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition('foo6', createSpecialType('error' as any), '')
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo6',
            createSpecialType(SpecialTypeEnum.Any),
            ''
          )
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })

    describe('LiteralType', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition('foo6', createLiteralType({} as any), '')
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition('foo6', createLiteralType('foo6'), '')
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })

    describe('ObjectType', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
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
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
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
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })

    describe('NameType', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition('foo6', createNameType('foo6'), '')
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinitions.push(
          createTypeDefinition(
            'foo5',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.typeDefinitions.push(
          createTypeDefinition('foo6', createNameType('foo5'), '')
        )
        fooModule.exportDefinition = createExportDefinition(['foo6'])

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })
  })
})
