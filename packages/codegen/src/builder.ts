import {
  Schema,
  SchemaModule,
  DeriveDefination,
  TypeDefination,
  LinkDefination,
  CallDefination,
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
  let importItems: string[] = ['BuilderSchema', 'BuilderModule']
  let generics: string[] = []
  let props: string[] = []
  let modules: Record<string, string> = {}

  const getModuleProps = (
    id: string,
    derives: Record<string, string>
  ): string => {
    const keys = getKeys(derives)
    if (keys.length === 0) return ''

    importItems.push('JSONType')

    return `${id}Derives: {
      ${keys
        .map((key) => `${key}: JSONType<any, ${derives[key]}, string>`)
        .join('\n')}
    }`
  }

  for (const module of schema.modules) {
    const { code, derives, buildIn } = builderCodegenModule(module)
    modules[module.id] = code
    importItems.push(...buildIn)
    generics.push(...Object.values(derives))
    props.push(getModuleProps(module.id, derives))
  }

  importItems = Array.from(new Set(importItems))

  const getGenerics = (): string => {
    if (generics.length === 0) return ''
    return `<${generics.join(', ')}>`
  }

  const getProps = (): string => {
    if (props.length === 0) return ''
    return props.join('\n')
  }

  return format(
    `import {
    ${importItems.map((item) => `${item},`).join('\n')}
  } from 'jc-builder'

  const createBuilderSchema = ${getGenerics()}(${getProps()}) => {
    ${Object.values(modules).join('\n\n')}

    return {
      entry: '${schema.entry}',
      modules: {
        ${getKeys(modules)
          .map((key) => `${key}: ${key}Module,`)
          .join('\n')}
      },
      calls: ${schema.entry}Module.calls
    }
  }

  export default createBuilderSchema
  `,
    { parser: 'typescript', ...options }
  )
}

export type ModuleCodegen = {
  buildIn: string[]
  code: string
  derives: Record<string, string>
}

export const builderCodegenModule = (module: SchemaModule): ModuleCodegen => {
  const buildIn: string[] = []
  const links: Record<string, string> = {}
  const types: Record<string, string> = {}
  const derives: Record<string, string> = {}
  const exports = module.exportDefination?.names || []
  const calls: Record<string, string> = {}

  const codegenLinkDefination = (linkDefination: LinkDefination) => {
    const moduleName = `${linkDefination.from}Module`
    linkDefination.links.forEach(([from, to]) => {
      buildIn.push('Naming')
      links[to] = `const ${to} = Naming('${to}', ${moduleName}.exports.${from})`
    })
  }

  const codegenTypeDefination = (typeDefination: TypeDefination) => {
    buildIn.push('Naming')
    types[typeDefination.name] = `const ${typeDefination.name} = Naming('${
      typeDefination.name
    }', ${codegenType(typeDefination.type)}, '${
      typeDefination.description ? typeDefination.description : ''
    }')`
  }

  const codegenDeriveDefination = (deriveDefination: DeriveDefination) => {
    derives[deriveDefination.name] = `${deriveDefination.name.toUpperCase()}I`
  }

  const codegenCallDefination = (callDefination: CallDefination) => {
    buildIn.push('createJSONCallType')
    calls[callDefination.name] = `const ${
      callDefination.name
    } = createJSONCallType('${callDefination.name}', ${codegenType(
      callDefination.input
    )}, ${codegenType(callDefination.output)})`
  }

  const codegenType = (type: Type): string => {
    const codegenPrimitiveType = (primitiveType: PrimitiveType): string => {
      switch (primitiveType.type) {
        case PrimitiveTypeEnum.Boolean: {
          buildIn.push('BooleanType')
          return 'BooleanType'
        }
        case PrimitiveTypeEnum.Null: {
          buildIn.push('NullType')
          return 'NullType'
        }
        case PrimitiveTypeEnum.Number: {
          buildIn.push('NumberType')
          return 'NumberType'
        }
        case PrimitiveTypeEnum.String: {
          buildIn.push('StringType')
          return 'StringType'
        }
      }
    }

    const codegenSpecialType = (specialType: SpecialType): string => {
      switch (specialType.type) {
        case SpecialTypeEnum.Any: {
          buildIn.push('AnyType')
          return 'AnyType'
        }
        case SpecialTypeEnum.None: {
          buildIn.push('NoneType')
          return 'NoneType'
        }
      }
    }

    const codegenLiteral = (literal: LiteralType): string => {
      buildIn.push('Literal')
      return `Literal(${JSON.stringify(literal.value)})`
    }

    const codegenListType = (listType: ListType): string => {
      buildIn.push('ListType')
      return `ListType(${codegenType(listType.type)})`
    }

    const codegenObjectType = (objectType: ObjectType): string => {
      buildIn.push('ObjectType')
      return `ObjectType({${objectType.fields.map(
        (field) => `${field.name}: ${codegenType(field.type)},`
      )}})`
    }

    const codegenTupleType = (tupleType: TupleType): string => {
      buildIn.push('Tuple')
      return `Tuple(${tupleType.types
        .map((type) => codegenType(type))
        .join(', ')})`
    }

    const codegenRecordType = (recordType: RecordType): string => {
      buildIn.push('RecordType')
      return `RecordType(${codegenType(recordType.type)})`
    }

    const codegenUnionType = (unionType: UnionType): string => {
      buildIn.push('Union')
      return `Union(${unionType.types
        .map((type) => codegenType(type))
        .join(', ')})`
    }

    const codegenIntersectType = (intersectType: IntersectType): string => {
      buildIn.push('Intersection')
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

  for (const linkDefination of module.linkDefinations) {
    codegenLinkDefination(linkDefination)
  }

  for (const typeDefination of module.typeDefinations) {
    codegenTypeDefination(typeDefination)
  }

  for (const deriveDefination of module.deriveDefinations) {
    codegenDeriveDefination(deriveDefination)
  }

  for (const callDefination of module.callDefinations) {
    codegenCallDefination(callDefination)
  }

  const getGenerics = (): string => {
    const values = Object.values(derives)
    if (values.length === 0) return ''

    return `<${values.join(', ')}>`
  }

  const getProps = (): string => {
    const keys = getKeys(derives)
    if (keys.length === 0) return ''

    buildIn.push('JSONType')

    return `{ ${keys.join(', ')} }: {
      ${keys
        .map((key) => `${key}: JSONType<any, ${derives[key]}, string>`)
        .join('\n')}
    }`
  }

  const getModuleProps = (): string => {
    const keys = getKeys(derives)
    if (keys.length === 0) return ''
    return `${module.id}Derives`
  }

  const code = `const get${titleCase(
    module.id
  )}Module = ${getGenerics()}(${getProps()}) => {
    ${Object.values(links).join('\n')}

    ${Object.values(types).join('\n')}

    ${Object.values(calls).join('\n')}

    return {
      id: '${module.id}',
      links: [
        ${module.linkDefinations
          .map((linkDefination) => {
            return `{
            types: [
              ${linkDefination.links
                .map(([from, to]) => {
                  return `{
                  type: '${from}',
                  as: '${to}'
                },`
                })
                .join('\n')}
            ],
            module: '${linkDefination.from}'
          },`
          })
          .join('\n')}
      ],
      types: {
        ${Object.keys(types)
          .map((type) => `${type},`)
          .join('\n')}
      },
      derives: {
        ${Object.keys(derives)
          .map((type) => `${type},`)
          .join('\n')}
      },
      exports: {
        ${exports.map((type) => `${type},`).join('\n')}
      },
      calls: {
        ${Object.keys(calls)
          .map((type) => `${type},`)
          .join('\n')}
      },
    }
  }
  const ${module.id}Module = get${titleCase(
    module.id
  )}Module(${getModuleProps()})`

  return {
    code,
    buildIn,
    derives,
  }
}

function titleCase(input: string) {
  return input.slice(0, 1).toUpperCase() + input.slice(1)
}

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}
