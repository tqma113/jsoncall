import path from 'path'
import {
  rename,
  createSchema,
  createSchemaModule,
  createLinkDefination,
  Namer,
  check,
} from '../src'

describe('rename', () => {
  it('sample', () => {
    const foo = path.resolve(__dirname, './foo.jc')
    const bar = path.resolve(__dirname, './bar.jc')
    const baz = path.resolve(__dirname, './baz.jc')

    const prev = createSchema(foo)
    const fooModule = createSchemaModule(foo)
    const barModule = createSchemaModule(bar)
    barModule.linkDefinations.push(
      createLinkDefination('./foo.jc', [['foo6', 'foo']])
    )
    const bazModule = createSchemaModule(baz)
    bazModule.linkDefinations.push(
      createLinkDefination('./foo.jc', [['foo6', 'foo']])
    )
    bazModule.linkDefinations.push(
      createLinkDefination('./bar.jc', [
        ['bar', 'bar'],
        ['fooAndBar', 'fooAndBar'],
      ])
    )

    prev.modules.push(fooModule)
    prev.modules.push(barModule)
    prev.modules.push(bazModule)

    const getName: Namer = (id, isExist) => {
      return path.basename(id)
    }
    const schema = rename(prev, getName)

    expect(check(schema)).toBe(null)
  })
})
