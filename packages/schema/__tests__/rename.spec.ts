import path from 'path'
import {
  rename,
  createSchema,
  createSchemaModule,
  createLinkDefination,
  createTypeDefination,
  createExportDefination,
  createPrimitiveType,
  Namer,
  check,
  PrimitiveTypeEnum,
} from '../src'

describe('rename', () => {
  it('sample', () => {
    const foo = path.resolve(__dirname, './foo.jc')
    const bar = path.resolve(__dirname, './bar.jc')
    const baz = path.resolve(__dirname, './baz.jc')

    const prev = createSchema(foo)

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
    barModule.linkDefinations.push(createLinkDefination(foo, [['foo6', 'foo']]))
    barModule.typeDefinations.push(
      createTypeDefination(
        'bar',
        createPrimitiveType(PrimitiveTypeEnum.Number),
        ''
      )
    )
    barModule.typeDefinations.push(
      createTypeDefination(
        'fooAndBar',
        createPrimitiveType(PrimitiveTypeEnum.String),
        ''
      )
    )
    barModule.exportDefinations.push(
      createExportDefination(['bar', 'fooAndBar'])
    )

    const bazModule = createSchemaModule(baz)
    bazModule.linkDefinations.push(createLinkDefination(foo, [['foo6', 'foo']]))
    bazModule.linkDefinations.push(
      createLinkDefination(bar, [
        ['bar', 'bar'],
        ['fooAndBar', 'fooAndBar'],
      ])
    )

    prev.modules.push(fooModule)
    prev.modules.push(barModule)
    prev.modules.push(bazModule)

    const getName: Namer = (id, isExist) => {
      return path.basename(id).replace('.jc', '')
    }
    const schema = rename(prev, getName)

    expect(check(schema)).toBe(null)
  })
})
