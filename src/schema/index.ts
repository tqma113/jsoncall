export type Schema = {
  kind: 'Schema'
  typeDefination: TypeDefination[]
  deriveDefination: DeriveDefination[]
  callDefination: CallDefination[]
}

export type TypeDefination = {
  kind: 'TypeDefination'
  name: string
  type: Type
}

export type Type =
  | PrimitiveType
  | SpecialType
  | BooleanLiteral
  | StringLiteral
  | NumberLiteral
  | ListType
  | ObjectType
  | TupleType
  | UnionType
  | IntersectType
  | NameType

// prettier-ignore
export enum PrimitiveType {
  Number                =         'number',
  String                =         'string',
  Null                  =         'null',
  Boolean               =         'boolean',
}

export enum SpecialType {
  Any = 'any',
  None = 'none',
}

// prettier-ignore
export enum BooleanLiteral {
  True                  =         'true',
  False                 =         'false',
}

export type StringLiteral = {
  kind: 'StringLiteral'
  value: string
}

export type NumberLiteral = {
  kind: 'NumberLiteral'
  value: number
}

export type ListType = {
  kind: 'ListType'
  type: Type
}

export type ObjectType = {
  kind: 'ObjectType'
  type: Record<string, Type>
}

export type TupleType = {
  kind: 'TupleType'
  types: Type[]
}

export type UnionType = {
  kind: 'UnionType'
  types: Type[]
}

export type IntersectType = {
  kind: 'IntersectType'
  types: Type[]
}

export type NameType = {
  kind: 'NameType'
  name: string
}

export type DeriveDefination = {
  kind: 'DeriveDefination'
  name: string
  type: Type
}

export type CallDefination = {
  kind: 'CallDefination'
  input: Type
  output: Type
}
