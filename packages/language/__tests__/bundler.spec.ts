import path from 'path'
import { bundle } from '../src'

describe('bundler', () => {
  it('base', () => {
    const moduleId = path.resolve(__dirname, './fixtures/foo.jc')
    const schema = bundle(moduleId)

    expect(schema.entry).toMatch('fixtures/foo.jc')
    expect(schema.modules.length).toBe(1)

    const module = schema.modules[0]
    expect(module.id).toMatch('fixtures/foo.jc')
    expect(module.linkDefinations.length).toBe(0)
    expect(module.typeDefinations.length).toBe(15)
    expect(module.callDefinations.length).toBe(1)
    expect(module.deriveDefinations.length).toBe(2)
    expect(module.exportDefinations.length).toBe(1)
  })
})
