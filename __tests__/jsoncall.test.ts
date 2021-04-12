import fs from 'fs'
import path from 'path'
import { check, rename } from 'jc-schema'
import { bundle } from 'jc-lang'
import { serverCodegen, clientCodegen } from 'jc-codegen'
import { nodeModuleResolver } from './node'
import { client } from './fixtures/helpers'

describe('jsoncall', () => {
  it('sample', async () => {
    const moduleId = path.resolve(__dirname, './fixtures/jc/baz.jc')
    const schema = rename(
      bundle(moduleId, nodeModuleResolver),
      (id, isExist) => {
        return path.basename(id).replace('.jc', '')
      }
    )

    expect(check(schema)).toBe(null)

    fs.writeFileSync(
      path.resolve(__dirname, './fixtures/ts/createServerService.ts'),
      serverCodegen(schema, {
        semi: false,
        singleQuote: true,
        printWidth: 80,
      })
    )
    fs.writeFileSync(
      path.resolve(__dirname, './fixtures/ts/createClient.ts'),
      clientCodegen(schema, {
        semi: false,
        singleQuote: true,
        printWidth: 80,
      })
    )

    expect(
      (await client.fooCall({ foo: 123, baz: true })).value
    ).toMatchObject({ foo: 123 })
    expect(
      (await client.barCall({ foo: 123, bar: 'bar' })).value
    ).toMatchObject({ bar: 'bar' })
    expect(
      (await client.bazCall({ foo: 123, bar: 'bar', baz: true })).value
    ).toMatchObject({ baz: true })
  })
})
