import { parse } from '../parser'
import { format } from '../formater'
import { Schema, createSchema, check } from 'jc-schema'
import { BundleError } from '../error'
import { access } from './accessor'
import type { Document } from '../ast'
import type { Source } from '../source'

export type ModuleResolver = {
  resolve: (id: string, from: string) => string
  read: (id: string) => string
}

export type Module = {
  source: Source
  document: Document
}

export type Bundler = {
  entry: string
  modules: Module[]
  schema: Schema
  bundle: () => Schema
}

export const createBundler = (
  entry: string,
  moduleResolver: ModuleResolver
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
      return module
    } catch (err) {
      throw new BundleError(`Can't access entry module`, moduleId)
    }
  }

  const bundle = (): Schema => {
    const entryModule = loadEntry(bundler.entry)

    access(bundler, entryModule, moduleResolver)
    bundler.modules.push(entryModule)

    const checkResult = check(bundler.schema)
    if (checkResult !== null) {
      throw checkResult
    }

    return bundler.schema
  }

  let bundler: Bundler = {
    entry,
    modules: [],
    schema: createSchema(entry),
    bundle,
  }

  return bundler
}

export const bundle = (
  entry: string,
  resolveModule: ModuleResolver
): Schema => {
  const bundler = createBundler(entry, resolveModule)
  return bundler.bundle()
}
