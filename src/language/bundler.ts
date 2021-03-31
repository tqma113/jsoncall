import fs from 'fs'
import path from 'path'
import { Source } from './source'
import { Schema } from '../schema'
import { ImportStatement } from './ast'
import { SemanticError } from './error'

export type Bundler = {
  entry: string
  sources: Map<string, Source>
  bundle: () => Schema
}

export const createBundler = (entry: string): Bundler => {
  const load = (
    fromSource: Source,
    importStatement: ImportStatement
  ): Source => {
    const fromDir = path.dirname(fromSource.filepath)
    const filepath = path.resolve(fromDir, importStatement.path.path.word)
    const source = bundler.sources.get(filepath)
    if (source) {
      return source
    } else {
      try {
        const content = fs.readFileSync(filepath, 'utf8')
        const source: Source = {
          filepath,
          content,
        }
        bundler.sources.set(filepath, source)
        return source
      } catch (err) {
        throw new SemanticError(
          `Can't access file: ${filepath}`,
          importStatement,
          fromSource
        )
      }
    }
  }

  const bundle = (): Schema => {}

  let bundler: Bundler = {
    entry,
    sources: new Map(),
    bundle,
  }
}

export const bundle = (entry: string): Schema => {
  const bundler = createBundler(entry)
  return bundler.bundle()
}
