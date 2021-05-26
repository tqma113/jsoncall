import {
  Schema,
  DeriveDefinition,
  TypeDefinition,
  CallDefinition,
  Type,
  PrimitiveType,
  SpecialType,
  LiteralType,
  ListType,
  ObjectType,
  TupleType,
  RecordType,
  UnionType,
  IntersectType,
  NameType,
  PrimitiveTypeEnum,
  SpecialTypeEnum,
} from 'jc-schema'
import { format, Options } from 'prettier'

export const builderCodegen = (schema: Schema, options?: Options): string => {
  const { importItems, code } = builderCodegenSchema(schema)

  const endCode = `import {
    ${importItems.map((item) => `${item},`).join('\n')}
  } from 'jc-builder'
  
  export ${code}`

  return format(endCode, { parser: 'typescript', ...options })
}

export type SchemaCodegen = {
  importItems: string[]
  generics: string[]
  derives: Record<string, string>
  code: string
  calls: string[]
}

export const builderCodegenSchema = (
  schema: Schema
): SchemaCodegen => {
  const importItems: string[] = []
  const types: Record<string, string> = {}
  const derives: Record<string, string> = {}
  const calls: Record<string, string> = {}

  const codegenTypeDefinition = (typeDefinition: TypeDefinition) => {
    importItems.push('Naming')
    types[typeDefinition.name] = `const ${typeDefinition.name} = Naming('${
      typeDefinition.name
    }', ${codegenType(typeDefinition.type)}, '${
      typeDefinition.description ? typeDefinition.description : ''
    }')`
  }

  const codegenDeriveDefinition = (deriveDefinition: DeriveDefinition) => {
    derives[deriveDefinition.name] = `${deriveDefinition.name.toUpperCase()}I`
  }

  const codegenCallDefinition = (callDefinition: CallDefinition) => {
    importItems.push('createJSONCallType')
    calls[callDefinition.name] = `const ${
      callDefinition.name
    } = createJSONCallType('${callDefinition.name}', ${codegenType(
      callDefinition.input
    )}, ${codegenType(callDefinition.output)})`
  }

  const codegenType = (type: Type): string => {
    const codegenPrimitiveType = (primitiveType: PrimitiveType): string => {
      switch (primitiveType.type) {
        case PrimitiveTypeEnum.Boolean: {
          importItems.push('BooleanType')
          return 'BooleanType'
        }
        case PrimitiveTypeEnum.Null: {
          importItems.push('NullType')
          return 'NullType'
        }
        case PrimitiveTypeEnum.Number: {
          importItems.push('NumberType')
          return 'NumberType'
        }
        case PrimitiveTypeEnum.String: {
          importItems.push('StringType')
          return 'StringType'
        }
      }
    }

    const codegenSpecialType = (specialType: SpecialType): string => {
      switch (specialType.type) {
        case SpecialTypeEnum.Any: {
          importItems.push('AnyType')
          return 'AnyType'
        }
        case SpecialTypeEnum.None: {
          importItems.push('NoneType')
          return 'NoneType'
        }
      }
    }

    const codegenLiteral = (literal: LiteralType): string => {
      importItems.push('Literal')
      return `Literal(${JSON.stringify(literal.value)})`
    }

    const codegenListType = (listType: ListType): string => {
      importItems.push('ListType')
      return `ListType(${codegenType(listType.type)})`
    }

    const codegenObjectType = (objectType: ObjectType): string => {
      importItems.push('ObjectType')
      return `ObjectType({${objectType.fields
        .map((field) => `${field.name}: ${codegenType(field.type)},`)
        .join('')}})`
    }

    const codegenTupleType = (tupleType: TupleType): string => {
      importItems.push('Tuple')
      return `Tuple(${tupleType.types
        .map((type) => codegenType(type))
        .join(', ')})`
    }

    const codegenRecordType = (recordType: RecordType): string => {
      importItems.push('RecordType')
      return `RecordType(${codegenType(recordType.type)})`
    }

    const codegenUnionType = (unionType: UnionType): string => {
      importItems.push('Union')
      return `Union(${unionType.types
        .map((type) => codegenType(type))
        .join(', ')})`
    }

    const codegenIntersectType = (intersectType: IntersectType): string => {
      importItems.push('Intersection')
      return `Intersection(${intersectType.types
        .map((type) => codegenType(type))
        .join(', ')})`
    }

    const codegenNameType = (nameType: NameType): string => {
      return nameType.name
    }

    switch (type.kind) {
      case 'PrimitiveType': {
        return codegenPrimitiveType(type)
      }
      case 'SpecialType': {
        return codegenSpecialType(type)
      }
      case 'Literal': {
        return codegenLiteral(type)
      }
      case 'ListType': {
        return codegenListType(type)
      }
      case 'ObjectType': {
        return codegenObjectType(type)
      }
      case 'TupleType': {
        return codegenTupleType(type)
      }
      case 'RecordType': {
        return codegenRecordType(type)
      }
      case 'UnionType': {
        return codegenUnionType(type)
      }
      case 'IntersectType': {
        return codegenIntersectType(type)
      }
      case 'NameType': {
        return codegenNameType(type)
      }
    }
  }

  for (const typeDefinition of schema.typeDefinitions) {
    codegenTypeDefinition(typeDefinition)
  }

  for (const deriveDefinition of schema.deriveDefinitions) {
    codegenDeriveDefinition(deriveDefinition)
  }

  for (const callDefinition of schema.callDefinitions) {
    codegenCallDefinition(callDefinition)
  }

  const getGenerics = (): string => {
    const values = Object.values(derives)
    if (values.length === 0) return ''

    return `<${values.join(', ')}>`
  }

  const getProps = (): string => {
    const keys = getKeys(derives)
    if (keys.length === 0) return ''

    importItems.push('JSONType')

    return `{ ${keys.join(', ')} }: {
      ${keys
        .map((key) => `${key}: JSONType<any, ${derives[key]}, string>`)
        .join('\n')}
    }`
  }

  importItems.push('createBuilderSchema')

  const code = `const createBS = ${getGenerics()}(${getProps()}) => {
    ${Object.values(types).join('\n')}

    ${Object.values(calls).join('\n')}

    return createBuilderSchema(
      {
        ${Object.keys(types)
          .map((type) => `${type},`)
          .join('\n')}
      },
      {
        ${Object.keys(derives)
          .map((type) => `${type},`)
          .join('\n')}
      },
      {
        ${Object.keys(calls)
          .map((type) => `${type},`)
          .join('\n')}
      },
    )
  }`

  const generics = Object.values(derives)

  return {
    importItems: Array.from(new Set(importItems)),
    calls: Object.keys(calls),
    code,
    generics,
    derives,
  }
}

export const genGenerics = (generics: string[]): string => {
  if (generics.length === 0) return ''
  return `<${generics.join(', ')}>`
}

export const genPropsNames = (props: Record<string, string>): string => {
  if (Object.keys(props).length === 0) return ''
  return Object.keys(props)
    .map((key) => `${key}Derives`)
    .join(', ')
}

export const genProps = (derives: Record<string, string>): string => {
  const keys = getKeys(derives)
  if (keys.length === 0) return ''

  return `{
    ${keys
      .map((key) => `${key}: JSONType<any, ${derives[key]}, string>`)
      .join('\n')}
  }`
}

export function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}
