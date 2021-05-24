export type Schema = {
  kind: 'Schema'
  typeDefinitions: TypeDefinition[]
  deriveDefinitions: DeriveDefinition[]
  callDefinitions: CallDefinition[]
}

export type TypeDefinition = {
  kind: 'TypeDefinition'
  name: string
  type: Type
  description: string | null
}

export type DeriveDefinition = {
  kind: 'DeriveDefinition'
  name: string
  type: Type
  description: string | null
}

export type CallDefinition = {
  kind: 'CallDefinition'
  name: string
  input: Type
  output: Type
  description: string | null
}

export type Type =
  | PrimitiveType
  | SpecialType
  | LiteralType
  | ListType
  | ObjectType
  | TupleType
  | RecordType
  | UnionType
  | IntersectType
  | NameType

// prettier-ignore
export enum PrimitiveTypeEnum {
  Number                =         'number',
  String                =         'string',
  Null                  =         'null',
  Boolean               =         'boolean',
}

export type PrimitiveType = {
  kind: 'PrimitiveType'
  type: PrimitiveTypeEnum
}

export enum SpecialTypeEnum {
  Any = 'any',
  None = 'none',
}

export type SpecialType = {
  kind: 'SpecialType'
  type: SpecialTypeEnum
}

export type LiteralValueType = boolean | number | string

// prettier-ignore
export type LiteralType = {
  kind: 'Literal',
  value: LiteralValueType
}

export type ListType = {
  kind: 'ListType'
  type: Type
}

export type ObjectType = {
  kind: 'ObjectType'
  fields: ObjectTypeFiled[]
}

export type ObjectTypeFiled = {
  kind: 'ObjectTypeFiled'
  name: string
  type: Type
  description: string | null
}

export type TupleType = {
  kind: 'TupleType'
  types: Type[]
}

export type RecordType = {
  kind: 'RecordType'
  type: Type
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

export const createSchema = (): Schema => {
  return {
    kind: 'Schema',
    typeDefinitions: [],
    deriveDefinitions: [],
    callDefinitions: [],
  }
}

export const createTypeDefinition = (
  name: string,
  type: Type,
  description: string | null
): TypeDefinition => {
  return {
    kind: 'TypeDefinition',
    name,
    type,
    description,
  }
}

export const createDeriveDefinition = (
  name: string,
  type: Type,
  description: string | null
): DeriveDefinition => {
  return {
    kind: 'DeriveDefinition',
    name,
    type,
    description,
  }
}

export const createCallDefinition = (
  name: string,
  input: Type,
  output: Type,
  description: string | null
): CallDefinition => {
  return {
    kind: 'CallDefinition',
    name,
    input,
    output,
    description,
  }
}

export const createPrimitiveType = (type: PrimitiveTypeEnum): PrimitiveType => {
  return {
    kind: 'PrimitiveType',
    type,
  }
}

export const createSpecialType = (type: SpecialTypeEnum): SpecialType => {
  return {
    kind: 'SpecialType',
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

export const createObjectType = (fields: ObjectTypeFiled[]): ObjectType => {
  return {
    kind: 'ObjectType',
    fields,
  }
}

export const createObjectTypeFiled = (
  name: string,
  type: Type,
  description: string | null
): ObjectTypeFiled => {
  return {
    kind: 'ObjectTypeFiled',
    name,
    type,
    description,
  }
}

export const createTupleType = (types: Type[]): TupleType => {
  return {
    kind: 'TupleType',
    types,
  }
}

export const createRecordType = (type: Type): RecordType => {
  return {
    kind: 'RecordType',
    type,
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
