import type {
  Name,
  Token,
  PrimitiveType,
  SpecialType,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral,
  Comment,
} from './token'
import type { Source } from './source'

// prettier-ignore
export enum ASTNodeKind {
  PrimitiveTypeNode     = 'primitive type node',

  SpecialTypeNode       = 'special type node',

  ListTypeNode          = 'list type node',
  ObjectTypeNode        = 'object type node',
  SimpleFieldNode       = 'simple field node',
  RecursiveFieldNode    = 'recursive field node',
  TupleTypeNode         = 'tuple type node',
  RecordTypeNode        = 'record type node',

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

  CommentBlock          = 'comment block',

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
  fields: ObjectFieldNode[]
}

export type ObjectFieldNode = SimpleFieldNode | RecursiveFieldNode

export type SimpleFieldNode = BaseNode &
  WithComments & {
    kind: ASTNodeKind.SimpleFieldNode
    name: NameNode
    type: TypeNode
  }
export type RecursiveFieldNode = BaseNode &
  WithComments & {
    kind: ASTNodeKind.RecursiveFieldNode
    name: NameNode
  }
export type TupleTypeNode = BaseNode & {
  kind: ASTNodeKind.TupleTypeNode
  fields: TypeNode[]
}

export type RecordTypeNode = BaseNode & {
  kind: ASTNodeKind.RecordTypeNode
  type: TypeNode
}

export type StringLiteralNode = BaseNode & {
  kind: ASTNodeKind.StringLiteralNode
  value: StringLiteral
}

export type NumberLiteralNode = BaseNode & {
  kind: ASTNodeKind.NumberLiteralNode
  value: NumberLiteral
}

export type BooleanLiteralNode = BaseNode & {
  kind: ASTNodeKind.BooleanLiteralNode
  value: BooleanLiteral
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
  kind: ASTNodeKind.PathNode
  path: StringLiteral
}

export type CommentBlock = {
  kind: ASTNodeKind.CommentBlock
  location: Location | null
  comments: Comment[]
}

export type TypeNode =
  | PrimitiveTypeNode
  | SpecialTypeNode
  | ListTypeNode
  | ObjectTypeNode
  | TupleTypeNode
  | RecordTypeNode
  | StringLiteralNode
  | NumberLiteralNode
  | BooleanLiteralNode
  | UnionNode
  | IntersectionNode
  | NameNode

export type WithComments = {
  comment: CommentBlock
}

export type TypeDeclaration = BaseNode &
  WithComments & {
    kind: ASTNodeKind.TypeDeclaration
    name: NameNode
    type: TypeNode
  }

export type DeriveDeclaration = BaseNode &
  WithComments & {
    kind: ASTNodeKind.DeriveDeclaration
    name: NameNode
    type: TypeNode
  }

export type CallDeclaration = BaseNode &
  WithComments & {
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

export type Fragment = Document | Statement

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
  fields: ObjectFieldNode[],
  location: Location
): ObjectTypeNode => {
  return {
    kind: ASTNodeKind.ObjectTypeNode,
    fields,
    location,
  }
}

export const createSimpleFieldNode = (
  name: NameNode,
  type: TypeNode,
  comment: CommentBlock,
  location: Location
): SimpleFieldNode => {
  return {
    kind: ASTNodeKind.SimpleFieldNode,
    name,
    type,
    location,
    comment,
  }
}

export const createRecursiveFieldNode = (
  name: NameNode,
  comment: CommentBlock,
  location: Location
): RecursiveFieldNode => {
  return {
    kind: ASTNodeKind.RecursiveFieldNode,
    name,
    location,
    comment,
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

export const createRecordTypeNode = (
  type: TypeNode,
  location: Location
): RecordTypeNode => {
  return {
    kind: ASTNodeKind.RecordTypeNode,
    type,
    location,
  }
}

export const createStringLiteralNode = (
  value: StringLiteral,
  location: Location
): StringLiteralNode => {
  return {
    kind: ASTNodeKind.StringLiteralNode,
    value,
    location,
  }
}

export const createNumberLiteralNode = (
  value: NumberLiteral,
  location: Location
): NumberLiteralNode => {
  return {
    kind: ASTNodeKind.NumberLiteralNode,
    value,
    location,
  }
}

export const createBooleanLiteralNode = (
  value: BooleanLiteral,
  location: Location
): BooleanLiteralNode => {
  return {
    kind: ASTNodeKind.BooleanLiteralNode,
    value,
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
    kind: ASTNodeKind.PathNode,
    path,
    location,
  }
}

export const createCommentBlock = (
  comments: Comment[] = [],
  location: Location | null = null
): CommentBlock => {
  return {
    kind: ASTNodeKind.CommentBlock,
    comments,
    location,
  }
}

export const createTypeDeclaration = (
  name: NameNode,
  type: TypeNode,
  comment: CommentBlock,
  location: Location
): TypeDeclaration => {
  return {
    kind: ASTNodeKind.TypeDeclaration,
    name,
    type,
    location,
    comment,
  }
}

export const createDeriveDeclaration = (
  name: NameNode,
  type: TypeNode,
  comment: CommentBlock,
  location: Location
): DeriveDeclaration => {
  return {
    kind: ASTNodeKind.DeriveDeclaration,
    name,
    type,
    location,
    comment,
  }
}

export const createCallDeclaration = (
  name: NameNode,
  input: TypeNode,
  output: TypeNode,
  comment: CommentBlock,
  location: Location
): CallDeclaration => {
  return {
    kind: ASTNodeKind.CallDeclaration,
    name,
    input,
    output,
    location,
    comment,
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
