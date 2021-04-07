import path from 'path'
import { check } from 'jc-schema'
import { bundle } from '../src'
import { nodeModuleResolver } from './node'

describe('bundler', () => {
  it('base', () => {
    const moduleId = path.resolve(__dirname, './fixtures/foo.jc')
    const schema = bundle(moduleId, nodeModuleResolver)

    expect(schema.entry).toMatch('foo.jc')
    expect(schema.modules.length).toBe(1)

    const module = schema.modules[0]
    expect(module.id).toMatch('foo.jc')
    expect(module.linkDefinations.length).toBe(0)
    expect(module.typeDefinations.length).toBe(15)
    expect(module.callDefinations.length).toBe(1)
    expect(module.deriveDefinations.length).toBe(2)
    expect(module.exportDefinations.length).toBe(1)

    expect(check(schema)).toBe(null)
  })

  it('dependency', () => {
    const moduleId = path.resolve(__dirname, './fixtures/baz.jc')
    const schema = bundle(moduleId, nodeModuleResolver)

    expect(schema.entry).toMatch('baz.jc')
    expect(schema.modules.length).toBe(3)

    const module0 = schema.modules[0]
    expect(module0.id).toMatch('baz.jc')
    expect(module0.linkDefinations.length).toBe(2)
    expect(module0.typeDefinations.length).toBe(3)
    expect(module0.callDefinations.length).toBe(3)
    expect(module0.deriveDefinations.length).toBe(0)
    expect(module0.exportDefinations.length).toBe(0)

    const module1 = schema.modules[1]
    expect(module1.id).toMatch('foo.jc')
    expect(module1.linkDefinations.length).toBe(0)
    expect(module1.typeDefinations.length).toBe(15)
    expect(module1.callDefinations.length).toBe(1)
    expect(module1.deriveDefinations.length).toBe(2)
    expect(module1.exportDefinations.length).toBe(1)

    const module2 = schema.modules[2]
    expect(module2.id).toMatch('bar.jc')
    expect(module2.linkDefinations.length).toBe(1)
    expect(module2.typeDefinations.length).toBe(2)
    expect(module2.callDefinations.length).toBe(0)
    expect(module2.deriveDefinations.length).toBe(0)
    expect(module2.exportDefinations.length).toBe(1)

    expect(check(schema)).toBe(null)
  })

  it('circular', () => {
    const moduleId = path.resolve(
      __dirname,
      './fixtures/circularDependency/foo.jc'
    )
    const schema = bundle(moduleId, nodeModuleResolver)

    expect(schema.entry).toMatch('foo.jc')
    expect(schema.modules.length).toBe(2)

    expect(check(schema)).toBe(null)
  })
})
