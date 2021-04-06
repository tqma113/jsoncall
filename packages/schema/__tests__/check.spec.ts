import path from 'path'
import {
  createSchema,
  createSchemaModule,
  createLinkDefination,
  createTypeDefination,
  createExportDefination,
  createPrimitiveType,
  createDeriveDefination,
  check,
  PrimitiveTypeEnum,
  createCallDefination,
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
        fooModule.linkDefinations.push(
          createLinkDefination('bar', [['foo6', 'foo']])
        )

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')
        const bar = path.resolve(__dirname, './bar.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinations.push(
          createTypeDefination(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinations.push(createExportDefination(['foo6']))

        const barModule = createSchemaModule(bar)
        barModule.linkDefinations.push(
          createLinkDefination(foo, [['foo6', 'foo']])
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
        barModule.linkDefinations.push(
          createLinkDefination(foo, [['foo6', 'foo']])
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
        fooModule.typeDefinations.push(
          createTypeDefination(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinations.push(createExportDefination(['foo6']))

        const barModule = createSchemaModule(bar)
        barModule.linkDefinations.push(
          createLinkDefination(foo, [['foo6', 'foo']])
        )

        schema.modules.push(fooModule)
        schema.modules.push(barModule)

        expect(check(schema)).toBe(null)
      })
    })
  })

  describe('type defination', () => {
    it('error', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinations.push(
        createTypeDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.typeDefinations.push(
        createTypeDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )
      fooModule.exportDefinations.push(createExportDefination(['foo6']))

      schema.modules.push(fooModule)

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinations.push(
        createTypeDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.exportDefinations.push(createExportDefination(['foo6']))

      schema.modules.push(fooModule)

      expect(check(schema)).toBe(null)
    })
  })

  describe('derive defination', () => {
    it('error', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinations.push(
        createTypeDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.deriveDefinations.push(
        createDeriveDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )
      fooModule.exportDefinations.push(createExportDefination(['foo6']))

      schema.modules.push(fooModule)

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinations.push(
        createTypeDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.exportDefinations.push(createExportDefination(['foo6']))

      schema.modules.push(fooModule)

      expect(check(schema)).toBe(null)
    })
  })

  describe('call defination', () => {
    it('error', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinations.push(
        createTypeDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.callDefinations.push(
        createCallDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          createPrimitiveType(PrimitiveTypeEnum.String),
          ''
        )
      )
      fooModule.exportDefinations.push(createExportDefination(['foo6']))

      schema.modules.push(fooModule)

      expect(check(schema)).toBeInstanceOf(Error)
    })

    it('pass', () => {
      const foo = path.resolve(__dirname, './foo.jc')

      const schema = createSchema(foo)

      const fooModule = createSchemaModule(foo)
      fooModule.typeDefinations.push(
        createTypeDefination(
          'foo6',
          createPrimitiveType(PrimitiveTypeEnum.Number),
          ''
        )
      )
      fooModule.exportDefinations.push(createExportDefination(['foo6']))

      schema.modules.push(fooModule)

      expect(check(schema)).toBe(null)
    })
  })

  describe('export defination', () => {
    describe('repeat', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinations.push(
          createTypeDefination(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinations.push(
          createExportDefination(['foo6', 'foo6'])
        )

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinations.push(
          createTypeDefination(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinations.push(createExportDefination(['foo6']))

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })

    describe('unknown', () => {
      it('error', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.exportDefinations.push(createExportDefination(['foo6']))

        schema.modules.push(fooModule)

        expect(check(schema)).toBeInstanceOf(Error)
      })

      it('pass', () => {
        const foo = path.resolve(__dirname, './foo.jc')

        const schema = createSchema(foo)

        const fooModule = createSchemaModule(foo)
        fooModule.typeDefinations.push(
          createTypeDefination(
            'foo6',
            createPrimitiveType(PrimitiveTypeEnum.Number),
            ''
          )
        )
        fooModule.exportDefinations.push(createExportDefination(['foo6']))

        schema.modules.push(fooModule)

        expect(check(schema)).toBe(null)
      })
    })
  })

  describe('type', () => {
    it.todo('all')
  })
})
