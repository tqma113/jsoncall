import type { JSONType } from './type'
import type { JSONCallType } from './call'

export type BuilderSchema = {
  entry: string
  modules: BuilderModule[]
}

export type BuilderModule = {
  id: string
  links: TypeLink[]
  types: Record<string, JSONType<any, any, string>>
  derives: Record<string, JSONType<any, any, string>>
  calls: Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
}

export type TypeLink = {
  types: string[]
  module: BuilderModule
}
