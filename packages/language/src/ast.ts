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
  ObjectFieldNode       = 'object field node',
  TupleTypeNode         = 'tuple type node',
  RecordTypeNode        = 'record type node',

  StringLiteralNode     = 'string literal node',
  NumberLiteralNode     = 'number literal node',
  BooleanLiteralNode    = 'boolean literal node',

  NameNode              = 'name node',

  UnionNode             = 'union type',
  IntersectionNode      = 'intersection type',

  TypeDeclaration       = 'type declaration',
  DeriveDeclaration     = 'derive declaration',
  CallDeclaration       = 'call declaration',

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

export type ObjectFieldNode = BaseNode &
  WithComments & {
    kind: ASTNodeKind.ObjectFieldNode
    name: NameNode
    type: TypeNode
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

export type Statement = TypeDeclaration | DeriveDeclaration | CallDeclaration

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

export const createObjectFieldNode = (
  name: NameNode,
  type: TypeNode,
  comment: CommentBlock,
  location: Location
): ObjectFieldNode => {
  return {
    kind: ASTNodeKind.ObjectFieldNode,
    name,
    type,
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
