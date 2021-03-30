import {
  Name,
  PrimitiveType,
  SpecialType,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral
} from '../lexer/token'

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

  ImportStatement       = 'import statement',
  ExportStatement       = 'export statement',
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
  kind: ASTNodeKind.ListTypeNode
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

export type ImportStatement = {
  kind: ASTNodeKind.ImportStatement
  path: StringLiteral
  names: Map<Name, Name>
}

export type ExportStatement = {
  kind: ASTNodeKind.ExportStatement
  names: Name[]
}

export type ASTNode =
  | TypeNode
  | TypeDeclaration
  | DeriveDeclaration
  | ImportStatement
  | ExportStatement
