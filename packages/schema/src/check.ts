import { SchemaError } from './error'
import type {
  Schema,
  SchemaModule,
  TypeDefination,
  DeriveDefination,
  CallDefination,
  LinkDefination,
  ExportDefination,
} from './schema'

export const check = (schema: Schema): SchemaError | null => {
  const checkSchemaModule = (module: SchemaModule): SchemaError | null => {
    const checkTypeDefination = (
      typeDefination: TypeDefination
    ): SchemaError | null => {
      return null
    }

    const checkDeriveDefination = (
      deriveDefination: DeriveDefination
    ): SchemaError | null => {
      return null
    }

    const checkCallDefination = (
      callDefination: CallDefination
    ): SchemaError | null => {
      return null
    }

    const checkLinkDefination = (
      linkDefination: LinkDefination
    ): SchemaError | null => {
      return null
    }

    const checkExportDefination = (
      exportDefination: ExportDefination
    ): SchemaError | null => {
      return null
    }

    for (const linkDefination of module.linkDefinations) {
      const result = checkLinkDefination(linkDefination)

      if (result !== null) return result
    }

    for (const typeDefination of module.typeDefinations) {
      const result = checkTypeDefination(typeDefination)

      if (result !== null) return result
    }

    for (const deriveDefination of module.deriveDefinations) {
      const result = checkDeriveDefination(deriveDefination)

      if (result !== null) return result
    }

    for (const callDefination of module.callDefinations) {
      const result = checkCallDefination(callDefination)

      if (result !== null) return result
    }

    for (const exportDefination of module.exportDefinations) {
      const result = checkExportDefination(exportDefination)

      if (result !== null) return result
    }

    return null
  }

  if (!schema.modules.some((module) => module.id === schema.entry)) {
    return new SchemaError(`Unknown schema entry`, schema.entry)
  }

  for (const module of schema.modules) {
    const result = checkSchemaModule(module)

    if (result !== null) return result
  }

  return null
}
