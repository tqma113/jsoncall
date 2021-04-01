import fs from 'fs'
import { parse } from '../parser'
import { format } from '../formater'
import { Schema, createSchema } from '../schema'
import { BundleError } from '../error'
import { access } from './accessor'
import { check } from './check'
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

export const createBundler = (entry: string): Bundler => {
  const loadEntry = (filepath: string) => {
    try {
      const content = fs.readFileSync(filepath, 'utf8')
      const source: Source = {
        filepath,
        content,
      }
      const document = format(parse(source))
      const module: Module = {
        source,
        document,
      }
      bundler.modules.set(filepath, module)
      return module
    } catch (err) {
      throw new BundleError(`Can't access entry file`, filepath)
    }
  }

  const bundle = (): Schema => {
    const entryModule = loadEntry(bundler.entry)

    access(bundler, entryModule)

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

export const bundle = (entry: string): Schema => {
  const bundler = createBundler(entry)
  return bundler.bundle()
}
