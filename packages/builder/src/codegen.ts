import type { Schema, SchemaModule } from 'jc-schema'

export const codegen = (schema: Schema): Map<string, string> => {}

export type ModuleCodegen = {
  code: string
}

export const codegenModule = (module: SchemaModule) => {}
