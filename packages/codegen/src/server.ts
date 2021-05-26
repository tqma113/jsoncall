import { format, Options } from 'prettier'
import {
  builderCodegenSchema,
  genGenerics,
  genProps,
} from './builder'
import type { Schema } from 'jc-schema'
import type { Formatter } from './index'

const identify = <I>(input: I) => input

export const serverCodegen = (schema: Schema, format: Formatter = identify): string => {
  const {
    importItems: builderImport,
    generics,
    derives,
    code,
  } = builderCodegenSchema(schema)

  return format(
    `import {
      ${builderImport.map((item) => `${item},`).join('\n')}
    } from 'jc-builder'
    import { createService } from 'jc-server'

    ${code}
    
    export const createServerService = ${genGenerics(
      generics
    )}(derives: ${genProps(derives)}) => {
      const builderSchema = createBS(derives)
      return createService(builderSchema, JSON.stringify, JSON.parse)
    }`
  )
}
