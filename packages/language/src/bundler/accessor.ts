import fs from 'fs'
import path from 'path'

import { parse } from '../parser'
import { format } from '../formater'
import {
  SchemaModule,
  Link,
  Type,
  PrimitiveType,
  SpecialType,
  LiteralType,
  ListType,
  ObjectType,
  TupleType,
  UnionType,
  IntersectType,
  NameType,
  createSchemaModule,
  createExportDefination,
  createLinkDefination,
  createCallDefination,
  createPrimitiveType,
  createSpecialType,
  createLiteralType,
  createListType,
  createObjectType,
  createTupleType,
  createUnionType,
  createIntersectType,
  createNameType,
  createTypeDefination,
} from 'jc-schema'
import {
  ASTNodeKind,
  Document,
  Statement,
  TypeDeclaration,
  DeriveDeclaration,
  CallDeclaration,
  ImportStatement,
  ExportStatement,
  TypeNode,
  NumberLiteralNode,
  StringLiteralNode,
  BooleanLiteralNode,
  PrimitiveTypeNode,
  SpecialTypeNode,
  ListTypeNode,
  ObjectTypeNode,
  TupleTypeNode,
  UnionNode,
  IntersectionNode,
  NameNode,
} from '../ast'
import { SemanticError, BundleError } from '../error'
import type { Bundler, Module } from './index'
import type { Source } from '../source'

export type ModuleAccessor = {
  bundler: Bundler
  access: (module: Module) => void
}

export const createModuleAccessor = (bundler: Bundler): ModuleAccessor => {
  const loadModule = (
    fromModule: Module,
    importStatement: ImportStatement
  ): [Module, SchemaModule] => {
    const fromDir = path.dirname(fromModule.source.filepath)
    const filepath = path.resolve(fromDir, importStatement.path.path.word)
    const module = bundler.modules.get(filepath)

    if (module) {
      const schemaModule = bundler.schema.modules.find(
        (module) => module.name === filepath
      )
      if (schemaModule) {
        return [module, schemaModule]
      } else {
        throw new BundleError(
          `Module: ${filepath} has been loaded, but SchemaModule has not been loaded`,
          fromModule.source.filepath
        )
      }
    } else {
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
        return [module, access(module)]
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
    const schemaModule = createSchemaModule(module.source.filepath)
    bundler.schema.modules.push(schemaModule)

    const accessPrimitiveTypeNode = (
      primitiveTypeNode: PrimitiveTypeNode
    ): PrimitiveType => {
      return createPrimitiveType(primitiveTypeNode.primitiveType.word)
    }

    const accessSpecialTypeNode = (
      specicalTypeNode: SpecialTypeNode
    ): SpecialType => {
      return createSpecialType(specicalTypeNode.specialType.word)
    }

    const accessLiteralNode = (
      literalTypeNode:
        | NumberLiteralNode
        | StringLiteralNode
        | BooleanLiteralNode
    ): LiteralType => {
      return createLiteralType(literalTypeNode.value.word)
    }

    const accessListTypeNode = (listTypeNode: ListTypeNode): ListType => {
      return createListType(accessTypeNode(listTypeNode.type))
    }

    const accessObjectTypeNode = (
      objectTypeNode: ObjectTypeNode
    ): ObjectType => {
      const type: Record<string, Type> = {}
      objectTypeNode.fields.forEach(
        ({ name, type }) => (type[name.name.word] = accessTypeNode(type))
      )
      return createObjectType(type)
    }

    const accessTupleTypeNode = (tupleTypeNode: TupleTypeNode): TupleType => {
      return createTupleType(
        tupleTypeNode.fields.map((typeNode) => accessTypeNode(typeNode))
      )
    }

    const accessUnionNode = (unionNode: UnionNode): UnionType => {
      return createUnionType(
        unionNode.types.map((typeNode) => accessTypeNode(typeNode))
      )
    }

    const accessIntersectionNode = (
      intersectionNode: IntersectionNode
    ): IntersectType => {
      return createIntersectType(
        intersectionNode.types.map((typeNode) => accessTypeNode(typeNode))
      )
    }

    const accessNameNode = (nameNode: NameNode): NameType => {
      return createNameType(nameNode.name.word)
    }

    const accessTypeNode = (typeNode: TypeNode): Type => {
      switch (typeNode.kind) {
        case ASTNodeKind.PrimitiveTypeNode: {
          return accessPrimitiveTypeNode(typeNode)
        }
        case ASTNodeKind.SpecialTypeNode: {
          return accessSpecialTypeNode(typeNode)
        }
        case ASTNodeKind.NumberLiteralNode:
        case ASTNodeKind.StringLiteralNode:
        case ASTNodeKind.BooleanLiteralNode: {
          return accessLiteralNode(typeNode)
        }
        case ASTNodeKind.ListTypeNode: {
          return accessListTypeNode(typeNode)
        }
        case ASTNodeKind.ObjectTypeNode: {
          return accessObjectTypeNode(typeNode)
        }
        case ASTNodeKind.TupleTypeNode: {
          return accessTupleTypeNode(typeNode)
        }
        case ASTNodeKind.UnionNode: {
          return accessUnionNode(typeNode)
        }
        case ASTNodeKind.IntersectionNode: {
          return accessIntersectionNode(typeNode)
        }
        case ASTNodeKind.NameNode: {
          return accessNameNode(typeNode)
        }
      }
    }

    const isTypeExist = (name: string): boolean => {
      if (
        schemaModule.linkDefinations.some((linkDefination) =>
          linkDefination.links.some((link) => link[1] === name)
        )
      ) {
        return true
      }

      if (
        schemaModule.typeDefinations.some(
          (typeDefination) => typeDefination.name === name
        )
      ) {
        return true
      }

      return schemaModule.deriveDefinations.some(
        (deriveDefination) => deriveDefination.name
      )
    }

    const accessTypeDeclaration = (typeDeclaration: TypeDeclaration) => {
      const name = typeDeclaration.name.name.word
      if (isTypeExist(name)) {
        throw new SemanticError(
          `Type ${name} is exist`,
          typeDeclaration,
          module.source
        )
      } else {
        const type = accessTypeNode(typeDeclaration.type)
        schemaModule.typeDefinations.push(createTypeDefination(name, type))
      }
    }

    const accessDeriveDeclaration = (deriveDeclaration: DeriveDeclaration) => {}

    const accessCallDeclaration = (callDeclaration: CallDeclaration) => {
      const name = callDeclaration.name.name.word
      const input = accessTypeNode(callDeclaration.input)
      const output = accessTypeNode(callDeclaration.output)

      schemaModule.callDefinations.push(
        createCallDefination(name, input, output)
      )
    }

    const accessImportStatement = (importStatement: ImportStatement) => {
      const result = loadModule(module, importStatement)

      if (result) {
        const [_, nextSchemaModule] = result
        const isExported = (name: string): boolean => {
          return nextSchemaModule.exportDefinations.some((exportDefination) =>
            exportDefination.names.includes(name)
          )
        }

        const isExist = (name: string): boolean => {
          return schemaModule.linkDefinations.some((linkDefination) =>
            linkDefination.links.some(([from, to]) => to === name)
          )
        }

        const from = importStatement.path.path.word
        const links = importStatement.names
          .map(([from, to]) => [from.name.word, to.name.word] as const)
          .map(([from, to]) => {
            if (!isExported(from)) {
              throw new SemanticError(
                `Type ${from} has not been exported from ${from}`,
                importStatement,
                module.source
              )
            } else if (isExist(to)) {
              throw new SemanticError(
                `Type ${from} is exist`,
                importStatement,
                module.source
              )
            } else {
              return [from, to] as Link
            }
          })

        schemaModule.linkDefinations.push(createLinkDefination(from, links))
      }
    }

    const accessExportStatement = (exportStatement: ExportStatement) => {
      schemaModule.exportDefinations.push(
        createExportDefination(
          exportStatement.names.map((name) => name.name.word)
        )
      )
    }

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

    return schemaModule
  }

  const accessor: ModuleAccessor = {
    bundler,
    access,
  }

  return accessor
}

export const access = (bundler: Bundler, module: Module) => {
  const accessor = createModuleAccessor(bundler)
  accessor.access(module)
}
