import {
  Schema,
  SchemaModule,
  TypeDefination,
  LinkDefination,
  DeriveDefination,
  ExportDefination,
  CallDefination,
  Type,
  createTypeDefination,
  createDeriveDefination,
  createLinkDefination,
  createExportDefination,
  createSchema,
  createSchemaModule,
  createCallDefination,
} from 'jc-schema'
import { BuilderSchema, BuilderModule, TypeLink, LinkType } from './module'
import { JSONType, type } from './type'
import { JSONCallType } from './call'

export const normalize = (builderSchema: BuilderSchema): Schema => {
  const schema = createSchema(builderSchema.entry)

  for (const key in builderSchema.modules) {
    schema.modules.push(normalizeModule(builderSchema.modules[key]))
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
      normalizeTypeDefination(key, builderModule.types[key])
    )
  }

  for (const key in builderModule.calls) {
    module.callDefinations.push(
      normalizeCallDefination(builderModule.calls[key])
    )
  }

  for (const key in builderModule.derives) {
    module.deriveDefinations.push(
      normalizeDeriveDefination(key, builderModule.derives[key])
    )
  }

  module.exportDefination = normalizeExportDefinations(builderModule.exports)

  return module
}

export const normalizeTypeDefination = (
  name: string,
  type: JSONType<any, any, string>
): TypeDefination => {
  return createTypeDefination(name, normalizeType(type), null)
}

export const normalizeDeriveDefination = (
  name: string,
  type: JSONType<any, any, string>
): DeriveDefination => {
  return createDeriveDefination(name, normalizeType(type), null)
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
    null
  )
}

export const normalizeType = (jsontype: JSONType<any, any, string>): Type => {
  return type(jsontype)
}
