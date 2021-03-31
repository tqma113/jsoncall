import {
  Name,
  Token,
  PrimitiveType,
  SpecialType,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral,
} from './token'
import { Source } from './source'

// prettier-ignore
export enum ASTNodeKind {
  PrimitiveTypeNode     = 'primitive type node',

  SpecialTypeNode       = 'special type node',

  ListTypeNode          = 'list type node',
  ObjectTypeNode        = 'object type node',
  TupleTypeNode         = 'tuple type node',

  StringLiteralNode     = 'string literal node',
  NumberLiteralNode     = 'number literal node',
  BooleanLiteralNode    = 'boolean literal node',

  NameNode              = 'name node',
  PathNode              = 'path node',

  UnionNode             = 'union type',
  IntersectionNode      = 'intersection type',

  TypeDeclaration       = 'type declaration',
  DeriveDeclaration     = 'derive declaration',
  CallDeclaration       = 'call declaration',

  ImportStatement       = 'import statement',
  ExportStatement       = 'export statement',

  Document              = 'document'
}

export type BaseNode = {
  kind: string
  location: Location
}

export type PrimitiveTypeNode = BaseNode & {
  kind: ASTNodeKind.PrimitiveTypeNode
  primitiveType: PrimitiveType
}

export type SpecialTypeNode = BaseNode & {
  kind: ASTNodeKind.SpecialTypeNode
  specialType: SpecialType
}

export type ListTypeNode = BaseNode & {
  kind: ASTNodeKind.ListTypeNode
  type: TypeNode
}

export type ObjectTypeNode = BaseNode & {
  kind: ASTNodeKind.ObjectTypeNode
  fields: [NameNode, TypeNode][]
}

export type TupleTypeNode = BaseNode & {
  kind: ASTNodeKind.TupleTypeNode
  fields: TypeNode[]
}

export type StringLiteralNode = BaseNode & {
  kind: ASTNodeKind.StringLiteralNode
  stringLiteral: StringLiteral
}

export type NumberLiteralNode = BaseNode & {
  kind: ASTNodeKind.NumberLiteralNode
  numberLiteral: NumberLiteral
}

export type BooleanLiteralNode = BaseNode & {
  kind: ASTNodeKind.BooleanLiteralNode
  booleanLiteral: BooleanLiteral
}

export type UnionNode = BaseNode & {
  kind: ASTNodeKind.UnionNode
  types: TypeNode[]
}

export type IntersectionNode = BaseNode & {
  kind: ASTNodeKind.IntersectionNode
  types: TypeNode[]
}

export type NameNode = BaseNode & {
  kind: ASTNodeKind.NameNode
  name: Name
}

export type PathNode = BaseNode & {
  kind: ASTNodeKind.NameNode
  path: StringLiteral
}

export type TypeNode =
  | PrimitiveTypeNode
  | SpecialTypeNode
  | ListTypeNode
  | ObjectTypeNode
  | TupleTypeNode
  | StringLiteralNode
  | NumberLiteralNode
  | BooleanLiteralNode
  | UnionNode
  | IntersectionNode
  | NameNode

export type TypeDeclaration = BaseNode & {
  kind: ASTNodeKind.TypeDeclaration
  name: NameNode
  type: TypeNode
}

export type DeriveDeclaration = BaseNode & {
  kind: ASTNodeKind.DeriveDeclaration
  name: NameNode
  type: TypeNode
}

export type CallDeclaration = BaseNode & {
  kind: ASTNodeKind.CallDeclaration
  name: NameNode
  input: TypeNode
  output: TypeNode
}

export type ImportStatement = BaseNode & {
  kind: ASTNodeKind.ImportStatement
  names: [NameNode, NameNode][]
  path: PathNode
}

export type ExportStatement = BaseNode & {
  kind: ASTNodeKind.ExportStatement
  names: NameNode[]
}

export type Statement =
  | TypeDeclaration
  | DeriveDeclaration
  | CallDeclaration
  | ImportStatement
  | ExportStatement

export type Document = BaseNode & {
  kind: ASTNodeKind.Document
  statements: Statement[]
}

export const createPrimitiveTypeNode = (
  primitiveType: PrimitiveType,
  location: Location
): PrimitiveTypeNode => {
  return {
    kind: ASTNodeKind.PrimitiveTypeNode,
    primitiveType,
    location,
  }
}

export const createSpecialTypeNode = (
  specialType: SpecialType,
  location: Location
): SpecialTypeNode => {
  return {
    kind: ASTNodeKind.SpecialTypeNode,
    specialType,
    location,
  }
}

export const createListTypeNode = (
  type: TypeNode,
  location: Location
): ListTypeNode => {
  return {
    kind: ASTNodeKind.ListTypeNode,
    type,
    location,
  }
}

export const createObjectTypeNode = (
  fields: [NameNode, TypeNode][],
  location: Location
): ObjectTypeNode => {
  return {
    kind: ASTNodeKind.ObjectTypeNode,
    fields,
    location,
  }
}

export const createTupleTypeNode = (
  fields: TypeNode[],
  location: Location
): TupleTypeNode => {
  return {
    kind: ASTNodeKind.TupleTypeNode,
    fields,
    location,
  }
}

export const createStringLiteralNode = (
  stringLiteral: StringLiteral,
  location: Location
): StringLiteralNode => {
  return {
    kind: ASTNodeKind.StringLiteralNode,
    stringLiteral,
    location,
  }
}

export const createNumberLiteralNode = (
  numberLiteral: NumberLiteral,
  location: Location
): NumberLiteralNode => {
  return {
    kind: ASTNodeKind.NumberLiteralNode,
    numberLiteral,
    location,
  }
}

export const createBooleanLiteralNode = (
  booleanLiteral: BooleanLiteral,
  location: Location
): BooleanLiteralNode => {
  return {
    kind: ASTNodeKind.BooleanLiteralNode,
    booleanLiteral,
    location,
  }
}

export const createUnionNode = (
  types: TypeNode[],
  location: Location
): UnionNode => {
  return {
    kind: ASTNodeKind.UnionNode,
    types,
    location,
  }
}

export const createIntersectionNode = (
  types: TypeNode[],
  location: Location
): IntersectionNode => {
  return {
    kind: ASTNodeKind.IntersectionNode,
    types,
    location,
  }
}

export const createNameNode = (name: Name, location: Location): NameNode => {
  return {
    kind: ASTNodeKind.NameNode,
    name,
    location,
  }
}

export const createPathNode = (
  path: StringLiteral,
  location: Location
): PathNode => {
  return {
    kind: ASTNodeKind.NameNode,
    path,
    location,
  }
}

export const createTypeDeclaration = (
  name: NameNode,
  type: TypeNode,
  location: Location
): TypeDeclaration => {
  return {
    kind: ASTNodeKind.TypeDeclaration,
    name,
    type,
    location,
  }
}

export const createDeriveDeclaration = (
  name: NameNode,
  type: TypeNode,
  location: Location
): DeriveDeclaration => {
  return {
    kind: ASTNodeKind.DeriveDeclaration,
    name,
    type,
    location,
  }
}

export const createCallDeclaration = (
  name: NameNode,
  input: TypeNode,
  output: TypeNode,
  location: Location
): CallDeclaration => {
  return {
    kind: ASTNodeKind.CallDeclaration,
    name,
    input,
    output,
    location,
  }
}

export const createImportStatement = (
  names: [NameNode, NameNode][],
  path: PathNode,
  location: Location
): ImportStatement => {
  return {
    kind: ASTNodeKind.ImportStatement,
    names,
    path,
    location,
  }
}

export const createExportStatement = (
  names: NameNode[],
  location: Location
): ExportStatement => {
  return {
    kind: ASTNodeKind.ExportStatement,
    names,
    location,
  }
}

export const createDocument = (
  statements: Statement[],
  location: Location
): Document => {
  return {
    kind: ASTNodeKind.Document,
    statements,
    location,
  }
}

export type Location = {
  /**
   * The character offset at which this Node begins.
   */
  start: number

  /**
   * The character offset at which this Node ends.
   */
  end: number

  /**
   * The Token at which this Node begins.
   */
  startToken: Token

  /**
   * The Token at which this Node ends.
   */
  endToken: Token

  /**
   * The Source document the AST represents.
   */
  source: Source
}

export const createLocation = (
  startToken: Token,
  endToken: Token,
  source: Source
): Location => {
  return {
    start: startToken.range.start,
    end: endToken.range.end,
    startToken,
    endToken,
    source,
  }
}
