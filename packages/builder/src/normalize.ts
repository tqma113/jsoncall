import {
  Schema,
  SchemaModule,
  Type,
  TypeDefinition,
  LinkDefinition,
  DeriveDefinition,
  ExportDefinition,
  CallDefinition,
  createTypeDefinition,
  createDeriveDefinition,
  createLinkDefinition,
  createExportDefinition,
  createSchema,
  createSchemaModule,
  createCallDefinition,
  createNameType,
} from 'jc-schema'
import { BuilderSchema, BuilderModule, TypeLink } from './module'
import { JSONType, type, name, desc, origin } from './types'
import { JSONCallType } from './call'

export const normalize = <
  CS extends Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
>(
  builderSchema: BuilderSchema<CS>
): Schema => {
  const schema = createSchema(builderSchema.entry)

  for (const module of builderSchema.modules) {
    schema.modules.push(normalizeModule(module))
  }

  return schema
}

export const normalizeModule = (builderModule: BuilderModule): SchemaModule => {
  const module = createSchemaModule(builderModule.id)

  for (const link of builderModule.links) {
    module.linkDefinitions.push(normalizeLinkDefinition(link))
  }

  for (const key in builderModule.types) {
    module.typeDefinitions.push(
      normalizeTypeDefinition(
        key,
        builderModule.types[key],
        desc(builderModule.types[key])
      )
    )
  }

  for (const key in builderModule.calls) {
    module.callDefinitions.push(
      normalizeCallDefinition(builderModule.calls[key])
    )
  }

  for (const key in builderModule.derives) {
    module.deriveDefinitions.push(
      normalizeDeriveDefinition(
        key,
        builderModule.derives[key],
        desc(builderModule.derives[key])
      )
    )
  }

  module.exportDefinition = normalizeExportDefinitions(builderModule.exports)

  return module
}

export const normalizeTypeDefinition = (
  name: string,
  type: JSONType<any, any, string>,
  description: string | null
): TypeDefinition => {
  return createTypeDefinition(name, normalizeType(type, true), description)
}

export const normalizeDeriveDefinition = (
  name: string,
  type: JSONType<any, any, string>,
  description: string | null
): DeriveDefinition => {
  return createDeriveDefinition(name, normalizeType(type), description)
}

export const normalizeLinkDefinition = (link: TypeLink): LinkDefinition => {
  return createLinkDefinition(
    link.module,
    link.types.map(({ type, as }) => [type, as])
  )
}

export const normalizeExportDefinitions = (
  record: Record<string, JSONType<any, any, string>>
): ExportDefinition => {
  return createExportDefinition(Object.keys(record))
}

export const normalizeCallDefinition = (
  callType: JSONCallType<string, any, any, string, any, any, string>
): CallDefinition => {
  return createCallDefinition(
    callType.name,
    normalizeType(callType.input),
    normalizeType(callType.output),
    callType.description
  )
}

export const normalizeType = (
  jsontype: JSONType<any, any, string>,
  useOrigin: boolean = false
): Type => {
  let jtype = useOrigin ? origin(jsontype) || jsontype : jsontype
  const n = name(jtype)
  if (n) {
    return createNameType(n)
  } else {
    return type(jtype)
  }
}
