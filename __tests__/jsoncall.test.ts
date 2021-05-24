import fs from 'fs'
import path from 'path'
import { check } from 'jc-schema'
import { load } from 'jc-lang'
import { introspection } from 'jc-client'
import { serverCodegen, clientCodegen } from 'jc-codegen'
import { read } from './node'
import { client, batchClient, syncClient, app } from './fixtures/helpers'

describe('jsoncall', () => {
  it('async', async () => {
    const moduleId = path.resolve(__dirname, './fixtures/jc/foo.jc')
    const schema = load(moduleId, read)

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

    expect((await client.fooCall({ foo: 123, baz: true })).value).toMatchObject(
      { foo: 123 }
    )
    expect(
      (await client.barCall({ foo: 123, bar: 'bar' })).value
    ).toMatchObject({ bar: 'bar' })
    expect(
      (await client.bazCall({ foo: 123, bar: 'bar', baz: true })).value
    ).toMatchObject({ baz: true })
  })

  it('batch', async () => {
    const moduleId = path.resolve(__dirname, './fixtures/jc/foo.jc')
    const schema = load(moduleId, read)

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

    const results = await Promise.all([
      batchClient.fooCall({ foo: 123, baz: true }),
      batchClient.barCall({ foo: 123, bar: 'bar' }),
      batchClient.bazCall({ foo: 123, bar: 'bar', baz: true }),
    ])

    expect(results[0].value).toMatchObject({ foo: 123 })
    expect(results[1].value).toMatchObject({ bar: 'bar' })
    expect(results[2].value).toMatchObject({ baz: true })
  })

  it('sync', async () => {
    const moduleId = path.resolve(__dirname, './fixtures/jc/foo.jc')
    const schema = load(moduleId, read)

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

    expect(syncClient.fooCall({ foo: 123, baz: true }).value).toMatchObject({
      foo: 123,
    })
    expect(syncClient.barCall({ foo: 123, bar: 'bar' }).value).toMatchObject({
      bar: 'bar',
    })
    expect(
      syncClient.bazCall({ foo: 123, bar: 'bar', baz: true }).value
    ).toMatchObject({ baz: true })
  })

  it('introspection', async () => {
    const schema = await introspection(
      async (input) => app(input),
      JSON.stringify,
      JSON.parse
    )
    expect(check(schema)).toBe(null)
  })
})
