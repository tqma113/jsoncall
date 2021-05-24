import type {
  Schema,
  DeriveDefinition,
  CallDefinition,
  TypeDefinition,
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

export const codegen = (schema: Schema): string => {
  const blocks: string[] = []

  if (schema.typeDefinitions.length > 0) {
    blocks.push(schema.typeDefinitions.map(codegenTypeDefinition).join('\n\n'))
  }

  if (schema.deriveDefinitions.length > 0) {
    blocks.push(
      schema.deriveDefinitions.map(codegenDeriveDefinition).join('\n\n')
    )
  }

  if (schema.callDefinitions.length > 0) {
    blocks.push(schema.callDefinitions.map(codegenCallDefinition).join('\n\n'))
  }

  return blocks.join('\n\n\n')
}

export const codegenDeriveDefinition = (
  deriveDefinition: DeriveDefinition
): string => {
  const comments =
    deriveDefinition.description !== null
      ? `${deriveDefinition.description
          .split('\n')
          .map((comment) => `#${comment}`)
          .join('\n')}\n`
      : ''
  return `${comments}derive ${deriveDefinition.name} from ${codegenType(
    deriveDefinition.type
  )}`
}

export const codegenCallDefinition = (
  callDefinition: CallDefinition
): string => {
  const comments =
    callDefinition.description !== null
      ? `${callDefinition.description
          .split('\n')
          .map((comment) => `#${comment}`)
          .join('\n')}\n`
      : ''
  return `${comments}call ${callDefinition.name}: ${codegenType(
    callDefinition.input
  )} => ${codegenType(callDefinition.output)}`
}

export const codegenTypeDefinition = (
  typeDefinition: TypeDefinition
): string => {
  const comments =
    typeDefinition.description !== null
      ? `${typeDefinition.description
          .split('\n')
          .map((comment) => `#${comment}`)
          .join('\n')}\n`
      : ''

  return `${comments}type ${typeDefinition.name} = ${codegenType(
    typeDefinition.type
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
