import fs from 'fs'
import path from 'path'
import { parse } from './parser'
import { Source } from './source'
import { Schema } from '../schema'
import { Document, ImportStatement } from './ast'
import { SemanticError } from './error'

export type Module = {
  source: Source
  document: Document
}

export type Bundler = {
  entry: string
  modules: Map<string, Module>
  bundle: () => Schema
}

export const createBundler = (entry: string): Bundler => {
  const load = (
    fromModule: Module,
    importStatement: ImportStatement
  ): Module => {
    const fromDir = path.dirname(fromModule.source.filepath)
    const filepath = path.resolve(fromDir, importStatement.path.path.word)
    const module = bundler.modules.get(filepath)
    if (module) {
      return module
    } else {
      try {
        const content = fs.readFileSync(filepath, 'utf8')
        const source: Source = {
          filepath,
          content,
        }
        const document = parse(source)
        const module: Module = {
          source,
          document
        }
        bundler.modules.set(filepath, module)
        return module
      } catch (err) {
        throw new SemanticError(
          `Can't access file: ${filepath}`,
          importStatement,
          fromModule.source
        )
      }
    }
  }

  const travel = (document: Document) => {

  }

  const bundle = (): Schema => {

  }

  let bundler: Bundler = {
    entry,
    modules: new Map(),
    bundle,
  }

  return bundler
}

export const bundle = (entry: string): Schema => {
  const bundler = createBundler(entry)
  return bundler.bundle()
}
