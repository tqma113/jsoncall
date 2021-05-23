import {
  Schema,
  SchemaModule,
  DeriveDefinition,
  TypeDefinition,
  LinkDefinition,
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

  return format(
    `import {
    ${importItems.map((item) => `${item},`).join('\n')}
  } from 'jc-builder'
  
  export ${code}`,
    { parser: 'typescript', ...options }
  )
}

export type SchemaCodegen = {
  importItems: string[]
  generics: string[]
  props: Record<string, string>
  code: string
  calls: string[]
}

export const builderCodegenSchema = (schema: Schema): SchemaCodegen => {
  let importItems: string[] = []
  let generics: string[] = []
  let props: Record<string, string> = {}
  let modules: Record<string, string> = {}
  let calls: string[] = []

  const getModuleProps = (derives: Record<string, string>): string => {
    const keys = getKeys(derives)
    if (keys.length === 0) return ''

    importItems.push('JSONType')

    return `{
      ${keys
        .map((key) => `${key}: JSONType<any, ${derives[key]}, string>`)
        .join('\n')}
    }`
  }

  for (const module of schema.modules) {
    const {
      code,
      derives,
      buildIn,
      calls: moduleCalls,
    } = builderCodegenModule(module)
    modules[module.id] = code
    importItems.push(...buildIn)
    generics.push(...Object.values(derives))
    const ps = getModuleProps(derives)
    if (ps) {
      props[module.id] = ps
    }
    if (module.id === schema.entry) {
      calls = moduleCalls
    }
  }

  importItems = Array.from(new Set(importItems))

  const code = `const createBuilderSchema = ${genGenerics(generics)}(${genProps(
    props
  )}) => {
    ${Object.values(modules).join('\n\n')}

    return {
      entry: '${schema.entry}',
      modules: [
        ${getKeys(modules)
          .map((key) => `${key}Module,`)
          .join('\n')}
      ],
      calls: ${schema.entry}Module.calls
    }
  }`

  return {
    importItems,
    generics,
    props,
    code,
    calls,
  }
}

export type ModuleCodegen = {
  buildIn: string[]
  code: string
  derives: Record<string, string>
  calls: string[]
}

export const builderCodegenModule = (module: SchemaModule): ModuleCodegen => {
  const buildIn: string[] = []
  const links: Record<string, string> = {}
  const types: Record<string, string> = {}
  const derives: Record<string, string> = {}
  const exports = module.exportDefinition?.names || []
  const calls: Record<string, string> = {}

  const codegenLinkDefinition = (linkDefinition: LinkDefinition) => {
    const moduleName = `${linkDefinition.from}Module`
    linkDefinition.links.forEach(([from, to]) => {
      buildIn.push('Naming')
      links[to] = `const ${to} = Naming('${to}', ${moduleName}.exports.${from})`
    })
  }

  const codegenTypeDefinition = (typeDefinition: TypeDefinition) => {
    buildIn.push('Naming')
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
    buildIn.push('createJSONCallType')
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
      ).join('')}})`
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

  for (const linkDefinition of module.linkDefinitions) {
    codegenLinkDefinition(linkDefinition)
  }

  for (const typeDefinition of module.typeDefinitions) {
    codegenTypeDefinition(typeDefinition)
  }

  for (const deriveDefinition of module.deriveDefinitions) {
    codegenDeriveDefinition(deriveDefinition)
  }

  for (const callDefinition of module.callDefinitions) {
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
        ${module.linkDefinitions
          .map((linkDefinition) => {
            return `{
            types: [
              ${linkDefinition.links
                .map(([from, to]) => {
                  return `{
                  type: '${from}',
                  as: '${to}'
                },`
                })
                .join('\n')}
            ],
            module: '${linkDefinition.from}'
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
    calls: Object.keys(calls),
  }
}

export const genGenerics = (generics: string[]): string => {
  if (generics.length === 0) return ''
  return `<${generics.join(', ')}>`
}

export const genProps = (props: Record<string, string>): string => {
  if (Object.keys(props).length === 0) return ''
  return Object.entries(props)
    .map(([key, value]) => `${key}Derives: ${value}`)
    .join('\n')
}

export const genPropsNames = (props: Record<string, string>): string => {
  if (Object.keys(props).length === 0) return ''
  return Object.keys(props)
    .map((key) => `${key}Derives`)
    .join(', ')
}

function titleCase(input: string) {
  return input.slice(0, 1).toUpperCase() + input.slice(1)
}

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}
