export type Schema = {
  kind: 'Schema'
  entry: string
  modules: SchemaModule[]
}

export type SchemaModule = {
  kind: 'SchemaModule'
  name: string
  typeDefinations: TypeDefination[]
  deriveDefinations: DeriveDefination[]
  callDefinations: CallDefination[]
  linkDefinations: LinkDefination[]
  exportDefinations: ExportDefination[]
}

export type TypeDefination = {
  kind: 'TypeDefination'
  name: string
  type: Type
  description: string
}

export type LinkDefination = {
  kind: 'LinkDefination'
  from: string
  links: Link[]
}

export type Link = [string, string]

export type ExportDefination = {
  kind: 'ExportDefination'
  names: string[]
}

export type DeriveDefination = {
  kind: 'DeriveDefination'
  name: string
  type: Type
  description: string
}

export type CallDefination = {
  kind: 'CallDefination'
  name: string
  input: Type
  output: Type
  description: string
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
  type: ObjectTypeFiled[]
}

export type ObjectTypeFiled = {
  kind: 'ObjectTypeFiled'
  name: string
  type: Type
  description: string
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

export const createSchema = (entry: string): Schema => {
  return {
    kind: 'Schema',
    entry,
    modules: [],
  }
}

export const createSchemaModule = (name: string): SchemaModule => {
  return {
    kind: 'SchemaModule',
    typeDefinations: [],
    linkDefinations: [],
    exportDefinations: [],
    deriveDefinations: [],
    callDefinations: [],
    name,
  }
}

export const createTypeDefination = (
  name: string,
  type: Type,
  description: string
): TypeDefination => {
  return {
    kind: 'TypeDefination',
    name,
    type,
    description,
  }
}

export const createExportDefination = (names: string[]): ExportDefination => {
  return {
    kind: 'ExportDefination',
    names,
  }
}

export const createLinkDefination = (
  from: string,
  links: Link[]
): LinkDefination => {
  return {
    kind: 'LinkDefination',
    from,
    links,
  }
}

export const createDeriveDefination = (
  name: string,
  type: Type,
  description: string
): DeriveDefination => {
  return {
    kind: 'DeriveDefination',
    name,
    type,
    description,
  }
}

export const createCallDefination = (
  name: string,
  input: Type,
  output: Type,
  description: string
): CallDefination => {
  return {
    kind: 'CallDefination',
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

export const createObjectType = (type: ObjectTypeFiled[]): ObjectType => {
  return {
    kind: 'ObjectType',
    type,
  }
}

export const createObjectTypeFiled = (
  name: string,
  type: Type,
  description: string
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