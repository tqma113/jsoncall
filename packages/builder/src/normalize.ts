import {
  Schema,
  SchemaModule,
  Type,
  TypeDefination,
  LinkDefination,
  DeriveDefination,
  ExportDefination,
  CallDefination,
  createTypeDefination,
  createDeriveDefination,
  createLinkDefination,
  createExportDefination,
  createSchema,
  createSchemaModule,
  createCallDefination,
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
    module.linkDefinations.push(normalizeLinkDefination(link))
  }

  for (const key in builderModule.types) {
    module.typeDefinations.push(
      normalizeTypeDefination(
        key,
        builderModule.types[key],
        desc(builderModule.types[key])
      )
    )
  }

  for (const key in builderModule.calls) {
    module.callDefinations.push(
      normalizeCallDefination(builderModule.calls[key])
    )
  }

  for (const key in builderModule.derives) {
    module.deriveDefinations.push(
      normalizeDeriveDefination(
        key,
        builderModule.derives[key],
        desc(builderModule.derives[key])
      )
    )
  }

  module.exportDefination = normalizeExportDefinations(builderModule.exports)

  return module
}

export const normalizeTypeDefination = (
  name: string,
  type: JSONType<any, any, string>,
  description: string | null
): TypeDefination => {
  return createTypeDefination(name, normalizeType(type, true), description)
}

export const normalizeDeriveDefination = (
  name: string,
  type: JSONType<any, any, string>,
  description: string | null
): DeriveDefination => {
  return createDeriveDefination(name, normalizeType(type), description)
}

export const normalizeLinkDefination = (link: TypeLink): LinkDefination => {
  return createLinkDefination(
    link.module,
    link.types.map(({ type, as }) => [type, as])
  )
}

export const normalizeExportDefinations = (
  record: Record<string, JSONType<any, any, string>>
): ExportDefination => {
  return createExportDefination(Object.keys(record))
}

export const normalizeCallDefination = (
  callType: JSONCallType<string, any, any, string, any, any, string>
): CallDefination => {
  return createCallDefination(
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
