import type { Schema, SchemaModule } from 'jc-schema'

export const codegen = (schema: Schema) => {}

export type ModuleCodegen = {
  buildIn: string[]
  code: string
}

export const codegenModule = (module: SchemaModule) => {}
