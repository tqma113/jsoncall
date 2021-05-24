import { SchemaError } from './error'
import {
  Schema,
  TypeDefinition,
  DeriveDefinition,
  CallDefinition,
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
  RecordType,
} from './schema'

export const check = (schema: Schema): SchemaError | null => {
  const checkTypeDefination = (
    typeDefination: TypeDefinition
  ): SchemaError | null => {
    if (names.includes(typeDefination.name)) {
      return new SchemaError(`Type '${typeDefination.name}' is exist`)
    } else {
      names.push(typeDefination.name)
    }

    return null
  }

  const checkDeriveDefination = (
    deriveDefination: DeriveDefinition
  ): SchemaError | null => {
    if (names.includes(deriveDefination.name)) {
      return new SchemaError(`Type '${deriveDefination.name}' is exist`)
    } else {
      names.push(deriveDefination.name)
    }

    return null
  }

  const checkCallDefination = (
    callDefination: CallDefinition
  ): SchemaError | null => {
    if (names.includes(callDefination.name)) {
      return new SchemaError(`Type '${callDefination.name}' is exist`)
    } else {
      names.push(callDefination.name)
    }

    const inputResult = checkType(callDefination.input, names)
    if (inputResult !== null) return inputResult

    const outputResult = checkType(callDefination.output, names)
    if (outputResult !== null) return outputResult

    return null
  }

  const checkType = (type: Type, names: string[]): SchemaError | null => {
    const checkPrimitiveType = (
      primitiveType: PrimitiveType
    ): SchemaError | null => {
      if (!Object.values(PrimitiveTypeEnum).includes(primitiveType.type)) {
        return new SchemaError(
          `Unknown PrimitiveType value: ${primitiveType.type}`
        )
      }

      return null
    }

    const checkSpecialType = (specialType: SpecialType): SchemaError | null => {
      if (!Object.values(SpecialTypeEnum).includes(specialType.type)) {
        return new SchemaError(`Unknown SpecialType value: ${specialType.type}`)
      }

      return null
    }

    const checkLiteral = (literal: LiteralType): SchemaError | null => {
      if (
        typeof literal.value !== 'string' &&
        typeof literal.value !== 'number' &&
        typeof literal.value !== 'boolean'
      ) {
        return new SchemaError(`Unknown LiteralType value: ${literal.value}`)
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
          return new SchemaError(`Field: ${field.name} has been exist`)
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

    const checkRecordType = (recordType: RecordType): SchemaError | null => {
      return checkType(recordType.type, names)
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
        return new SchemaError(`Unknown type name: '${nameType.name}'`)
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
      case 'RecordType': {
        return checkRecordType(type)
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

  const names: string[] = []

  for (const typeDefination of schema.typeDefinitions) {
    const result = checkTypeDefination(typeDefination)

    if (result !== null) return result
  }

  for (const deriveDefination of schema.deriveDefinitions) {
    const result = checkDeriveDefination(deriveDefination)

    if (result !== null) return result
  }

  // check type
  for (const typeDefination of schema.typeDefinitions) {
    const result = checkType(
      typeDefination.type,
      names.filter((name) => name !== typeDefination.name)
    )

    if (result !== null) return result
  }

  for (const deriveDefination of schema.deriveDefinitions) {
    const result = checkType(
      deriveDefination.type,
      names.filter((name) => name !== deriveDefination.name)
    )

    if (result !== null) return result
  }

  // call
  for (const callDefination of schema.callDefinitions) {
    const result = checkCallDefination(callDefination)

    if (result !== null) return result
  }

  return null
}
