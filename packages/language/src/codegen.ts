import type {
  Schema,
  SchemaModule,
  LinkDefination,
  DeriveDefination,
  CallDefination,
  ExportDefination,
  TypeDefination,
  Type,
  LiteralType,
  ListType,
  ObjectType,
  ObjectTypeFiled,
  TupleType,
  RecordType,
  UnionType,
  IntersectType,
} from 'jc-schema'

export const codegen = (schema: Schema): Map<string, string> => {
  const moduleMap: Map<string, string> = new Map()

  for (const module of schema.modules) {
    moduleMap.set(module.id, codegenModule(module))
  }

  return moduleMap
}

export const codegenModule = (module: SchemaModule): string => {
  const blocks: string[] = []

  if (module.linkDefinations.length > 0) {
    blocks.push(module.linkDefinations.map(codegenLinkDefination).join('\n'))
  }

  if (module.typeDefinations.length > 0) {
    blocks.push(module.typeDefinations.map(codegenTypeDefination).join('\n\n'))
  }

  if (module.deriveDefinations.length > 0) {
    blocks.push(
      module.deriveDefinations.map(codegenDeriveDefination).join('\n\n')
    )
  }

  if (module.exportDefination !== null) {
    blocks.push(codegenExportDefination(module.exportDefination))
  }

  if (module.callDefinations.length > 0) {
    blocks.push(module.callDefinations.map(codegenCallDefination).join('\n\n'))
  }

  return blocks.join('\n\n\n')
}

export const codegenLinkDefination = (
  linkDefination: LinkDefination
): string => {
  const items = linkDefination.links
    .map(([from, to]) => {
      if (from === to) {
        return from
      } else {
        return `${from} as ${to}`
      }
    })
    .join(', ')
  return `import { ${items} } from "${linkDefination.from}"`
}

export const codegenDeriveDefination = (
  deriveDefination: DeriveDefination
): string => {
  const comments =
    deriveDefination.description !== null
      ? `${deriveDefination.description
          .split('\n')
          .map((comment) => `#${comment}`)
          .join('\n')}\n`
      : ''
  return `${comments}derive ${deriveDefination.name} from ${codegenType(
    deriveDefination.type
  )}`
}

export const codegenCallDefination = (
  callDefination: CallDefination
): string => {
  const comments =
    callDefination.description !== null
      ? `${callDefination.description
          .split('\n')
          .map((comment) => `#${comment}`)
          .join('\n')}\n`
      : ''
  return `${comments}call ${callDefination.name}: ${codegenType(
    callDefination.input
  )} => ${codegenType(callDefination.output)}`
}

export const codegenExportDefination = (
  exportDefination: ExportDefination
): string => {
  const items = exportDefination.names.map((name) => `  ${name},`).join('\n')
  return `export {\n${items}\n}`
}

export const codegenTypeDefination = (
  typeDefination: TypeDefination
): string => {
  const comments =
    typeDefination.description !== null
      ? `${typeDefination.description
          .split('\n')
          .map((comment) => `#${comment}`)
          .join('\n')}\n`
      : ''

  return `${comments}type ${typeDefination.name} = ${codegenType(
    typeDefination.type
  )}`
}

export const codegenType = (type: Type, depth: number = 0): string => {
  const codegenLiteral = (literalType: LiteralType): string => {
    if (typeof literalType.value === 'string') {
      return `"${literalType.value}"`
    } else {
      return '' + literalType.value
    }
  }

  const codegenListType = (listType: ListType): string => {
    return `[${codegenType(listType.type, depth)}]`
  }

  const codegeObjectType = (objectType: ObjectType): string => {
    const prefix = Array(depth).fill('  ').join()
    const fields = objectType.fields
      .map((field) => codegeObjectTypeField(field, depth + 1))
      .join(',\n')

    return `{\n${fields}\n${prefix}}`
  }

  const codegeObjectTypeField = (
    ObjectTypeFiled: ObjectTypeFiled,
    depth: number = 1
  ): string => {
    const prefix = Array(depth).fill('  ').join('')
    const comments =
      ObjectTypeFiled.description !== null
        ? `${ObjectTypeFiled.description
            .split('\n')
            .map((comment) => `${prefix}#${comment}\n`)
            .join('')}`
        : ''

    return `${comments}${prefix}${ObjectTypeFiled.name}: ${codegenType(
      ObjectTypeFiled.type,
      depth
    )}`
  }

  const codegenTupleType = (tupleType: TupleType): string => {
    return `(${tupleType.types
      .map((type) => codegenType(type, depth))
      .join(', ')})`
  }

  const codegenRecordType = (tupleType: RecordType): string => {
    return `<${codegenType(tupleType.type, depth)}>`
  }

  const codegenUnionType = (unionType: UnionType): string => {
    return unionType.types.map((type) => codegenType(type, depth)).join(' | ')
  }

  const codegenIntersectType = (intersectType: IntersectType): string => {
    return intersectType.types
      .map((type) => codegenType(type, depth))
      .join(' & ')
  }

  switch (type.kind) {
    case 'PrimitiveType':
    case 'SpecialType': {
      return type.type
    }
    case 'Literal': {
      return codegenLiteral(type)
    }
    case 'ListType': {
      return codegenListType(type)
    }
    case 'ObjectType': {
      return codegeObjectType(type)
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
      return type.name
    }
  }
}
