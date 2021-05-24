import {
  Schema,
  Type,
  PrimitiveType,
  SpecialType,
  LiteralType,
  ListType,
  ObjectType,
  ObjectTypeFiled,
  TupleType,
  UnionType,
  IntersectType,
  NameType,
  createSchema,
  createCallDefinition,
  createPrimitiveType,
  createSpecialType,
  createLiteralType,
  createListType,
  createObjectType,
  createObjectTypeFiled,
  createTupleType,
  createUnionType,
  createIntersectType,
  createNameType,
  createTypeDefinition,
  createDeriveDefinition,
  RecordType,
  createRecordType,
} from 'jc-schema'
import { parse } from './parser'
import { format } from './formatter'
import {
  ASTNodeKind,
  Document,
  Statement,
  TypeDeclaration,
  DeriveDeclaration,
  CallDeclaration,
  TypeNode,
  NumberLiteralNode,
  StringLiteralNode,
  BooleanLiteralNode,
  PrimitiveTypeNode,
  SpecialTypeNode,
  ListTypeNode,
  ObjectTypeNode,
  ObjectFieldNode,
  TupleTypeNode,
  RecordTypeNode,
  UnionNode,
  IntersectionNode,
  NameNode,
  CommentBlock,
} from './ast'
import { LoadError, SemanticError } from './error'
import type { Source } from './source'

export type Module = {
  source: Source
  document: Document
}

export const load = (
  moduleId: string,
  read: (id: string) => string
): Schema => {
  try {
    const content = read(moduleId)
    const source: Source = {
      moduleId,
      content,
    }
    const document = format(parse(source))
    const module: Module = {
      source,
      document,
    }
    return access(module)
  } catch (err) {
    throw err
    throw new LoadError(`Can't access entry module`, moduleId)
  }
}

const access = (module: Module) => {
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
    literalTypeNode: NumberLiteralNode | StringLiteralNode | BooleanLiteralNode
  ): LiteralType => {
    switch (literalTypeNode.kind) {
      case ASTNodeKind.StringLiteralNode: {
        return createLiteralType(literalTypeNode.value.word)
      }
      case ASTNodeKind.BooleanLiteralNode: {
        const value = literalTypeNode.value.word
        if (value === 'true') {
          return createLiteralType(true)
        } else if (value === 'false') {
          return createLiteralType(false)
        } else {
          throw new Error(`Unknown boolean literal value: ${value}`)
        }
      }
      case ASTNodeKind.NumberLiteralNode: {
        return createLiteralType(Number(literalTypeNode.value.word))
      }
    }
  }

  const accessListTypeNode = (listTypeNode: ListTypeNode): ListType => {
    return createListType(accessTypeNode(listTypeNode.type))
  }

  const accessObjectTypeNode = (objectTypeNode: ObjectTypeNode): ObjectType => {
    return createObjectType(objectTypeNode.fields.map(accessObjectFieldNode))
  }

  const accessObjectFieldNode = (
    objectFieldNode: ObjectFieldNode
  ): ObjectTypeFiled => {
    return createObjectTypeFiled(
      objectFieldNode.name.name.word,
      accessTypeNode(objectFieldNode.type),
      accessCommentBlock(objectFieldNode.comment)
    )
  }

  const accessTupleTypeNode = (tupleTypeNode: TupleTypeNode): TupleType => {
    return createTupleType(
      tupleTypeNode.fields.map((typeNode) => accessTypeNode(typeNode))
    )
  }

  const accessRecordTypeNode = (recordTypeNode: RecordTypeNode): RecordType => {
    return createRecordType(accessTypeNode(recordTypeNode.type))
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

  const accessCommentBlock = (commentBlock: CommentBlock): string | null => {
    return commentBlock.comments.length > 0
      ? commentBlock.comments.map((comment) => comment.word).join('\n')
      : null
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
      case ASTNodeKind.RecordTypeNode: {
        return accessRecordTypeNode(typeNode)
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
      schema.typeDefinitions.some(
        (typeDefinition) => typeDefinition.name === name
      )
    ) {
      return true
    }

    return schema.deriveDefinitions.some(
      (deriveDefinition) => deriveDefinition.name === name
    )
  }

  const accessTypeDeclaration = (typeDeclaration: TypeDeclaration) => {
    const name = typeDeclaration.name.name.word
    if (isTypeExist(name)) {
      throw new SemanticError(
        `Type '${name}' is exist`,
        typeDeclaration,
        module.source
      )
    } else {
      const type = accessTypeNode(typeDeclaration.type)
      schema.typeDefinitions.push(
        createTypeDefinition(
          name,
          type,
          accessCommentBlock(typeDeclaration.comment)
        )
      )
    }
  }

  const accessDeriveDeclaration = (deriveDeclaration: DeriveDeclaration) => {
    const name = deriveDeclaration.name.name.word
    const type = accessTypeNode(deriveDeclaration.type)

    schema.deriveDefinitions.push(
      createDeriveDefinition(
        name,
        type,
        accessCommentBlock(deriveDeclaration.comment)
      )
    )
  }

  const accessCallDeclaration = (callDeclaration: CallDeclaration) => {
    const name = callDeclaration.name.name.word
    const input = accessTypeNode(callDeclaration.input)
    const output = accessTypeNode(callDeclaration.output)

    schema.callDefinitions.push(
      createCallDefinition(
        name,
        input,
        output,
        accessCommentBlock(callDeclaration.comment)
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
    }
  }

  const accessDocument = (document: Document) => {
    document.statements.forEach(accessStatement)
  }

  const schema = createSchema()
  accessDocument(module.document)

  return schema
}
