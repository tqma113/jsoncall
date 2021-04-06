import fs from 'fs'
import path from 'path'
import { bundle, codegen } from '../src'

describe('codegen', () => {
  it('schema', () => {
    const moduleId = path.resolve(__dirname, './fixtures/baz.jc')
    const schema = bundle(moduleId)
    const map = codegen(schema)

    expect(map.size).toBe(3)
  })

  it('module', () => {
    const moduleId = path.resolve(__dirname, './fixtures/foo.jc')
    const content = fs.readFileSync(moduleId, 'utf-8')
    const schema = bundle(moduleId)
    const map = codegen(schema)

    expect(map.size).toBe(1)
    expect(map.get(moduleId)).toBe(content)
  })
})
