import {
  Name,
  PrimitiveType,
  SpecialType,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral
} from './token'

// prettier-ignore
export enum ASTNodeKind {
  PrimitiveTypeNode     = 'primitive type node',

  SpecialTypeNode       = 'special type node',

  ListTypeNode          = 'list type node',
  ObjectTypeNode        = 'object type node',

  StringLiteralNode     = 'string literal node',
  NumberLiteralNode     = 'number literal node',
  BooleanLiteralNode    = 'boolean literal node',

  NameNode              = 'Node',

  UnionNode             = 'union type',
  IntersectionNode      = 'intersection type',

  TypeDeclaration       = 'type declaration',
  DeriveDeclaration     = 'derive declaration',
  CallDeclaration       = 'call declaration',

  ImportStatement       = 'import statement',
  ExportStatement       = 'export statement',

  Document              = 'document'
}

export type PrimitiveTypeNode = {
  kind: ASTNodeKind.PrimitiveTypeNode
  primitiveType: PrimitiveType
}

export type SpecialTypeNode = {
  kind: ASTNodeKind.SpecialTypeNode
  specialType: SpecialType
}

export type ListTypeNode = {
  kind: ASTNodeKind.ListTypeNode
  type: TypeNode
}

export type ObjectTypeNode = {
  kind: ASTNodeKind.ObjectTypeNode
  fields: Map<Name, TypeNode>
}

export type StringLiteralNode = {
  kind: ASTNodeKind.StringLiteralNode
  stringLiteral: StringLiteral
}

export type NumberLiteralNode = {
  kind: ASTNodeKind.NumberLiteralNode
  numberLiteral: NumberLiteral
}

export type BooleanLiteralNode = {
  kind: ASTNodeKind.BooleanLiteralNode
  booleanLiteral: BooleanLiteral
}

export type UnionNode = {
  kind: ASTNodeKind.UnionNode
  types: TypeNode[]
}

export type IntersectionNode = {
  kind: ASTNodeKind.IntersectionNode
  types: TypeNode[]
}

export type NameNode = {
  kind: ASTNodeKind.NameNode
  name: Name
}

export type TypeNode =
  | PrimitiveTypeNode
  | SpecialTypeNode
  | ListTypeNode
  | ObjectTypeNode
  | StringLiteralNode
  | NumberLiteralNode
  | BooleanLiteralNode
  | UnionNode
  | IntersectionNode
  | NameNode

export type TypeDeclaration = {
  kind: ASTNodeKind.TypeDeclaration
  name: Name
  type: TypeNode
}

export type DeriveDeclaration = {
  kind: ASTNodeKind.DeriveDeclaration
  name: Name
  type: TypeNode
}

export type CallDeclaration = {
  kind: ASTNodeKind.CallDeclaration
  name: Name
  input: TypeNode
  output: TypeNode
}

export type ImportStatement = {
  kind: ASTNodeKind.ImportStatement
  path: StringLiteral
  names: Map<Name, Name>
}

export type ExportStatement = {
  kind: ASTNodeKind.ExportStatement
  names: Name[]
}

export type Statement =
  | TypeDeclaration
  | DeriveDeclaration
  | CallDeclaration
  | ImportStatement
  | ExportStatement

export type Document = {
  kind: ASTNodeKind.Document
  statements: Statement[]
}

export const createPrimitiveTypeNode = (primitiveType: PrimitiveType): PrimitiveTypeNode => {
  return {
    kind: ASTNodeKind.PrimitiveTypeNode,
    primitiveType
  }
}

export const createSpecialTypeNode = (specialType: SpecialType): SpecialTypeNode => {
  return {
    kind: ASTNodeKind.SpecialTypeNode,
    specialType
  }
}

export const createListTypeNode = (type: TypeNode): ListTypeNode => {
  return {
    kind: ASTNodeKind.ListTypeNode,
    type
  }
}

export const createObjectTypeNode = (fields: Map<Name, TypeNode>): ObjectTypeNode => {
  return {
    kind: ASTNodeKind.ObjectTypeNode,
    fields
  }
}

export const createStringLiteralNode = (stringLiteral: StringLiteral): StringLiteralNode => {
  return {
    kind: ASTNodeKind.StringLiteralNode,
    stringLiteral
  }
}

export const createNumberLiteralNode = (numberLiteral: NumberLiteral): NumberLiteralNode => {
  return {
    kind: ASTNodeKind.NumberLiteralNode,
    numberLiteral
  }
}

export const createBooleanLiteralNode = (booleanLiteral: BooleanLiteral): BooleanLiteralNode => {
  return {
    kind: ASTNodeKind.BooleanLiteralNode,
    booleanLiteral
  }
}

export const createUnionNode = (types: TypeNode[]): UnionNode => {
  return {
    kind: ASTNodeKind.UnionNode,
    types
  }
}

export const createIntersectionNode = (types: TypeNode[]): IntersectionNode => {
  return {
    kind: ASTNodeKind.IntersectionNode,
    types
  }
}

export const createNameNode = (name: Name): NameNode => {
  return {
    kind: ASTNodeKind.NameNode,
    name
  }
}

export const createTypeDeclaration = (name: Name, type: TypeNode): TypeDeclaration => {
  return {
    kind: ASTNodeKind.TypeDeclaration,
    name,
    type
  }
}

export const createDeriveDeclaration = (name: Name, type: TypeNode): DeriveDeclaration => {
  return {
    kind: ASTNodeKind.DeriveDeclaration,
    name,
    type
  }
}

export const createCallDeclaration = (name: Name, input: TypeNode, output: TypeNode): CallDeclaration => {
  return {
    kind: ASTNodeKind.CallDeclaration,
    name,
    input,
    output
  }
}

export const createImportStatement = (path: StringLiteral, names: Map<Name, Name>): ImportStatement => {
  return {
    kind: ASTNodeKind.ImportStatement,
    path,
    names
  }
}

export const createExportStatement = (names: Name[]): ExportStatement => {
  return {
    kind: ASTNodeKind.ExportStatement,
    names
  }
}
