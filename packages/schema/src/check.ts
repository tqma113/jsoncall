import { SchemaError } from './error'
import {
  Schema,
  SchemaModule,
  TypeDefination,
  DeriveDefination,
  LinkDefination,
  ExportDefination,
  CallDefination,
  Type,
  PrimitiveType,
  SpecialType,
  LiteralType,
  ListType,
  ObjectType,
  TupleType,
  UnionType,
  IntersectType,
  NameType,
  PrimitiveTypeEnum,
  SpecialTypeEnum,
} from './schema'

export const check = (schema: Schema): SchemaError | null => {
  const moduleIds: string[] = []
  const checkSchemaModule = (module: SchemaModule): SchemaError | null => {
    if (moduleIds.includes(module.id)) {
      return null
    } else {
      moduleIds.push(module.id)
    }

    const checkLinkDefination = (
      linkDefination: LinkDefination
    ): SchemaError | null => {
      const fromModule = schema.modules.find(
        (module) => module.id === linkDefination.from
      )
      if (fromModule) {
        const exports = fromModule.exportDefinations
          .map((exportDefination) => exportDefination.names)
          .flat()
        for (const [from, to] of linkDefination.links) {
          if (!exports.includes(from)) {
            return new SchemaError(
              `Type '${from}' has not been exported from module "${linkDefination.from}"`,
              module.id
            )
          }
          if (names.includes(to)) {
            return new SchemaError(`Type '${to}' is exist`, module.id)
          } else {
            names.push(to)
          }
        }
      } else {
        return new SchemaError(
          `Unknown module id: ${linkDefination.from}`,
          module.id
        )
      }
      return null
    }

    const checkTypeDefination = (
      typeDefination: TypeDefination
    ): SchemaError | null => {
      if (names.includes(typeDefination.name)) {
        return new SchemaError(
          `Type '${typeDefination.name}' is exist`,
          module.id
        )
      } else {
        names.push(typeDefination.name)
      }
      return null
    }

    const checkDeriveDefination = (
      deriveDefination: DeriveDefination
    ): SchemaError | null => {
      if (names.includes(deriveDefination.name)) {
        return new SchemaError(
          `Type '${deriveDefination.name}' is exist`,
          module.id
        )
      } else {
        names.push(deriveDefination.name)
      }
      return null
    }

    const checkExportDefination = (
      exportDefination: ExportDefination
    ): SchemaError | null => {
      const repeatItem = findRepeated(exportDefination.names)
      if (repeatItem) {
        return new SchemaError(
          `Export type name: '${repeatItem}' twice`,
          module.id
        )
      }

      for (const name of exportDefination.names) {
        if (!names.includes(name)) {
          return new SchemaError(`Unknown type name: '${name}'`, module.id)
        }
      }
      return null
    }

    const checkCallDefination = (
      callDefination: CallDefination
    ): SchemaError | null => {
      if (names.includes(callDefination.name)) {
        return new SchemaError(
          `Type '${callDefination.name}' is exist`,
          schema.entry
        )
      } else {
        names.push(callDefination.name)
      }

      const inputResult = checkType(callDefination.input, exportNames)
      if (inputResult !== null) return inputResult

      const outputResult = checkType(callDefination.output, exportNames)
      if (outputResult !== null) return outputResult

      return null
    }

    const names: string[] = []

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

    for (const exportDefination of module.exportDefinations) {
      const result = checkExportDefination(exportDefination)

      if (result !== null) return result
    }
    const exportNames = module.exportDefinations
      .map((exportDefination) => exportDefination.names)
      .flat()

    // check type
    for (const typeDefination of module.typeDefinations) {
      const result = checkType(typeDefination.type, names)

      if (result !== null) return result
    }

    for (const deriveDefination of module.deriveDefinations) {
      const result = checkType(deriveDefination.type, names)

      if (result !== null) return result
    }

    // call
    for (const callDefination of module.callDefinations) {
      const result = checkCallDefination(callDefination)

      if (result !== null) return result
    }

    return null
  }

  const entryModule = schema.modules.find(
    (module) => module.id === schema.entry
  )
  if (!entryModule) {
    return new SchemaError(`Unknown schema entry`, schema.entry)
  }

  for (const module of schema.modules) {
    const result = checkSchemaModule(module)

    if (result !== null) return result
  }

  return null
}

const checkType = (type: Type, names: string[]): SchemaError | null => {
  const checkPrimitiveType = (
    primitiveType: PrimitiveType
  ): SchemaError | null => {
    if (!Object.values(PrimitiveTypeEnum).includes(primitiveType.type)) {
      return new SchemaError(
        `Unknown PrimitiveType value: ${primitiveType.type}`,
        module.id
      )
    }

    return null
  }

  const checkSpecialType = (specialType: SpecialType): SchemaError | null => {
    if (!Object.values(SpecialTypeEnum).includes(specialType.type)) {
      return new SchemaError(
        `Unknown SpecialType value: ${specialType.type}`,
        module.id
      )
    }

    return null
  }

  const checkLiteral = (literal: LiteralType): SchemaError | null => {
    if (
      typeof literal.value !== 'string' &&
      typeof literal.value !== 'number' &&
      typeof literal.value !== 'boolean'
    ) {
      return new SchemaError(
        `Unknown LiteralType value: ${literal.value}`,
        module.id
      )
    }

    return null
  }

  const checkListType = (listType: ListType): SchemaError | null => {
    return checkType(listType.type, names)
  }

  const checkObjectType = (objectType: ObjectType): SchemaError | null => {
    const fields: string[] = []

    for (const field of objectType.fields) {
      if (fields.includes(field.name)) {
        return new SchemaError(`Field: ${field.name} has been exist`, module.id)
      } else {
        fields.push(field.name)
        const result = checkType(field.type, names)

        if (result !== null) return result
      }
    }

    return null
  }

  const checkTupleType = (tupleType: TupleType): SchemaError | null => {
    for (const type of tupleType.types) {
      const result = checkType(type, names)

      if (result !== null) return result
    }

    return null
  }

  const checkUnionType = (unionType: UnionType): SchemaError | null => {
    for (const type of unionType.types) {
      const result = checkType(type, names)

      if (result !== null) return result
    }

    return null
  }

  const checkIntersectType = (
    intersectType: IntersectType
  ): SchemaError | null => {
    for (const type of intersectType.types) {
      const result = checkType(type, names)

      if (result !== null) return result
    }

    return null
  }

  const checkNameType = (nameType: NameType): SchemaError | null => {
    if (!names.includes(nameType.name)) {
      return new SchemaError(`Unknown type name: '${nameType.name}'`, module.id)
    }

    return null
  }

  switch (type.kind) {
    case 'PrimitiveType': {
      return checkPrimitiveType(type)
    }
    case 'SpecialType': {
      return checkSpecialType(type)
    }
    case 'Literal': {
      return checkLiteral(type)
    }
    case 'ListType': {
      return checkListType(type)
    }
    case 'ObjectType': {
      return checkObjectType(type)
    }
    case 'TupleType': {
      return checkTupleType(type)
    }
    case 'UnionType': {
      return checkUnionType(type)
    }
    case 'IntersectType': {
      return checkIntersectType(type)
    }
    case 'NameType': {
      return checkNameType(type)
    }
  }
}

const findRepeated = (list: string[]): string | false => {
  const map: Record<string, boolean> = {}

  for (const item of list) {
    if (map[item]) {
      return item
    }
    map[item] = true
  }

  return false
}
