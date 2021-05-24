import {
  Schema,
  Type,
  TypeDefinition,
  DeriveDefinition,
  CallDefinition,
  createTypeDefinition,
  createDeriveDefinition,
  createSchema,
  createCallDefinition,
  createNameType,
} from 'jc-schema'
import { BuilderSchema } from './module'
import { JSONType, type, name, desc, origin } from './types'
import { JSONCallType } from './call'

export const normalize = <
  TS extends Record<string, JSONType<any, any, string>>,
  DS extends Record<string, JSONType<any, any, string>>,
  CS extends Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
>(
  builderSchema: BuilderSchema<TS, DS, CS>
): Schema => {
  const schema = createSchema()

  for (const key in builderSchema.types) {
    schema.typeDefinitions.push(
      normalizeTypeDefinition(
        key,
        builderSchema.types[key],
        desc(builderSchema.types[key])
      )
    )
  }

  for (const key in builderSchema.calls) {
    schema.callDefinitions.push(
      normalizeCallDefinition(builderSchema.calls[key])
    )
  }

  for (const key in builderSchema.derives) {
    schema.deriveDefinitions.push(
      normalizeDeriveDefinition(
        key,
        builderSchema.derives[key],
        desc(builderSchema.derives[key])
      )
    )
  }

  return schema
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
