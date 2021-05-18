import path from 'path'
import {
  rename,
  createSchema,
  createSchemaModule,
  createLinkDefinition,
  createTypeDefinition,
  createExportDefinition,
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
    fooModule.typeDefinitions.push(
      createTypeDefinition(
        'foo6',
        createPrimitiveType(PrimitiveTypeEnum.Number),
        ''
      )
    )
    fooModule.exportDefinition = createExportDefinition(['foo6'])

    const barModule = createSchemaModule(bar)
    barModule.linkDefinitions.push(createLinkDefinition(foo, [['foo6', 'foo']]))
    barModule.typeDefinitions.push(
      createTypeDefinition(
        'bar',
        createPrimitiveType(PrimitiveTypeEnum.Number),
        ''
      )
    )
    barModule.typeDefinitions.push(
      createTypeDefinition(
        'fooAndBar',
        createPrimitiveType(PrimitiveTypeEnum.String),
        ''
      )
    )
    barModule.exportDefinition = createExportDefinition(['bar', 'fooAndBar'])

    const bazModule = createSchemaModule(baz)
    bazModule.linkDefinitions.push(createLinkDefinition(foo, [['foo6', 'foo']]))
    bazModule.linkDefinitions.push(
      createLinkDefinition(bar, [
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
