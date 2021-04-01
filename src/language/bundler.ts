import fs from 'fs'
import path from 'path'
import { parse } from './parser'
import { Source } from './source'
import { Schema, createSchema } from '../schema'
import {
  ASTNodeKind,
  Document,
  Statement,
  TypeDeclaration,
  DeriveDeclaration,
  CallDeclaration,
  ImportStatement,
  ExportStatement,
} from './ast'
import { SemanticError, BundleError } from './error'

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
      const document = parse(source)
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

    accessModule(bundler, entryModule)

    return bundler.schema
  }

  let bundler: Bundler = {
    entry,
    modules: new Map(),
    schema: createSchema(),
    bundle,
  }

  return bundler
}

export const bundle = (entry: string): Schema => {
  const bundler = createBundler(entry)
  return bundler.bundle()
}

export type ModuleAccessor = {
  bundler: Bundler
  access: (module: Module) => void
}

export const createModuleAccessor = (bundler: Bundler): ModuleAccessor => {
  const loadModule = (
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
          document,
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

  const access = (module: Module) => {
    const accessTypeDeclaration = (typeDeclaration: TypeDeclaration) => {}

    const accessDeriveDeclaration = (deriveDeclaration: DeriveDeclaration) => {}

    const accessCallDeclaration = (callDeclaration: CallDeclaration) => {}

    const accessImportStatement = (importStatement: ImportStatement) => {
      const nextModule = loadModule(module, importStatement)
      access(nextModule)
    }

    const accessExportStatement = (exportStatement: ExportStatement) => {}

    const accessStatement = (statement: Statement) => {
      switch (statement.kind) {
        case ASTNodeKind.TypeDeclaration: {
          accessTypeDeclaration(statement)
          break
        }
        case ASTNodeKind.DeriveDeclaration: {
          accessDeriveDeclaration(statement)
          break
        }
        case ASTNodeKind.CallDeclaration: {
          accessCallDeclaration(statement)
          break
        }
        case ASTNodeKind.ImportStatement: {
          accessImportStatement(statement)
          break
        }
        case ASTNodeKind.ExportStatement: {
          accessExportStatement(statement)
          break
        }
      }
    }

    const accessDocument = (document: Document) => {
      document.statements.forEach(accessStatement)
    }

    accessDocument(module.document)
  }

  const accessor: ModuleAccessor = {
    bundler,
    access,
  }

  return accessor
}

export const accessModule = (bundler: Bundler, module: Module) => {
  const accessor = createModuleAccessor(bundler)
  accessor.access(module)
}
