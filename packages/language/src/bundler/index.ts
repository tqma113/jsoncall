import { parse } from '../parser'
import { format } from '../formater'
import { Schema, createSchema } from 'jc-schema'
import { BundleError } from '../error'
import { access } from './accessor'
import { check } from './check'
import { ModuleResolver, defaultModuleResolver } from './resolver'
import type { Document } from '../ast'
import type { Source } from '../source'

export type Module = {
  source: Source
  document: Document
}

export type Bundler = {
  entry: string
  modules: Map<string, Module>
  schema: Schema
  bundle: () => Schema
}

export const createBundler = (
  entry: string,
  moduleResolver: ModuleResolver = defaultModuleResolver
): Bundler => {
  const loadEntry = (moduleId: string) => {
    try {
      const content = moduleResolver.read(moduleId)
      const source: Source = {
        moduleId,
        content,
      }
      const document = format(parse(source))
      const module: Module = {
        source,
        document,
      }
      bundler.modules.set(moduleId, module)
      return module
    } catch (err) {
      throw new BundleError(`Can't access entry module`, moduleId)
    }
  }

  const bundle = (): Schema => {
    const entryModule = loadEntry(bundler.entry)

    access(bundler, entryModule, moduleResolver)

    check(bundler.schema)

    return bundler.schema
  }

  let bundler: Bundler = {
    entry,
    modules: new Map(),
    schema: createSchema(entry),
    bundle,
  }

  return bundler
}

export const bundle = (
  entry: string,
  resolveModule: ModuleResolver = defaultModuleResolver
): Schema => {
  const bundler = createBundler(entry, resolveModule)
  return bundler.bundle()
}
