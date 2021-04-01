export type Schema = {
  kind: 'Schema'
  typeDefinations: TypeDefination[]
  deriveDefinations: DeriveDefination[]
  callDefinations: CallDefination[]
}

export type TypeDefination = {
  kind: 'TypeDefination'
  name: string
  type: Type
}

export type Type =
  | PrimitiveType
  | SpecialType
  | LiteralType
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
export type LiteralType = {
  kind: 'Literal',
  value: boolean | number | string
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

export const createSchema = (): Schema => {
  return {
    kind: 'Schema',
    typeDefinations: [],
    deriveDefinations: [],
    callDefinations: [],
  }
}

export const createTypeDefination = (
  name: string,
  type: Type
): TypeDefination => {
  return {
    kind: 'TypeDefination',
    name,
    type,
  }
}

export const createLiteralType = (
  value: boolean | number | string
): LiteralType => {
  return {
    kind: 'Literal',
    value,
  }
}

export const createListType = (type: Type): ListType => {
  return {
    kind: 'ListType',
    type,
  }
}

export const createObjectType = (type: Record<string, Type>): ObjectType => {
  return {
    kind: 'ObjectType',
    type,
  }
}

export const createTupleType = (types: Type[]): TupleType => {
  return {
    kind: 'TupleType',
    types,
  }
}

export const createUnionType = (types: Type[]): UnionType => {
  return {
    kind: 'UnionType',
    types,
  }
}

export const createIntersectType = (types: Type[]): IntersectType => {
  return {
    kind: 'IntersectType',
    types,
  }
}

export const createNameType = (name: string): NameType => {
  return {
    kind: 'NameType',
    name,
  }
}

export const createDeriveDefination = (
  name: string,
  type: Type
): DeriveDefination => {
  return {
    kind: 'DeriveDefination',
    name,
    type,
  }
}

export const createCallDefination = (
  input: Type,
  output: Type
): CallDefination => {
  return {
    kind: 'CallDefination',
    input,
    output,
  }
}
