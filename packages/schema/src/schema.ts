export type Schema = {
  kind: 'Schema'
  entry: string
  modules: SchemaModule[]
}

export type SchemaModule = {
  kind: 'SchemaModule'
  id: string
  typeDefinitions: TypeDefinition[]
  deriveDefinitions: DeriveDefinition[]
  linkDefinitions: LinkDefinition[]
  exportDefinition: ExportDefinition | null
  callDefinitions: CallDefinition[]
}

export type TypeDefinition = {
  kind: 'TypeDefinition'
  name: string
  type: Type
  description: string | null
}

export type LinkDefinition = {
  kind: 'LinkDefinition'
  from: string
  links: Link[]
}

export type Link = [string, string]

export type ExportDefinition = {
  kind: 'ExportDefinition'
  names: string[]
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

export const createSchema = (entry: string): Schema => {
  return {
    kind: 'Schema',
    entry,
    modules: [],
  }
}

export const createSchemaModule = (id: string): SchemaModule => {
  return {
    kind: 'SchemaModule',
    typeDefinitions: [],
    linkDefinitions: [],
    exportDefinition: null,
    deriveDefinitions: [],
    callDefinitions: [],
    id,
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

export const createExportDefinition = (names: string[]): ExportDefinition => {
  return {
    kind: 'ExportDefinition',
    names,
  }
}

export const createLinkDefinition = (
  from: string,
  links: Link[]
): LinkDefinition => {
  return {
    kind: 'LinkDefinition',
    from,
    links,
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
